from flask import Blueprint, request, jsonify
import time
from datetime import datetime
from services.groq_client import GroqClient

ai_bp = Blueprint('ai', __name__)
groq_client = GroqClient()

PRIMARY_PROMPT = """
You are a helpful assistant.

Provide:
- Summary
- Key insights
- Sentiment

User Input:
{text}
"""

RECOMMEND_PROMPT = """
Give 3 short actionable recommendations for this input.

User Input:
{text}
"""

@ai_bp.route("/describe", methods=["POST"])
def describe():
    data = request.get_json()
    user_input = data.get("input")
    
    if not user_input:
        return jsonify({"error": "Missing 'input'"}), 400

    prompt = PRIMARY_PROMPT.format(text=user_input)
    result = groq_client.generate(prompt)

    if not result:
        return jsonify({"error": "Failed to generate response"}), 500

    return jsonify({
        "status": "success",
        "input": user_input,
        "output": result["content"],
        "generated_at": datetime.utcnow().isoformat(),
        "meta": {
            "response_time_ms": result["response_time"] * 1000
        }
    })

@ai_bp.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    user_input = data.get("input")

    if not user_input:
        return jsonify({"error": "Missing 'input'"}), 400

    prompt = RECOMMEND_PROMPT.format(text=user_input)
    result = groq_client.generate(prompt)

    if not result:
        return jsonify({"error": "Failed to generate recommendations"}), 500

    raw_output = result["content"]
    lines = raw_output.split("\n")
    clean_lines = [
        l.strip("-•123456789. ").strip()
        for l in lines
        if l.strip() and not l.lower().startswith("here are")
    ]
    clean_lines = clean_lines[:3]

    while len(clean_lines) < 3:
        clean_lines.append("Improve skills through consistent practice")

    recommendations = []
    for i, line in enumerate(clean_lines):
        recommendations.append({
            "action_type": f"Action {i+1}",
            "description": line,
            "priority": "high" if i == 0 else "medium"
        })

    return jsonify({
        "status": "success",
        "input": user_input,
        "recommendations": recommendations,
        "generated_at": datetime.utcnow().isoformat(),
        "meta": {
            "response_time_ms": result["response_time"] * 1000
        }
    })
