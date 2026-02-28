<p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# Support Hub — Emotion‑Aware Chatbot 🎯

## Basic Details

- **Team Name:** hacklore  
- **Team Members:**
  - Fathima vt — College of Engineering Vadakara
  - Ashina Suresh — College of Engineering Vadakara

- **Hosted Demo:** https://hacklore-five.vercel.app/
- **Demo Video:** https://drive.google.com/file/d/1_wDzsXwy61K6A9XmBmjcc_EHrstxX6_p/view?usp=drive_link

---

## Project Summary

**Problem statement**  
Many chatbots return repetitive, generic, or off‑target replies that fail to reflect the user's emotional state. That can be frustrating or even harmful when users need empathy or urgent support.

**Solution**  
Support Hub is a lightweight, web‑based chatbot that analyzes the full user message (including negations and sentence meaning), detects emotion and intensity, tracks emotion changes across the conversation, and generates contextually appropriate, human‑sounding replies. It uses an internal father‑figure persona for tone and can optionally call Google Gemini for richer responses.

**AI used during development:** GitHub Copilot (Copilot agent) assisted with code scaffolding and iteration. Optional runtime AI: Google Gemini (Generative Language API) — enabled only if you provide an API key.

---

## Key Features

- Negation‑aware emotion detection (handles "not", "don't", etc.)
- Emotion categories: sad, happy, anxious, angry, stressed, lonely, confused, neutral
- Intensity scoring: mild / moderate / deep / critical with crisis escalation
- Conversation context tracking and emotion change acknowledgment
- Caring father‑figure persona: short, warm, protective replies (3–6 sentences)
- Greeting handling and "I'm fine" gentle probing
- Mood quick‑selector, emoji history, and responsive UI
- Offline fallback responses when the Gemini API is not available

---

## Tech Stack & Files

- Languages: HTML, CSS, JavaScript (vanilla)
- Optional backend: Node.js / Express (for server proxy to Gemini)
- Hosting: Vercel (static or with serverless functions)

Important files:
- `index.html` — Main UI
- `index-local.html` — Offline variant (no external API)
- `style.css` — Styling
- `script.js` — Core logic (emotion detection, response generation, UI)
- `server.js` — Example backend proxy (optional)
- `README.md` — Documentation (this file)

---

## Installation & Run (Static)

No build step required for the static site.

1. Clone the repo:
```bash
git clone <your-repo-url>
cd "my website"
```

2. Open the app:
- Double‑click `index.html` or open `index-local.html` in a modern browser.
- Or serve locally (optional):
```bash
python -m http.server 8000
# then open http://localhost:8000
```

---

## Optional: Run With Node.js Backend (for Gemini proxy)

Use a backend if you want to hide your Gemini API key and avoid exposing it to the browser.

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the project root:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Start the server:
```bash
node server.js
# or
npx nodemon server.js
```

4. Open `http://localhost:3000` (or the port configured in `server.js`).

---

## Gemini Integration (Optional)

- The client optionally sends prompts to Google Gemini (Generative Language API).
- Best practice: call Gemini from a backend server (e.g., `server.js`) to keep the API key secret.
- If you test locally and temporarily embed the key in `script.js`, **do not commit** it to version control.
- Example backend approach:
  - Client POSTs `/api/generate` with message and detected emotion.
  - Server reads `GEMINI_API_KEY` from `.env`, calls Gemini, and returns the generated text.

---

## Deployment (Vercel)

For the static frontend choose the "Other / Static Site (No Framework)" preset in Vercel:

- Framework Preset: Other (Static Site / No Framework)
- Build Command: (leave empty)
- Output Directory: (root or leave empty)

If you add serverless functions for a backend proxy, configure those in Vercel and use a Node preset.

---

## Usage & Examples

- Greeting:
  - Input: "hi"
  - Bot: Short, warm father‑figure greeting (not therapy).
- Mild sadness:
  - Input: "I'm feeling a bit down today"
  - Bot: Acknowledge → Validate → Small action → Encouragement
- Crisis:
  - Input: "I want to end my life"
  - Bot: Immediate crisis protocol, grounding, and urging to contact emergency services (e.g., 988 for US).

Bot output format in UI:
```
Detected emotion: <emotion>
Response: <reply text>
```

---

## Testing & Validation

Try these example inputs and verify outputs:

- "hi" → brief dad greeting
- "I'm not okay" → negative detection → supportive probe
- "I can't breathe, panic attack" → anxious, grounding instruction
- "I want to die" → crisis escalation and resources

---

## Security & Privacy

- Never commit API keys—add `.env` to `.gitignore`.
- Prefer a backend proxy for any external AI calls to avoid exposing keys.
- Local detection runs client‑side in `script.js` by default; with Gemini enabled, user text is sent to the API — ensure you disclose this in privacy docs if collecting logs.

---

## Contribution & Team Work

If you'd like to contribute:

1. Fork the repo
2. Create a feature branch
3. Commit and open a pull request with a clear description

Team roles:
- **Fathima vt:** Frontend, emotion detection, UI/UX, documentation  
- **Ashina Suresh:** Backend/API integration, response generation, deployment

---

## License

We suggest the MIT License. Add `LICENSE` with MIT text if you choose.

---

## Acknowledgements

- GitHub Copilot (Copilot agent) helped during development for scaffolding and code suggestions.
- Google Gemini (optional runtime model) for advanced generation if API key is provided.

---

Made with ❤️ by **hacklore**
