# backend/ml/email_classifier.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from email import message_from_string
from email.policy import default
from transformers import pipeline
import torch

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Load zero-shot classifier from local cache
classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli",
    device=0 if torch.cuda.is_available() else -1
)

# Define labels
CATEGORIES = ["Interested", "Not Interested", "Meeting Booked", "Spam", "Out of Office"]

# Classify email subject into predefined categories
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        subject = data.get("subject", "")
        if not subject:
            return jsonify({"error": "Missing subject"}), 400

        result = classifier(subject, CATEGORIES)
        top_label = result["labels"][0]
        return jsonify({"label": top_label})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Parse raw email content and extract plain text
@app.route("/parse", methods=["POST"])
def parse_email():
    try:
        data = request.get_json()
        raw = data.get("raw", "")
        if not raw:
            return jsonify({"error": "Missing 'raw' field"}), 400

        msg = message_from_string(raw, policy=default)

        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    return jsonify({"text": part.get_content()})
        else:
            return jsonify({"text": msg.get_content()})

        return jsonify({"text": ""})  # fallback
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)

# -->> For body+subject as input

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from email import message_from_string
# from email.policy import default
# from transformers import pipeline
# import torch

# app = Flask(__name__)
# CORS(app, origins=["http://localhost:5173"])

# classifier = pipeline(
#     "zero-shot-classification",
#     model="facebook/bart-large-mnli",
#     device=0 if torch.cuda.is_available() else -1
# )

# # labels
# CATEGORIES = ["Interested", "Not Interested", "Meeting Booked", "Spam", "Out of Office"]

# @app.route("/predict", methods=["POST"])
# def predict():
#     try:
#         data = request.get_json()
#         text = data.get("text", "")
#         if not text:
#             return jsonify({"error": "Missing text field"}), 400

#         result = classifier(text, CATEGORIES)
#         top_label = result["labels"][0]
#         return jsonify({"label": top_label})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route("/parse", methods=["POST"])
# def parse_email():
#     try:
#         data = request.get_json()
#         raw = data.get("raw", "")
#         if not raw:
#             return jsonify({"error": "Missing 'raw' field"}), 400

#         msg = message_from_string(raw, policy=default)

#         # Extract plain text from MIME
#         if msg.is_multipart():
#             for part in msg.walk():
#                 if part.get_content_type() == "text/plain":
#                     return jsonify({"text": part.get_content()})
#         else:
#             return jsonify({"text": msg.get_content()})

#         return jsonify({"text": ""}) 
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(port=5000)
