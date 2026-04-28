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
    try:
        # Convert input to dictionary
        input_data = data.dict()
        
        # Create DataFrame with the input
        input_df = pd.DataFrame([input_data])
        
        # One-hot encode categorical columns
        # Location and PropertyType need to be expanded
        input_df_encoded = pd.get_dummies(
            input_df[['Location', 'PropertyType']],
            prefix=['Location', 'PropertyType'],
            drop_first=False
        )
        
        # Combine numeric features with encoded categorical features
        numeric_df = input_df[['LotArea', 'FloorArea', 'Bedrooms', 'Bathrooms', 'Kitchens', 'Garages']]
        combined_df = pd.concat([numeric_df, input_df_encoded], axis=1)
        
        # Reindex to match the model's expected columns, filling missing with 0
        combined_df = combined_df.reindex(columns=model_columns, fill_value=0)
        
        # Make prediction
        prediction = model.predict(combined_df)[0]
        
        # Return as float
        return {"predicted_price": float(prediction)}
    except Exception as e:
        print(f"Error during prediction: {e}")
        # Return error with safe fallback
        return {"predicted_price": 0.0}