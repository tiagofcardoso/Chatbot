from flask import Flask, render_template, request, jsonify, url_for, send_from_directory
from werkzeug.utils import secure_filename
from bot.services import load_documents_from_url, process_user_input, load_documents_from_pdf
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg'}

# Ensure directories exist
for directory in ['uploads', 'static/assets/images']:
    path = os.path.join(app.root_path, directory)
    if not os.path.exists(path):
        os.makedirs(path)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Store conversation context
conversation_context = {}


@app.route('/')
def index():
    return render_template('index.html')

# Add route to serve static files


@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)


@app.route('/static/assets/images/<path:filename>')
def serve_images(filename):
    try:
        return send_from_directory(
            os.path.join(app.root_path, 'static/assets/images'),
            filename
        )
    except FileNotFoundError:
        return send_from_directory(
            os.path.join(app.root_path, 'static/assets/images'),
            'default-avatar.png'
        )


@app.route('/process-input', methods=['POST'])
def process_input():
    try:
        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                if filename.endswith('.pdf'):
                    document = load_documents_from_pdf(filepath)
                # Add handlers for other file types here
                os.remove(filepath)  # Clean up after processing
                return jsonify({'response': document})

        user_input = request.form.get('input')
        if user_input:
            if user_input.startswith(('http://', 'https://', 'www.')):
                document = load_documents_from_url(user_input)
            else:
                document = process_user_input(user_input)
            return jsonify({'response': document})

        return jsonify({'error': 'No valid input provided'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        response = process_user_input(user_message)
        return jsonify({'response': response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/upload-file', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        file_type = request.form.get('type')
        if file_type == 'pdf':
            response = load_documents_from_pdf(filepath)
        elif file_type == 'image':
            response = load_documents_from_image(filepath)
        else:
            response = "Unsupported file type"

        os.remove(filepath)  # Clean up
        return jsonify({'response': response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/process-url', methods=['POST'])
def process_url():
    try:
        data = request.get_json()
        url = data.get('url')
        url_type = data.get('type')

        if not url:
            return jsonify({'error': 'No URL provided'}), 400

        if url_type == 'youtube':
            response = load_documents_from_youtube(url)
        else:
            response = load_documents_from_url(url)

        return jsonify({'response': response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Resource not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(debug=True)
