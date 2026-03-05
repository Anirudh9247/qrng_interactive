# ⚛️ Web-Based Quantum Randomness Analysis Platform

## 📖 Project Overview
This project is an academic web-based simulation and analysis platform for Quantum Random Number Generation (QRNG). Moving beyond basic random number generation, this platform leverages quantum circuits to generate bitstreams and subjects them to rigorous statistical tests to evaluate their true randomness quality. 

This tool serves as both a secure generator and a research-oriented analysis dashboard for quantum mechanics applications.

## 🚀 Tech Stack
* **Backend Framework:** FastAPI (Python)
* **Database:** PostgreSQL with SQLAlchemy ORM
* **Authentication:** JWT (JSON Web Tokens) & bcrypt password hashing
* **Quantum Simulation:** Qiskit (IBM Quantum SDK)
* **Statistical Analysis:** Custom Python implementation of standard randomness tests (Frequency, Runs, Entropy)

## 📂 Current Folder Structure
```text
backend/
├── app/
│   ├── api/          # API Route endpoints (Users, QRNG, Analysis)
│   ├── core/         # Core configurations (Auth, Security, Settings)
│   ├── db/           # Database sessions and initializations
│   ├── model/        # SQLAlchemy Database Models
│   ├── schema/       # Pydantic schemas for data validation
│   ├── services/     # Business logic (Quantum generation, Analysis math)
│   ├── utils/        # Helper functions and statistical tests
│   └── main.py       # FastAPI application entry point
├── requirements.txt  # Python dependencies
└── .env              # Environment variables (Secrets, DB URIs)
