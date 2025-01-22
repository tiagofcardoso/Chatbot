 README.md

# Flask Bot Application

This project is a Flask web application that serves as a chatbot interface. It allows users to interact with a bot that processes input and generates responses.

## Project Structure

```
flask-bot-app
├── src
│   ├── app.py                # Entry point of the Flask application
│   ├── bot
│   │   ├── __init__.py       # Initializes the bot package
│   │   └── services.py       # Logic for bot functionality
│   ├── templates
│   │   ├── base.html         # Base HTML template
│   │   └── index.html        # Main HTML template for user interaction
│   └── static
│       ├── css
│       │   └── style.css     # CSS styles for the application
│       └── js
│           └── main.js       # JavaScript for client-side interactivity
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables
└── README.md                  # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd flask-bot-app
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Set up environment variables in the `.env` file.

6. Run the application:
   ```
   python src/app.py
   ```

## Usage

Open your web browser and navigate to `http://localhost:5000` to interact with the chatbot.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

MIT License

Copyright (c) 2025 Tiago Cardoso

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.