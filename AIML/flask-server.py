import json
import random
import os
from typing import List, Dict, Any, Tuple
import nltk
import torch
from flask_cors import CORS
import torch.nn as nn
from flask import Flask, request, jsonify, render_template

# Download required NLTK data silently
nltk.download('wordnet', quiet=True)
nltk.download('punkt', quiet=True)

# Neural network model for chatbot
class ChatbotModel(nn.Module):
    def __init__(self, input_size: int, output_size: int):
        super(ChatbotModel, self).__init__()
        self.fc1 = nn.Linear(input_size, 512)
        self.fc2 = nn.Linear(512, 256)
        self.fc3 = nn.Linear(256, 128)
        self.fc4 = nn.Linear(128, 64)
        self.fc5 = nn.Linear(64, output_size)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)
        self.batch_norm1 = nn.BatchNorm1d(512, track_running_stats=True)
        self.batch_norm2 = nn.BatchNorm1d(256, track_running_stats=True)
        self.batch_norm3 = nn.BatchNorm1d(128, track_running_stats=True)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        if x.dim() == 1:
            x = x.unsqueeze(0)
        x = self.relu(self.batch_norm1(self.fc1(x)))
        x = self.dropout(x)
        x = self.relu(self.batch_norm2(self.fc2(x)))
        x = self.dropout(x)
        x = self.relu(self.batch_norm3(self.fc3(x)))
        x = self.dropout(x)
        x = self.relu(self.fc4(x))
        x = self.dropout(x)
        x = self.fc5(x)
        return x

# Chatbot logic handler
class ChatbotServer:
    def __init__(self, model_path: str, dimensions_path: str):
        """Initialize the chatbot server with model and dimensions data."""
        try:
            with open(dimensions_path, 'r', encoding='utf-8') as f:
                self.dimensions = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            raise RuntimeError(f"Failed to load dimensions: {str(e)}")

        self.vocabulary: List[str] = self.dimensions['vocabulary']
        self.intents: List[str] = self.dimensions['intents']
        self.intents_responses: Dict[str, List[str]] = self.dimensions['intents_responses']
        
        self.model = ChatbotModel(self.dimensions['input_size'], self.dimensions['output_size'])
        try:
            self.model.load_state_dict(torch.load(model_path, weights_only=True))
            self.model.eval()
        except Exception as e:
            raise RuntimeError(f"Failed to load model: {str(e)}")

        self.lemmatizer = nltk.WordNetLemmatizer()

    @staticmethod
    def tokenize_and_lemmatize(text: str) -> List[str]:
        """Convert text to a list of lemmatized tokens."""
        words = nltk.word_tokenize(text.lower())
        return [nltk.WordNetLemmatizer().lemmatize(word) for word in words]

    def bag_of_words(self, words: List[str]) -> List[int]:
        """Generate a bag-of-words representation."""
        return [1 if word in words else 0 for word in self.vocabulary]

    def select_best_response(self, input_words: List[str], responses: List[str]) -> str:
        """Choose the most relevant response based on input context."""
        time_keywords = {"when", "date", "time", "schedule"}
        switch_keywords = {"switch", "transfer", "change"}
        fee_keywords = {"fee", "fees", "cost", "price"}
        input_words_set = set(input_words)

        is_time_question = bool(input_words_set & time_keywords)
        is_switch_question = bool(input_words_set & switch_keywords)
        is_fee_question = bool(input_words_set & fee_keywords)

        best_score = -1
        best_response = responses[0] if responses else "No response available."

        for response in responses:
            response_words = set(self.tokenize_and_lemmatize(response))
            score = len(input_words_set & response_words)

            if is_time_question and any(word in response.lower() for word in ["next", "october", "schedule", "date"]):
                score += 10
            if is_switch_question and any(word in response.lower() for word in ["switch", "advisor", "portal", "transfer"]):
                score += 10
            if is_fee_question and any(word in response.lower() for word in ["fee", "fees", "cost", "price"]):
                score += 10

            if score > best_score:
                best_score = score
                best_response = response

        return best_response

    def process_message(self, input_message: str) -> str:
        """Process user input and return a response."""
        if not input_message.strip():
            return "Please enter a valid message."

        words = self.tokenize_and_lemmatize(input_message)
        bag = self.bag_of_words(words)
        bag_tensor = torch.tensor([bag], dtype=torch.float32)

        with torch.no_grad():
            predictions = self.model(bag_tensor)
            probs = torch.softmax(predictions, dim=1)
            top_prob, top_idx = torch.max(probs, dim=1)
            if top_prob.item() < 0.7:
                return "I'm not sure how to answer that. Can you rephrase or ask something else?"
            
            predicted_intent = self.intents[top_idx.item()]
            responses = self.intents_responses.get(predicted_intent, ["I don't have a response for that."])
            return self.select_best_response(words, responses)

