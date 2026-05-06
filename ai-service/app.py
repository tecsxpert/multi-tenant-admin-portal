from flask import Flask, request
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from services.security import validate_input
from routes.ai_routes import ai_bp

app = Flask(__name__)

# Register Blueprints
app.register_blueprint(ai_bp, url_prefix='/api')

# Rate limiting
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=["30 per minute"]
)

# Input validation
@app.before_request
def before_request():
    if request.method == "POST":
        return validate_input()

# Health endpoint
@app.route("/health", methods=["GET", "POST"])
def health():
    return {"status": "ok"}, 200

# Root endpoint (for ZAP scan)
@app.route("/", methods=["GET"])
def home():
    return {"message": "AI Service Running"}, 200

# Security headers (ZAP fixes)
@app.after_request
def add_security_headers(response):
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"

    # Remove or override server header
    if "Server" in response.headers:
        del response.headers["Server"]

    return response


if __name__ == "__main__":
    # IMPORTANT: disable debug for security
    app.run(port=5000, debug=False)