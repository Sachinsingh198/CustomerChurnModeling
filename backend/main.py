from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import pickle
from fastapi.middleware.cors import CORSMiddleware

# 1. FastAPI ka instance banana (The Application)
app = FastAPI()

# 2. CORS (Cross-Origin Resource Sharing) - React se baat karne ke liye Permission
# Bina iske React server ko block kar dega
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Production mein ise React ke URL se replace karna
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Model aur Preprocessing objects load karna (Global Loading)
# First Principle: Ek hi baar load karo taaki har request par time waste na ho
model = load_model('model/bank_churn_model.h5')
scaler = pickle.load(open('model/scaler.pkl', 'rb'))
transformer = pickle.load(open('model/transformer.pkl', 'rb'))

# 4. Input Data Structure (Pydantic Model)
# Intuition: Ye batata hai ki React se kya-kya aana chahiye (Strict Types)
class CustomerData(BaseModel):
    Geography: str
    CreditScore: int
    Gender: str
    Age: int
    Tenure: int
    Balance: float
    NumOfProducts: int
    HasCrCard: int
    IsActiveMember: int
    EstimatedSalary: float

# 5. The Prediction Endpoint
@app.post("/predict")
def predict_churn(data: CustomerData):
    # 1. Data ko organize karna
    ordered_data = {
        "CreditScore": data.CreditScore,
        "Geography": data.Geography,
        "Gender": 1 if data.Gender.lower() == 'male' else 0,
        "Age": data.Age,
        "Tenure": data.Tenure,
        "Balance": data.Balance,
        "NumOfProducts": data.NumOfProducts,
        "HasCrCard": data.HasCrCard,
        "IsActiveMember": data.IsActiveMember,
        "EstimatedSalary": data.EstimatedSalary
    }

    input_df = pd.DataFrame([ordered_data])

    # 2. Dummy 'Exited' column add karna (Transformer ki requirement ke liye)
    input_df['Exited'] = 0

    try:
        # 3. Transform & Slice
        # Transformed data se dummy 'Exited' column hatao (last column)
        transformed_data = transformer.transform(input_df)
        features_for_scaler = transformed_data[:, :-1]

        # 4. Scaling
        scaled_data = scaler.transform(features_for_scaler)

        # 5. Prediction (Variable name 'model' use kiya hai yahan)
        # First Principle: Match the variable name with the one used during load_model()
        prediction = model.predict(scaled_data)
        
        probability = float(prediction[0][0])
        result = "YES" if probability > 0.5 else "NO"

        return {
            "probability": round(probability, 4),
            "churn_prediction": result
        }
    except Exception as e:
        return {"error": str(e)}