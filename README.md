# Emotional Support Companion with Gemini AI

Your emotionally intelligent wellness companion powered by Google's Gemini 2.5 model.

## Features

- **Emotion Detection**: Automatically detects user emotions from messages
- **Gemini-Powered Responses**: Uses Google's Gemini 2.5 for compassionate, human-understandable replies
- **Crisis Support**: Special handling for urgent emotional distress messages
- **Mood Tracking**: Keep track of your emotional journey with mood history
- **Breathing Exercises**: Guided breathing exercises for emotional regulation
- **Varied Responses**: Personalized, non-repetitive replies to each message

## Setup

### Prerequisites

- Node.js 14+ installed
- Google Gemini API key (get one at [https://aistudio.google.com/app/apikeys](https://aistudio.google.com/app/apikeys))

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Key:**
   The `.env` file should already contain your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`

2. **Open the companion in your browser:**
   Open `index.html` in your web browser (file path: `c:\Users\fathima vt\Desktop\my website\index.html`)

## How It Works

1. **User Input**: You share your thoughts or feelings
2. **Emotion Detection**: The app detects your emotional state
3. **Gemini Processing**: Sends emotion, user message, and severity to the backend
4. **Intelligent Response**: Gemini 2.5 generates a thoughtful, human-like response
5. **Display**: Response appears in the chat with appropriate emoji avatar

## File Structure

```
├── index.html          # Frontend UI and chat interface
├── style.css          # Styling and animations
├── server.js          # Express backend with Gemini integration
├── package.json       # Node dependencies
├── .env              # API key configuration
└── README.md         # This file
```

## API Endpoints

### POST /api/generate-response

Generates an emotionally intelligent response using Gemini.

**Request:**
```json
{
  "userMessage": "I'm feeling sad today",
  "emotion": "sad",
  "severity": "moderate",
  "isGreeting": false
}
```

**Response:**
```json
{
  "reply": "Gemini-generated compassionate response..."
}
```

## Emotion Levels

- **neutral**: Normal conversation
- **positive**: Happy, excited feelings
- **anger**: Angry or frustrated
- **moderate**: Sad, anxious, stressed, confused, tired, lonely
- **crisis**: Urgent emotional distress requiring immediate support

## Troubleshooting

**Issue**: "Cannot fetch from localhost:3000"
- Make sure the backend server is running: `npm start`
- Check that port 3000 is not blocked

**Issue**: "API request failed"
- Verify your Gemini API key in `.env` is valid
- Check your internet connection
- Ensure you have quota available on your Gemini API account

**Issue**: Responses are generic
- The local fallback is being used; ensure the backend is running
- Check browser console for error messages

## Privacy & Security

- Your API key is stored locally in `.env` and never exposed to frontend
- Messages are sent securely to Google's servers via the backend
- No data is logged or stored permanently

## Support

For issues with:
- **Gemini API**: Visit [https://aistudio.google.com](https://aistudio.google.com)
- **This app**: Check the browser console for error messages

---

Made with 💜 for emotional wellness
