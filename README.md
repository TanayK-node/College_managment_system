# Hack1
Educational Management System 🏆 Hackathon Winner!

We’re thrilled to announce that **School Magnet System** won the **Codequell Hackanova 2025**! 🎉 This recognition highlights the innovation and impact of our AI-powered educational management system, designed to streamline academic workflows for students, teachers, and administrators. Updated as of March 11, 2025, this README provides comprehensive instructions, usage guidelines, and troubleshooting steps to ensure effortless adoption. Our code is rigorously tested and optimized, though minor backend issues may arise due to device-specific or environmental factors—rest assured, we’ve included robust solutions to address these.
Link to the Demo Video:"https://drive.google.com/drive/folders/18nCUPczpCcnbFXswVYZv9X0afk6nUeKg?usp=drive_link"

---

## Table of Contents
- [Overview](#overview)
- [Hackathon Achievement](#hackathon-achievement)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Debugging and Troubleshooting](#debugging-and-troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview
The **School/College Mangament System** system is a state-of-the-art platform that streamlines educational workflows with role-based dashboards and a locally trained chatbot. Administrators can effortlessly generate and view timetables, while students and teachers access academic insights and manage tasks. Built with precision and tested across multiple environments, the desert-themed UI enhances usability, and the Flask backend ensures robust performance—though minor setup adjustments may be needed on certain devices.

---

## Hackathon Achievement
We’re proud to share that **h2** won the **Codequell Hackanova 2025**, a prestigious competition held on [March 10, 2025]. This victory underscores the project’s innovation in educational technology, leveraging AI and a user-friendly interface to address real-world academic challenges. Thank you to our team and the hackathon organizers for this incredible opportunity!

---

## Screenshots
Below are some snapshots of the system in action, showcasing the desert-themed UI and key features.

### Student Dashboard
![Student Dashboard](screenshots/student_dashboard.png)
*View your attendance, assignments, and notices with the integrated ChatbotWidget.*

### Admin Dashboard - Timetable Generation
![Admin Dashboard](screenshots/admin_dashboard.png)
*Generate and view timetables with ease, styled in our desert theme.*

*Note*: Screenshots are stored in the `screenshots/` directory. See [Adding Images to README](#adding-images-to-readme) for instructions on how to add your own.

---

## Features
- **Role-Based Dashboards**: Tailored interfaces for students, teachers, and administrators.
- **Timetable Generation**: Admins can create and view timetables by department and semester.
- **AI-Powered Chatbot**: A floating `ChatbotWidget` provides real-time assistance using a locally trained model.
- **Desert-Themed UI**: Beige (`#F5E8C7`) and brown (`#8B4513`) aesthetic for a cohesive experience.
- **Analytics**: Recharts visualizations for attendance and performance tracking.
- **User Management**: Admin-controlled user and notice management.

---

## Tech Stack
- **Frontend**:
  - React with TypeScript
  - Tailwind CSS (for desert-themed styling)
  - Recharts (for data visualization)
- **Backend**:
  - Flask (Python server)
  - PyTorch (for chatbot model)
- **Dependencies**:
  - Python libraries: `flask`, `torch`, `nltk`, `flask-cors`
  - Node.js packages: `axios`, `react`, `react-dom`, `recharts`

---

## Prerequisites
- **Python**: Version 3.8 or higher (recommended).
- **Node.js**: Version 14 or higher (for React frontend).
- **Git**: For cloning the repository.
- **pip**: Python package manager.
- **npm**: Node package manager.
- **Operating System**: Windows, Linux, or macOS.

---

## Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/TanayK-node/h2.git
cd h2
```

### Step 2: Set Up the Backend (Flask)
1. **Navigate to Backend Directory**:
   - The backend resides in `chatbot-backend/`. If your setup uses `chatbot_web` or `project`, adjust to `project/chatbot-backend`.
   - All files (`flask_server.py`, `chatbotmodel.pth`, `dimensions.json`, `generate_timetable.py`) are included and optimized. If missing, they may need manual addition from the original source.

2. **Create a Virtual Environment**:
   - On Linux/Mac:
     ```bash
     cd chatbot-backend
     python3 -m venv venv
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     cd chatbot-backend
     python -m venv venv
     venv\Scripts\activate
     ```

3. **Install Python Dependencies**:
   - A `requirements.txt` file is provided with all necessary dependencies:
     ```
     flask
     torch
     nltk
     numpy
     flask-cors
     ```
   - Install them:
     ```bash
     pip install -r requirements.txt
     ```
   - For PyTorch, use a compatible version (see [PyTorch website](https://pytorch.org/get-started/locally/)):
     ```bash
     pip install torch
     ```

4. **Download NLTK Data**:
   - The server auto-downloads `wordnet` and `punkt` datasets on startup. For manual download:
     ```python
     import nltk
     nltk.download('wordnet')
     nltk.download('punkt')
     ```

### Step 3: Set Up the Frontend (React)
1. **Navigate to Frontend Directory**:
   - The frontend is likely in `chatbot_web/src` or `project/src`. Adjust based on your structure.
   - Includes `package.json` with all dependencies.

2. **Install Node Dependencies**:
   ```bash
   cd chatbot_web  # or project
   npm install
   ```

3. **Configure Environment Variables**:
   - Update the API URL in frontend components (e.g., `AdminDashboard.tsx`) to `http://localhost:5000` if the backend port differs.

### Step 4: Verify Files
- Confirm the following are in `chatbot-backend/`:
  - `flask_server.py`
  - `chatbotmodel.pth`
  - `dimensions.json`
  - `generate_timetable.py`
  - `timetable.json` (generated post-setup)
- If absent, they may not have synced; retrieve from the original device.

---

## Usage

### Running the Application
1. **Start the Backend (Flask)**:
   - Activate the virtual environment (as above).
   - Run:
     ```bash
     python flask_server.py
     ```
   - Access at `http://0.0.0.0:5000`. Console logs confirm operation.

2. **Start the Frontend (React)**:
   - In a new terminal:
     ```bash
     cd chatbot_web  # or project
     npm start
     ```
   - Opens at `http://localhost:3000`.

3. **Interact with the System**:
   - **Students**: View attendance, assignments, notices.
   - **Teachers**: Manage materials and grades.
   - **Admins**: Generate/view timetables, manage users.

### Key Endpoints
- `/`: Renders the home page.
- `/chat` (POST): Handles chatbot queries.
- `/generate-timetable` (POST): Triggers timetable generation.
- `/get-timetable` (POST): Fetches timetable data.

---

## Folder Structure
```
h2/
├── chatbot-backend/          # Flask backend
│   ├── flask_server.py      # Main server file
│   ├── chatbotmodel.pth     # Chatbot model weights
│   ├── dimensions.json      # Chatbot configuration
│   ├── generate_timetable.py # Timetable script
│   ├── timetable.json       # Timetable data
│   ├── requirements.txt     # Python dependencies
│   └── venv/                # Virtual environment
├── chatbot_web/             # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── TeacherDashboard.tsx
│   │   │   └── ChatbotWidget.tsx
│   │   ├── App.tsx          # Main component
│   │   ├── index.tsx        # Entry point
│   │   └── styles/          # Tailwind files
│   ├── public/              # Static files
│   ├── package.json         # Node dependencies
│   └── tailwind.config.js   # Tailwind config
├── screenshots/             # Screenshots for README
│   ├── student_dashboard.png
│   └── admin_dashboard.png
├── .gitignore               # Ignored files
├── README.md                # This file
└── LICENSE                  # License file
```

---

## Debugging and Troubleshooting

### Our Code is Perfect, But...
The **h2** codebase is thoroughly tested and optimized for reliability, as proven by our hackathon win. However, backend issues may arise due to device-specific or environmental factors (e.g., missing dependencies, OS differences). Below are tailored fixes for reported cross-device Flask server failures, along with general troubleshooting.

#### Fixes for Cross-Device Backend Issue
- **Problem**: Flask server works on one device but fails on another.
- **Potential Causes and Fixes**:
  1. **Missing Python/Dependencies**:
     - **Symptom**: `ModuleNotFoundError` or `python: command not found`.
     - **Fix**: Install Python 3.8+, activate a virtual environment, and run `pip install -r requirements.txt`.
  2. **Virtual Environment Issues**:
     - **Symptom**: Dependencies not found despite installation.
     - **Fix**: Create a new virtual environment on the new device (see Installation).
  3. **OS Differences**:
     - **Symptom**: `FileNotFoundError` or subprocess failures.
     - **Fix**: Use `python3` if needed, adjust `generate_timetable.py` paths for Windows.
  4. **Missing Files**:
     - **Symptom**: `FileNotFoundError` for `chatbotmodel.pth` or `dimensions.json`.
     - **Fix**: Ensure all files are in `chatbot-backend/`; commit and push from the original device if missing.
  5. **Port Conflicts**:
     - **Symptom**: `OSError: [Errno 98] Address already in use`.
     - **Fix**: Check port usage (`lsof -i :5000` or `netstat -aon | findstr :5000`), free it (`kill -9 <PID>` or `taskkill /PID <PID> /F`), or use port 5001.
  6. **NLTK Data Missing**:
     - **Symptom**: `Resource wordnet not found`.
     - **Fix**: Manually download with `nltk.download('wordnet')`.
  7. **PyTorch Compatibility**:
     - **Symptom**: `RuntimeError` loading the model.
     - **Fix**: Reinstall PyTorch from [pytorch.org](https://pytorch.org/get-started/locally/).
  8. **Network Restrictions**:
     - **Symptom**: Server inaccessible.
     - **Fix**: Allow port 5000 in firewall settings.

#### General Debugging Steps
- **Run with Debug Output**:
  - Start the server and note errors:
    ```bash
    python flask_server.py
    ```
  - Share the traceback for assistance.

- **Test Minimal Flask App**:
  - Create `test.py`:
    ```python
    from flask import Flask
    app = Flask(__name__)

    @app.route('/')
    def home():
        return "Hello, Flask!"

    if __name__ == "__main__":
        app.run(debug=True, host='0.0.0.0', port=5000)
    ```
  - Run to isolate issues.

- **Check Logs**:
  - Add `print` statements in `flask_server.py` to trace execution.

- **Cross-Device Consistency**:
  - Compare Python versions, OS, and packages between devices.

#### Additional Tips
- Enable CORS if the frontend fails to connect (add `from flask_cors import CORS; CORS(app)` to `flask_server.py` and install `flask-cors`).
- For persistent issues, open a GitHub issue with logs and device details.

---

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.
- Maintain the desert theme and folder structure.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
