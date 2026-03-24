# 🔐 Secure QRNG Web Application

A full-stack web application that demonstrates **Quantum Random Number Generation (QRNG)** vs **Classical Random Number Generation (RNG)** using statistical analysis and interactive visualizations.

---

## 🚀 Features

* ⚛️ Quantum RNG using Qiskit Aer Simulator
* 🎲 Classical RNG (Python-based, configurable bias)
* 📊 Statistical Tests:

  * Shannon Entropy
  * Chi-Square Test
  * Frequency Test
* 📈 Interactive Dashboard with charts
* 📂 Experiment History (stored in PostgreSQL)
* 🔍 Comparison Engine (Quantum vs Classical)
* 🖥️ Modern UI (Next.js + Tailwind CSS)

---

## 🏗️ Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* PostgreSQL
* Qiskit (Quantum Simulation)
* Matplotlib

### Frontend

* Next.js (App Router)
* Axios
* Recharts
* Tailwind CSS

---

## 📁 Project Structure

```
QRNG_PROJECT/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── model/
│   │   ├── db/
│   │   └── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/app/
│   │   ├── dashboard/
│   │   ├── compare/
│   │   ├── history/
│   │   └── lib/api.ts
│   └── .env.local
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd QRNG_PROJECT
```

---

## 🔧 Backend Setup (FastAPI)

### Create Virtual Environment

```bash
cd backend
python -m venv .venv
```

Activate:

```bash
# Windows
.\.venv\Scripts\activate

# Mac/Linux
source .venv/bin/activate
```

---

### Install Dependencies

```bash
pip install -r requirements.txt
```

If missing:

```bash
pip install fastapi uvicorn python-dotenv sqlalchemy psycopg2-binary matplotlib qiskit qiskit-aer
```

---

### Run Backend

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

### Verify

Open:

```
http://localhost:8000/docs
```

---

## 🎨 Frontend Setup (Next.js)

```bash
cd frontend
npm install
```

---

### Create Environment File

Create:

```
frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

👉 If using LAN (recommended):

```env
NEXT_PUBLIC_API_URL=http://<your-ip>:8000
```

---

### Run Frontend

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🔄 API Endpoints

### Core

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| POST   | `/run-experiment`    | Run RNG experiment     |
| POST   | `/run-experiment-db` | Run & store experiment |
| GET    | `/experiments`       | Get all experiments    |
| GET    | `/experiment/{id}`   | Get single experiment  |

---

### Comparison

| Method | Endpoint                  | Description                      |
| ------ | ------------------------- | -------------------------------- |
| POST   | `/comparison/compare-rng` | Compare Quantum vs Classical RNG |

---

## 🧪 Example Request

```json
{
  "generator": "quantum",
  "sample_size": 1000
}
```

---

## ⚠️ Common Issues & Fixes

### ❌ Network Error (Axios)

* Ensure backend is running
* Check `.env.local`
* Use correct IP (not localhost in LAN)

---

### ❌ CORS Error

Update FastAPI:

```python
allow_origins=[
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://<your-ip>:3000"
]
```

---

### ❌ Backend Not Reachable

Run with:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## 📊 How It Works

1. Generate random bits:

   * Quantum → Hadamard + measurement
   * Classical → Pseudo-random generator

2. Apply statistical tests:

   * Entropy
   * Chi-square

3. Visualize:

   * Bar charts
   * Bit distributions

4. Store results in database

---

## 🔮 Future Improvements

* 🌐 Real Quantum API (IBM Quantum / ANU QRNG)
* 📡 Live streaming randomness
* 📁 Export results (CSV/JSON)
* 🔐 Authentication system
* 📊 Advanced statistical tests (NIST suite)

---

## 👨‍💻 Author

Developed by **Anirudh**

---

## ⭐ License

This project is for educational and demonstration purposes.
