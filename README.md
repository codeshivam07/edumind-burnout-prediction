# 🚀 EduMind — AI-Based Student Burnout Prediction System

EduMind is a full-stack AI-powered web application designed to predict student burnout levels based on mental and lifestyle factors such as stress, anxiety, sleep, and study patterns.

The goal of this project is to provide early insights so students can better understand their mental state and take preventive action.

---

## 🧠 How It Works

1. User logs in securely using JWT authentication
2. Inputs basic data (stress, anxiety, sleep hours, study hours, social support)
3. Backend processes the request and sends it to a Machine Learning model
4. Model returns:

   * Burnout Score
   * Student Behavior Cluster
   * Academic Performance Prediction
5. Results are stored in MongoDB for future tracking
6. Visual insights (histogram plots) are generated for better understanding

---

## ⚙️ Tech Stack

### 🔹 Backend

* Node.js
* Express.js
* MongoDB Atlas
* JWT Authentication

### 🔹 Machine Learning

* FastAPI (Python)
* Scikit-learn

### 🔹 Frontend

* React (In Progress)

---

## ✨ Features

* 🔐 Secure authentication system (JWT-based)
* 📊 AI-powered burnout prediction
* 🧠 ML model integration via FastAPI
* 🗄️ Stores user prediction history
* 📈 Basic data visualization (histogram plots)
* 🔗 Scalable architecture (separate ML service)

---

## 📊 Sample Output

* Burnout Score (Low / Medium / High)
* Student Cluster (behavior classification)
* Academic Performance Prediction

---

## 🚀 Future Improvements

* 📊 Interactive dashboard with graphs
* 💡 Personalized recommendations based on predictions
* 🎨 Improved frontend UI/UX
* 🌐 Full deployment (backend + ML API)

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/codeshivam07/edumind-burnout-prediction.git
cd edumind-burnout-prediction
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend:

```bash
node server.js
```

---

### 3️⃣ Setup ML API

```bash
cd ml-API
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

---

## 🔗 API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Prediction

* `POST /api/predict`
* `GET /api/predict/history`

---

## 📌 Project Structure

```
edumind-burnout-prediction/
│
├── backend/        # Node.js backend
├── ml-API/         # FastAPI ML service
├── models/         # ML models
├── README.md
```

---

## 🤝 Contributors

* Shivam (Backend + ML Integration)
* Teammate (Frontend)

---

## 💬 Feedback

Feel free to open issues or give suggestions. Contributions are welcome!

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
