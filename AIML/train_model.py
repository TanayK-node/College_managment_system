import json
import random
import numpy as np
import nltk
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import torch.nn.functional as F
from nltk.stem import WordNetLemmatizer

nltk.download('wordnet')
nltk.download('punkt')

class ChatbotModel(nn.Module):
    def __init__(self, input_size, output_size):
        super(ChatbotModel, self).__init__()
        self.fc1 = nn.Linear(input_size, 512)
        self.fc2 = nn.Linear(512, 256)
        self.fc3 = nn.Linear(256, 128)
        self.fc4 = nn.Linear(128, 64)
        self.fc5 = nn.Linear(64, output_size)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.3)
        # Set track_running_stats=True to handle batch size of 1
        self.batch_norm1 = nn.BatchNorm1d(512, track_running_stats=True)
        self.batch_norm2 = nn.BatchNorm1d(256, track_running_stats=True)
        self.batch_norm3 = nn.BatchNorm1d(128, track_running_stats=True)

    def forward(self, x):
        # Ensure x has a batch dimension
        if x.dim() == 1:
            x = x.unsqueeze(0)  # Add batch dimension if missing
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

class ChatbotDataset(Dataset):
    def __init__(self, x_data, y_data):
        self.n_samples = len(x_data)
        self.x_data = x_data
        self.y_data = y_data

    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]

    def __len__(self):
        return self.n_samples

class ChatbotTrainer:
    def __init__(self, dataset_path):
        self.lemetizer = WordNetLemmatizer()
        self.dataset = self.load_dataset(dataset_path)
        self.words = []
        self.intents = []
        self.patterns = []
        self.intent_of_pattern = []
        self.extract_words_and_intents()

    def load_dataset(self, dataset_path):
        with open(dataset_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def tokenize_and_lemetize(self, text):
        words = nltk.word_tokenize(text)
        return [self.lemetizer.lemmatize(word.lower()) for word in words]

    def extract_words_and_intents(self):
        for intent in self.dataset['intents']:
            self.intents.append(intent['tag'])
            for pattern in intent['patterns']:
                words = self.tokenize_and_lemetize(pattern)
                self.words.extend(words)
                self.patterns.append(words)
                self.intent_of_pattern.append(intent['tag'])
        self.words = sorted(list(set(self.words)))

    def bag_of_words(self, pattern_words):
        return [1 if word in pattern_words else 0 for word in self.words]

    def prepare_training_data(self):
        x_data = []
        y_data = []
        for idx, pattern_words in enumerate(self.patterns):
            bag = self.bag_of_words(pattern_words)
            x_data.append(bag)
            label = self.intents.index(self.intent_of_pattern[idx])
            y_data.append(label)
        return np.array(x_data, dtype=np.float32), np.array(y_data, dtype=np.int64)

    def train_model(self, batch_size=16, epochs=500, lr=0.00005, patience=75):
        x_data, y_data = self.prepare_training_data()
        dataset = ChatbotDataset(x_data, y_data)
        dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True, drop_last=True)  # Drop last incomplete batch

        input_size = len(self.words)
        output_size = len(self.intents)
        model = ChatbotModel(input_size, output_size)
        criterion = nn.CrossEntropyLoss()
        optimizer = torch.optim.Adam(model.parameters(), lr=lr)

        best_loss = float('inf')
        epochs_no_improve = 0

        for epoch in range(epochs):
            model.train()  # Set model to training mode
            total_loss = 0
            for batch_x, batch_y in dataloader:
                batch_x = batch_x.to(torch.float32)
                batch_y = batch_y.to(torch.long)

                optimizer.zero_grad()
                outputs = model(batch_x)
                loss = criterion(outputs, batch_y)
                loss.backward()
                optimizer.step()
                total_loss += loss.item()

            avg_loss = total_loss / len(dataloader)
            print(f"Epoch {epoch+1}/{epochs}, Loss: {avg_loss:.4f}")

            # Early stopping
            if avg_loss < best_loss:
                best_loss = avg_loss
                epochs_no_improve = 0
                torch.save(model.state_dict(), 'chatbotmodel.pth')
            else:
                epochs_no_improve += 1
                if epochs_no_improve >= patience:
                    print(f"Early stopping at epoch {epoch+1} with best loss {best_loss:.4f}")
                    break

        dimensions = {
            'vocabulary': self.words,
            'intents': self.intents,
            'intents_responses': {intent['tag']: intent['responses'] for intent in self.dataset['intents']},
            'input_size': input_size,
            'output_size': output_size
        }
        with open('dimensions.json', 'w') as f:
            json.dump(dimensions, f)

        return model

if __name__ == "__main__":
    trainer = ChatbotTrainer('dataset.json')
    model = trainer.train_model(batch_size=16, epochs=500)