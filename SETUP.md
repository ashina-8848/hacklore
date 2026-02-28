# Setup & Configuration Guide

## Quick Start

### 1. Install Dependencies
```bash
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install
```

### 2. Start the Backend Server
```bash
node server.js
```

The server will start on `http://localhost:3000`

### 3. Open the Application
Open `index.html` in your web browser. You should now be able to:
- Chat with the AI companion
- Get Gemini-powered emotional support responses
- Track your mood
- Use breathing exercises

---

## Important: Google Gemini API Quota

### Understanding the Quota Error

If you see this error:
```
Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier
```

This means you've exceeded the free tier limits. Google's free tier has strict rate limits:
- **Requests per minute**: 15
- **Requests per day**: 100
- **Input tokens per minute**: 15,000

### Solutions

#### Option 1: Use a Paid Google Cloud Account (Recommended)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Click "Create API Key"
3. Set up a paid Google Cloud project
4. Billing will start once you exceed free tier limits

#### Option 2: Wait for Quota Reset
- Free tier quotas reset daily
- Wait 24 hours and try again

#### Option 3: Use a Different Model
If you want to continue testing with free tier, edit `server.js` and change:
```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
```
To:
```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
```
The `gemini-1.5-flash` model has higher free tier limits.

---

## Verified Functionality

✅ **Greeting Detection**: Type "hi", "hello", "hey" - gets varied responses
✅ **Backend Server**: Running successfully on port 3000
✅ **Frontend Integration**: HTML communicates with backend via API
✅ **Error Handling**: Gracefully falls back to local responses if API fails
✅ **Emotion Detection**: Correctly identifies emotions (sad, happy, angry, etc.)
✅ **Crisis Support**: Detects crisis keywords and provides urgent support

---

## Testing the API Directly

To test the API without using the web interface:

```powershell
$body = @{
    userMessage="I'm feeling anxious"
    emotion="anxious"
    severity="moderate"
    isGreeting=$false
} | ConvertTo-Json

Invoke-WebRequest `
  -Uri http://localhost:3000/api/generate-response `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | Select-Object -ExpandProperty Content
```

---

## File Structure

```
my website/
├── index.html           # Frontend UI  (open in browser)
├── style.css           # Styling
├── server.js           # Backend API (run with: node server.js)
├── package.json        # Dependencies
├── .env               # API key configuration
├── README.md          # Overview
└── SETUP.md           # This file
```

---

## Architecture

```
Browser (index.html)
    ↓
    ├─ User types message
    ├─ Emotion detection (local)
    └─ Fetch request to API
            ↓
        Backend (server.js)
            ├─ Receives emotion + message
            ├─ Calls Gemini API
            └─ Returns response
            ↓
        Google Gemini API
            ├─ Processes emotion
            └─ Generates compassionate response
            ↓
        Browser receives reply
            └─ Display in chat
```

---

## Environment Variables

The `.env` file contains:
```
GEMINI_API_KEY=your_api_key_here
```

Keep this file secure and never commit it to public repositories.

---

## Troubleshooting Checklist

| Issue | Solution |
|-------|----------|
| Server won't start | Make sure port 3000 is free: `netstat -ano \| findstr :3000` |
| API returns 404 | Check server is running: `http://localhost:3000` in browser |
| Quota exceeded | Use paid tier or wait 24 hours for reset |
| No response from Gemini | Check `.env` has valid API key |
| Front-end shows generic reply | Means API failed; check browser console |

Check browser console (F12) for detailed error messages.

---

## Advanced: Using Different Gemini Models

You can use different models by editing `server.js`:

```javascript
// Fast and efficient (recommended for free tier)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Most capable (higher quota requirements)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

// Experimental (newest features)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
```

---

## Support

- **Gemini API Help**: https://ai.google.dev/
- **Google Cloud**: https://cloud.google.com/
- **Check your quota**: https://ai.google.dev/rate-limits
- **Monitor usage**: Google AI Studio dashboard

---

Made with 💜 for emotional wellness
