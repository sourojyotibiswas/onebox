# download_model.py
from transformers import pipeline

# Download and cache the BART model for zero-shot classification
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Test the model with a sample classification to ensure it's working
result = classifier("Test email for classification", ["Spam", "Interested", "Out of Office"])
print("Model downloaded and cached successfully.")