# Timetable generation logic
class TimetableGenerator:
    def __init__(self):
        self.depts = ['Computer Engineering', 'Information Technology', 'Mechanical Engineering', 
                      'Civil Engineering', 'Bio-medical Engineering']
        self.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        self.time_slots = ["8:00-9:00", "9:00-10:00", "10:00-10:30", "10:30-11:30", 
                          "11:30-12:30", "12:30-1:00", "1:00-2:00", "2:00-3:00"]
        self.period_to_slot = {0: 1, 1: 2, 3: 3, 4: 4, 6: 5, 7: 6}  # Maps period to slot index

    def get_lab_slots(self, day: int, block: int) -> List[Tuple[int, int]]:
        """Return lab slots (two consecutive periods) for a given day and block."""
        slot1 = 2 * block + 1
        slot2 = 2 * block + 2
        return [(day, slot1), (day, slot2)]

    def generate_timetable(self) -> Dict[str, Any]:
        """Generate a complete timetable using a simple scheduling algorithm."""
        timetable = {
            'common_subjects': {},
            'specific_subjects': {},
            'common_labs': {},
            'specific_labs': {}
        }

        # Generate common subjects for each semester (1-8)
        for sem in range(1, 9):
            slots = []
            for _ in range(5):  # 5 common subjects per semester
                day = random.randint(0, 5)
                slot = random.choice([0, 1, 3, 4, 6, 7])  # Avoid break slots
                slots.append([day, slot])
            timetable['common_subjects'][str(sem)] = slots

        # Generate specific subjects and labs for each department (0-4) and semester (1-8)
        for dept_idx in range(5):
            for sem in range(1, 9):
                # Specific subjects (4 per dept/sem)
                for i in range(1, 5):
                    key = f"({dept_idx}, {sem}, {i})"
                    slots = []
                    for _ in range(3):  # 3 slots per subject
                        day = random.randint(0, 5)
                        slot = random.choice([0, 1, 3, 4, 6, 7])
                        slots.append([day, slot])
                    timetable['specific_subjects'][key] = slots

                # Common lab (1 per dept/sem)
                key = f"({dept_idx}, {sem})"
                day = random.randint(0, 5)
                block = random.randint(0, 2)  # 3 possible lab blocks (morning, mid, afternoon)
                timetable['common_labs'][key] = [day, block]

                # Specific labs (2 per dept/sem)
                for j in range(1, 3):
                    key = f"({dept_idx}, {sem}, {j})"
                    day = random.randint(0, 5)
                    block = random.randint(0, 2)
                    timetable['specific_labs'][key] = [day, block]

        return timetable

    def save_timetable(self, timetable: Dict[str, Any]):
        """Save the timetable to a JSON file."""
        with open('timetable.json', 'w', encoding='utf-8') as f:
            json.dump(timetable, f, indent=4)

    def extract_schedule(self, timetable_data: Dict[str, Any], dept_idx: int, sem: int) -> List[List[str]]:
        """Extract a readable schedule for a department and semester."""
        classes = []
        # Common subjects
        for day, slot in timetable_data['common_subjects'][str(sem)]:
            classes.append(((day, slot), "Common Sub"))
        
        # Specific subjects
        for i in range(1, 5):
            key = f"({dept_idx}, {sem}, {i})"
            for day, slot in timetable_data['specific_subjects'][key]:
                classes.append(((day, slot), f"Sub {i}"))
        
        # Common lab
        key = f"({dept_idx}, {sem})"
        day, block = timetable_data['common_labs'][key]
        for ts in self.get_lab_slots(day, block):
            classes.append((ts, "Common Lab"))
        
        # Specific labs
        for j in range(1, 3):
            key = f"({dept_idx}, {sem}, {j})"
            day, block = timetable_data['specific_labs'][key]
            for ts in self.get_lab_slots(day, block):
                classes.append((ts, f"Lab {j}"))

        # Build schedule dictionary
        schedule = {}
        for (day, slot), class_name in classes:
            if (day, slot) in schedule and schedule[(day, slot)] != class_name:
                schedule[(day, slot)] = "Conflict"
            else:
                schedule[(day, slot)] = class_name

        # Format into table
        table_data = []
        for day in range(6):
            row = [self.days[day]]
            for p in range(8):
                if p in [2, 5]:  # Break slots
                    row.append("Break")
                else:
                    slot = self.period_to_slot.get(p, None)
                    row.append(schedule.get((day, slot), "") if slot is not None else "")
            table_data.append(row)
        
        return table_data

# Flask application setup
app = Flask(__name__)
CORS(app)

# Initialize chatbot server
try:
    chatbot = ChatbotServer('chatbotmodel.pth', 'dimensions.json')
except RuntimeError as e:
    print(f"Failed to initialize chatbot: {e}")
    exit(1)

# Initialize timetable generator
timetable_generator = TimetableGenerator()

@app.route('/')
def home():
    """Render the home page."""
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chatbot requests from ChatbotWidget."""
    data = request.get_json(silent=True)
    if not data or 'message' not in data:
        return jsonify({'error': 'No message provided'}), 400
    
    message = data['message']
    response = chatbot.process_message(message)
    return jsonify({'response': response})

@app.route('/generate-timetable', methods=['POST'])
def generate_timetable():
    """Generate and save the full timetable."""
    try:
        timetable = timetable_generator.generate_timetable()
        timetable_generator.save_timetable(timetable)
        return jsonify({'message': 'Timetable generated successfully'}), 200
    except Exception as e:
        return jsonify({'error': f'Timetable generation failed: {str(e)}'}), 500

@app.route('/get-timetable', methods=['POST'])
def get_timetable():
    """Retrieve timetable for a specific department and semester."""
    data = request.get_json(silent=True)
    if not data or 'department' not in data or 'semester' not in data:
        return jsonify({'error': 'Department and semester are required'}), 400
    
    try:
        dept_idx = int(data['department'])
        sem = int(data['semester'])
        if not (0 <= dept_idx <= 4) or not (1 <= sem <= 8):
            return jsonify({'error': 'Invalid department (0-4) or semester (1-8)'}), 400

        if not os.path.exists('timetable.json'):
            return jsonify({'error': 'Timetable data not found. Generate the timetable first.'}), 404

        with open('timetable.json', 'r', encoding='utf-8') as f:
            timetable_data = json.load(f)

        schedule = timetable_generator.extract_schedule(timetable_data, dept_idx, sem)
        return jsonify({'schedule': schedule}), 200
    except (ValueError, KeyError) as e:
        return jsonify({'error': f'Invalid data: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)