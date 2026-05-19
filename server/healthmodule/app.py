from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import json

app = Flask(__name__)
CORS(app)

@app.route("/health-scan", methods=["GET"])
def health_scan():
    try:
        result = subprocess.run(
            ["python", "main.py"],
            capture_output=True,
            text=True,
            timeout=20  # 10s scan + buffer
        )

        output = result.stdout.strip()

        if not output:
            return jsonify({
                "success": False,
                "error": "No output from scanner. Check camera permissions."
            }), 500

        # main.py prints clean JSON — parse directly
        data = json.loads(output)
        return jsonify(data)

    except subprocess.TimeoutExpired:
        return jsonify({
            "success": False,
            "error": "Scan timed out. Make sure camera is accessible and face is visible."
        }), 408

    except json.JSONDecodeError:
        return jsonify({
            "success": False,
            "error": f"Could not parse scanner output: {result.stdout[:200]}"
        }), 500

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status": "Seva Health Model API running ✅"})

@app.route("/")
def home():

    return jsonify({
        "message": "Seva AI Wellness API Running"
    })

if __name__ == "__main__":
    app.run(port=5001, debug=True)
