

# College Management System

An open-source, AI-powered educational management system for students, teachers, and administrators. This repository combines a **Flask-based backend** (for AI and timetable generation) with a **Node/React (Vite) frontend** for an integrated, desert-themed user interface.

> **Last Updated**: March 12, 2025

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Clone the Repository](#clone-the-repository)
  - [Python Backend Setup](#python-backend-setup)
  - [Node/React Frontend Setup](#nodereact-frontend-setup)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Debugging and Troubleshooting](#debugging-and-troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview
The **College Management System** simplifies campus operations:
- **Students** track attendance, assignments, and academic progress.
- **Teachers** manage courses, materials, and grading.
- **Administrators** oversee timetables, user management, and analytics.

A locally trained **AI Chatbot** (powered by PyTorch) offers real-time assistance, and the **desert-themed UI** provides a visually cohesive, user-friendly experience.

---

## Features
- **Role-Based Dashboards**: Custom interfaces for students, teachers, and admins.
- **AI Chatbot**: Locally trained PyTorch model with NLTK for language processing.
- **Timetable Generation**: Automated scheduling logic in Python.
- **Desert-Themed UI**: Styled with Tailwind CSS, featuring beige (`#F5E8C7`) and brown (`#8B4513`).
- **Analytics & Visualizations**: Using Recharts or equivalent charting libraries.
- **User & Notice Management**: Admins can add, remove, or update user info and post notices.

---

## Tech Stack
1. **Backend (Python)**:
   - Flask
   - PyTorch
   - NLTK
   - NumPy
   - (Optional) Additional AI/ML scripts in `AIML/`

2. **Frontend (Node/React + Vite)**:
   - React (TypeScript optional)
   - Tailwind CSS
   - Vite for build/serve
   - Node.js (for local server scripts)

3. **Database**:
   - *(Not explicitly shown in the screenshots—use your preferred DB or file-based storage.)*

---

## Prerequisites
- **Python**: 3.8+ recommended
- **Node.js**: 14+ recommended
- **Git**: to clone the repository
- **pip**: Python package manager
- **npm**: Node package manager
- **Operating System**: Windows, Linux, or macOS

---

## Installation

### Clone the Repository
```bash
git clone https://github.com/TanayK-node/College_managment_system.git
cd College_managment_system
```

### Python Backend Setup

1. **Navigate to the `backend/` folder** (where `flask-server.py` and `requirements.txt` reside):
   ```bash
   cd backend
   ```
2. **Create and activate a virtual environment**:
   - **Windows**:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   - **Linux/Mac**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   This includes Flask, PyTorch, NLTK, etc. If PyTorch fails, install the correct version from [pytorch.org](https://pytorch.org/get-started/locally/).

4. **(Optional) Download NLTK data**:  
   If needed, manually download wordnet/punkt:
   ```python
   import nltk
   nltk.download('wordnet')
   nltk.download('punkt')
   ```

5. **(Optional) Install Node packages for backend** (if you have a `package.json` here for additional Node utilities):
   ```bash
   npm install
   ```

6. **Run the Flask server**:
   ```bash
   python flask-server.py
   ```
   By default, it should start on [http://0.0.0.0:5000](http://0.0.0.0:5000).

### Node/React Frontend Setup

1. **Open a new terminal** (keep the Flask server running if you wish).
2. **Navigate to the `frontend/` folder** (where `package.json`, `server.js`, and `vite.config.ts` are located):
   ```bash
   cd ../frontend
   ```
3. **Install Node dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables** (optional):
   - If there’s a `.env` file, configure your API endpoints (e.g., `VITE_API_URL=http://localhost:5000`).
5. **Run the frontend**:
   ```bash
   npm run dev
   ```
   - This should start the Vite dev server, typically at [http://localhost:5173](http://localhost:5173) (or as shown in your console).
   - If you have a custom `server.js` script, you may run:
     ```bash
     node server.js
     ```
     Adjust commands per your `package.json` scripts.

---

## Usage
1. **Start the Flask backend** (in `backend/`):
   ```bash
   python flask-server.py
   ```
2. **Start the React frontend** (in `frontend/`):
   ```bash
   npm run dev
   ```
3. **Open your browser** at the URL indicated by Vite (commonly `http://localhost:5173`), or any custom port you set.

4. **Interact**:
   - **Students**: View assignments, attendance, and course materials.
   - **Teachers**: Manage content, grading, and announcements.
   - **Admins**: Generate timetables, oversee user management, and post notices.
   - **Chatbot**: Use the floating widget to ask questions. The AI logic resides in the Python backend (`flask-server.py`).

---

## Folder Structure

Below is a sample representation based on your screenshots:

```
College_managment_system/
├── .git/
├── AIML/                     # AI/ML scripts (optional folder)
│   └── ...                  # Training code, notebooks, etc.
├── backend/                  # Python + Flask backend
│   ├── node_modules/         # If you installed Node dependencies here
│   ├── templates/            # Flask Jinja templates (if used)
│   ├── venv/                 # Python virtual environment
│   ├── best_model.pth        # Example model file
│   ├── chatbotmodel.pth      # Main chatbot model
│   ├── dataset.json          # Training dataset
│   ├── dimensions.json       # Chatbot config
│   ├── flask-server.py       # Main Flask server script
│   ├── package.json          # Node config (if any)
│   ├── package-lock.json
│   ├── requirements.txt      # Python dependencies
│   ├── test.py               # Test script (optional)
│   ├── timetable.json        # Generated timetable data
│   ├── train_model.py        # Model training script
│   ├── TT_1.py               # Additional Python script
│   └── ...
├── frontend/                 # React/Vite frontend
│   ├── node_modules/
│   ├── src/
│   │   └── ...              # React components, pages, etc.
│   ├── .env                  # Environment variables (optional)
│   ├── app.js                # Example Node/Express logic (if used)
│   ├── hashpwd.js            # Example utility
│   ├── index.html            # Entry HTML file for Vite
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── server.js             # Node server script (if used)
│   ├── tailwind.config.js
│   ├── tsconfig.*.json       # TypeScript configs
│   ├── vite.config.ts        # Vite configuration
│   └── ...
├── venv/                     # (Optional) Top-level Python venv
├── README.md
└── .gitignore
```

> **Note**: If you only need one Python virtual environment, you can keep it either in the project root (`venv/`) or in `backend/`. Adjust accordingly.

---

## Debugging and Troubleshooting

1. **Backend Startup Errors**:
   - Ensure you have activated your Python virtual environment.
   - Run `pip install -r requirements.txt` again if dependencies are missing.
   - Check for correct model paths (`chatbotmodel.pth`, `dimensions.json`, etc.).

2. **Frontend Connection Issues**:
   - Verify the Flask server is running on the correct port (`5000` by default).
   - Update the API URL in `.env` or in your React components (e.g., `VITE_API_URL=http://localhost:5000`).

3. **Node Script Conflicts**:
   - If you have a Node server in `frontend/` (via `server.js`), confirm the port does not clash with the Vite dev server (often `5173`).

4. **NLTK or PyTorch Errors**:
   - Manually download NLTK data if auto-download fails:
     ```python
     import nltk
     nltk.download('wordnet')
     nltk.download('punkt')
     ```
   - Install the correct PyTorch version for your OS and Python version.

5. **Port Conflicts**:
   - If you see `OSError: [Errno 98] Address already in use`, change the port in `flask-server.py` or kill the process occupying that port.

---

## Contributing
We welcome contributions from the community! To contribute:

1. **Fork** this repository.
2. **Create a new branch** for your feature/fix:
   ```bash
   git checkout -b feature-new
   ```
3. **Commit** your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. **Push** to your branch:
   ```bash
   git push origin feature-new
   ```
5. **Open a Pull Request** detailing your changes.

---

## License
This project is distributed under the **MIT License**. See [LICENSE](LICENSE) for more details.

---

### Contributors – Team Codeholics
**Tanay, Meet, Aaryan, Parth P, Parth K**

> **Tip**: If you plan to run everything in production, consider using process managers (e.g., `pm2`) for Node and proper WSGI servers (e.g., `gunicorn`) for Flask, plus environment variable handling for sensitive configs.

---

**Enjoy using the updated College Management System!** If you encounter any issues, please open an issue on GitHub or contact the maintainers.
