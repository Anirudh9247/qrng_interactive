# Quantum Random Number Generator Analysis Platform

## Overview

The **Quantum Random Number Generator (QRNG) Analysis Platform** is a full-stack web application designed to generate, analyze, and visualize random numbers produced from both quantum and classical sources.

The platform allows users to run randomness experiments, apply statistical tests to evaluate randomness quality, and compare quantum randomness with classical pseudo-random generators.

This project demonstrates how **quantum-inspired randomness can be statistically analyzed and visualized using modern web technologies.**

---

## Features

### Random Number Generation

* Quantum random bit generation using simulated qubits
* Classical pseudo-random number generation
* Adjustable sample sizes for experiments

### Randomness Analysis

* Bit distribution analysis
* Shannon entropy calculation
* Chi-Square randomness test

### Visualization

* Bit distribution graph
* Entropy comparison graph
* Experiment results visualization

### Experiment Management

* Run randomness experiments
* Store experiment results in PostgreSQL
* Retrieve experiment history

### Full Stack Architecture

* FastAPI backend
* PostgreSQL database
* React frontend dashboard

---

## Technology Stack

### Backend

* Python
* FastAPI
* PostgreSQL
* SQLAlchemy
* Uvicorn

### Frontend

* React
* Axios
* Bootstrap

### Data Analysis

* NumPy
* Matplotlib

---

## System Architecture

User Request
↓
React Dashboard
↓
FastAPI Backend API
↓
Randomness Analysis Engine
↓
Statistical Tests (Entropy, Chi-Square)
↓
Graph Generation
↓
PostgreSQL Database

---

## API Endpoints

### Run Experiment

POST /run-experiment

Generates random bits and performs randomness analysis.

Example Request:

```
{
 "generator": "quantum",
 "sample_size": 200
}
```

---

### Compare Random Generators

POST /compare-rng

Compares entropy between quantum and classical generators.

---

### Retrieve Experiments

GET /experiments

Returns stored randomness experiments.

---

### Retrieve Experiment by ID

GET /experiment/{id}

Returns details of a specific experiment.

---

## Randomness Tests Implemented

### Bit Distribution Test

Checks whether the number of zeros and ones is approximately balanced.

### Shannon Entropy

Measures unpredictability of the bit sequence.

### Chi-Square Test

Statistically evaluates deviation from an ideal random distribution.

---

## Installation

### Clone Repository

```
git clone https://github.com/yourusername/qrng-analysis-platform.git
cd qrng-analysis-platform
```

---

### Backend Setup

Navigate to backend folder

```
cd backend
```

Create virtual environment

```
python -m venv .venv
```

Activate environment

```
.\.venv\Scripts\Activate.ps1
```

Install dependencies

```
pip install -r requirements.txt
```

Run server

```
python -m uvicorn app.main:app --reload
```

Backend will run on:

```
http://127.0.0.1:8000
```

Swagger API docs:

```
http://127.0.0.1:8000/docs
```

---

### Frontend Setup

Navigate to frontend folder

```
cd frontend
```

Install dependencies

```
npm install
```

Run development server

```
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## Future Improvements

* Runs Test implementation
* Autocorrelation randomness test
* Advanced randomness visualization
* Admin dashboard for experiment monitoring
* Deployment to cloud platforms

---

## Project Motivation

Random number generation plays a critical role in many fields including cryptography, secure communications, simulations, and scientific research.

Unlike classical pseudo-random generators, **quantum processes provide inherent unpredictability**, making them valuable for high-security applications.

This project explores how quantum randomness can be generated, analyzed, and compared with classical randomness using statistical methods.

---

## Author

Anirudh

Project developed as part of a research-oriented software system exploring **quantum-inspired randomness analysis.**
