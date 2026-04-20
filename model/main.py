from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI() # <--- CRITICAL LINE

# Load your files
model = joblib.load("house_model_tuned.pkl")
model_columns = joblib.load("model_columns.pkl")

class HouseInput(BaseModel):
    Location: str
    PropertyType: str
    LotArea: float
    FloorArea: float
    Bedrooms: int
    Bathrooms: int
    Kitchens: int
    Garages: int

@app.post("/predict")
def predict(data: HouseInput):
    print("Received data...") # <--- Add this
    input_df = pd.DataFrame([data.dict()])
    print("DataFrame created...")
    # (Your prediction logic here)
    return {"predicted_price": 0.0}