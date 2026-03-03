import fastapi

app = fastapi.FastAPI()

@app.get("/")
def root():
    return {"message": "QRNG Backend Running"}