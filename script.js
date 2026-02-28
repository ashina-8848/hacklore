const chatBox = document.getElementById('chat-box');
const emotionHistory = [];
let selectedMoodType = null;

const emotionEmojis = {
  sad: '😢',
  happy: '😊',
  angry: '😠',
  anxious: '😰',
  stressed: '😫',
  lonely: '😔',
  confused: '🤔',
  neutral: '💭'
};

// Track last detected emotion across messages
let previousDetectedEmotion = null;

function setQuickMood(emoji, moodType) {
  selectedMoodType = moodType;
  const buttons = document.querySelectorAll('.mood-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Auto-start conversation with mood context
  setTimeout(() => {
    const moodResponses = {
      happy: "I'm so glad you're feeling happy right now! That's wonderful. What's bringing you joy today?",
      sad: "I can sense you're going through something difficult. I'm here to listen. What's on your heart?",
      angry: "I hear that you're frustrated. It's completely valid to feel angry. What happened?",
      anxious: "Anxiety can be really overwhelming. Let's work through this together. What's worrying you?",
      stressed: "Feeling stressed is exhausting. Tell me what's putting pressure on you right now.",
      confused: "Feeling lost or uncertain? That's okay. Let's figure this out together. What's confusing you?"
    };
    
    const response = moodResponses[moodType] || "I'm here for you. What would you like to talk about?";
    addEmotionToHistory(moodType);
    addMessage('bot', emotionEmojis[moodType] + ' ' + response);
  }, 300);
}

function addMessage(sender, text) {
  const div = document.createElement('div');
  div.className = 'message ' + sender;
  const content = document.createElement('div');
  content.className = 'message-content';
  content.innerHTML = text;
  div.appendChild(content);
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addEmotionToHistory(emotion) {
  emotionHistory.push({
    emotion: emotion,
    emoji: emotionEmojis[emotion],
    time: new Date()
  });
  updateEmojiHistory();
}

function updateEmojiHistory() {
  const historyDiv = document.getElementById('emoji-history');
  const noHistoryMsg = document.getElementById('no-history-msg');
  
  if (emotionHistory.length === 0) {
    historyDiv.innerHTML = '';
    noHistoryMsg.style.display = 'block';
    return;
  }
  
  noHistoryMsg.style.display = 'none';
  historyDiv.innerHTML = '';
  
  emotionHistory.slice(-10).reverse().forEach(item => {
    const span = document.createElement('span');
    span.className = 'emoji-item';
    span.textContent = item.emoji;
    span.title = item.emotion.charAt(0).toUpperCase() + item.emotion.slice(1) + '\n' + item.time.toLocaleTimeString();
    historyDiv.appendChild(span);
  });
}

function clearHistory() {
  if (emotionHistory.length === 0) {
    alert('No history to clear!');
    return;
  }
  emotionHistory.length = 0;
  updateEmojiHistory();
}

function clearChat() {
  if (chatBox.children.length <= 1) {
    alert('No conversation to clear!');
    return;
  }
  chatBox.innerHTML = '<div class="message bot"><div class="message-content">👋 Hi — I\'m here. How are you feeling?</div></div>';
  emotionHistory.length = 0;
  updateEmojiHistory();
}

function isGreeting(text) {
  const greetingPatterns = /^(hi|hello|hey|howdy|greetings|what's up|how are you|how are you doing|how's it going|how r u|hii|helloo)\b/i;
  return greetingPatterns.test(text.trim());
}

function assessEmotionalIntensity(text) {
  text = text.toLowerCase();
  
  // High intensity markers
  const highIntensityWords = /\b(suicide|kill myself|can't take it|hopeless|worthless|give up|hate myself|want to die|unbearable|devastated|destroyed|shattered|helpless|can't go on)\b/;
  if (highIntensityWords.test(text)) return 'critical';
  
  // Deep emotional intensity
  const deepIntensityWords = /\b(suicidal|heartbroken|devastate|severely|deeply|extremely|really struggling|falling apart|breaking down|can't handle|destroy|worst|terrible|awful|horrible)\b/;
  if (deepIntensityWords.test(text)) return 'deep';
  
  // Moderate intensity
  const moderateIntensityWords = /\b(really stressed|very anxious|quite sad|struggling|hard time|difficult|overwhelmed|upset|worried)\b/;
  if (moderateIntensityWords.test(text)) return 'moderate';
  
  // Mild/casual
  return 'mild';
}

function detectEmotion(text) {
  // Improved emotion detection that considers negation, sentence meaning, and intensity
  const lower = text.toLowerCase().trim();
  const tokens = lower.split(/\s+/);

  // Negation words that invert nearby emotion words
  const negations = ["not","no","never","don't","didn't","can't","cant","won't","isn't","aren't","dont","didnt","wont"];

  // Emotion keyword lists
  const keywords = {
    sad: ['sad','down','unhappy','depressed','upset','mourn','lost','hopeless','miserable','heartbroken','alone','empty','worthless','empty'],
    happy: ['happy','glad','joy','good','great','awesome','wonderful','amazing','excited','thrilled','grateful','blessed'],
    angry: ['angry','mad','furious','irritated','annoyed','frustrated','rage','pissed','hate'],
    anxious: ['anxious','worried','nervous','uneasy','panic','scared','afraid','dread','overthinking','overthink'],
    stressed: ['stressed','overwhelmed','burned out','pressure','exhausted','tired','drained','worn out','overloaded'],
    lonely: ['lonely','isolated','solitary','disconnect','alone','nobody'],
    confused: ['confused','lost','unclear','perplexed','uncertain','bewildered','baffled','dont know','don\'t know']
  };

  // Count matches, take negations into account
  const scores = {};
  Object.keys(keywords).forEach(k => scores[k] = 0);

  // Helper to check if word at index i is negated by a negation within 3 tokens before it
  function isNegated(i) {
    for (let j = Math.max(0, i-3); j < i; j++) {
      if (negations.includes(tokens[j].replace(/[^a-z0-9']/g, ''))) return true;
    }
    return false;
  }

  // scan for keyword occurrences (phrase match fallback via includes)
  Object.entries(keywords).forEach(([emotion, list]) => {
    list.forEach(kw => {
      const idx = lower.indexOf(kw);
      if (idx !== -1) {
        // approximate token index
        const before = lower.slice(0, idx).split(/\s+/).length - 1;
        const neg = isNegated(before);
        scores[emotion] += neg ? -1 : 2; // negated reduces score, normal adds
      }
    });
  });

  // Check for explicit negative statements that imply sadness/anxiety
  const negativeIndicators = ['suicide','kill myself','worthless','give up','cant go on','cant take it','hopeless','helpless','want to die','alone','empty'];
  negativeIndicators.forEach(ni => { if (lower.includes(ni)) scores['sad'] += 3; });

  // If any strong anxious words present boost anxious
  if (/(panic attack|panic|can't breathe|cant breathe)/.test(lower)) scores['anxious'] += 4;

  // If all scores are zero, fallback to neutral
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore <= 0) return { emotion: 'neutral', level: 'low' };

  // choose top emotion
  const chosen = Object.keys(scores).reduce((a,b)=> scores[a]>=scores[b]?a:b);

  // Determine level roughly by score
  const level = scores[chosen] >= 5 ? 'high' : (scores[chosen] >= 3 ? 'high' : 'low');
  return { emotion: chosen, level };
}

// ============================================
// CARING FATHER FIGURE AI (GEMINI-POWERED)
// ============================================
const GEMINI_API_KEY = 'AIzaSyD8LTHzq0ZMGPCu6CVREvUCPAvxk-37LbM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function generateResponse(userMessage, emotion, prevEmotion = null) {
  const msg = userMessage.toLowerCase();
  
  // Handle casual greetings - warm & brief, like a dad
  if (isGreeting(userMessage)) {
    const dadsGreetings = [
      "Hey kiddo 🙂 I'm glad you're here. How's your heart feeling today?",
      "Hey there, champ. What's going on with you?",
      "Well hey! Come on in. What's on your mind?"
    ];
    return dadsGreetings[Math.floor(Math.random() * dadsGreetings.length)];
  }
  
  // Special handling for "I'm fine" - probe gently
  if (msg === "i'm fine" || msg === "i am fine" || msg === "fine" || msg === "im fine") {
    return "Hmm… sometimes 'fine' hides a lot. Are you really okay, or is something sitting heavy on you? You can tell me.";
  }
  
  // Assess emotional intensity
  const intensity = assessEmotionalIntensity(msg);
  
  // Check for CRISIS - firm but protective like a dad
  const crisisKeywords = ['suicide', 'kill myself', 'self harm', 'want to die', 'hopeless', 'can\'t go on', 'worthless', 'end it', 'harm myself'];
  const isCrisis = crisisKeywords.some(keyword => msg.includes(keyword));
  
  if (isCrisis) {
    return "Hey. Stop. Look at me. You matter more than you realize right now. I mean that. Take a breath with me—slow in, slow out. You need real help right now: call 988 (Suicide & Crisis Lifeline) or go to the ER. I'm here, but you need people trained for this. Can you reach out to someone right now? A parent, a friend, anyone? Promise me.";
  }
  
  // Build father figure system prompt (include previous detected emotion for context tracking)
  const systemPrompt = buildFatherPrompt(emotion, intensity, userMessage, msg, prevEmotion);
  
  const userPrompt = `User said: "${userMessage}"
Their emotion: ${emotion.emotion}
How serious: ${intensity}

Respond like a caring, protective dad. Keep it short and real—3 to 6 sentences.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.80,
          maxOutputTokens: 350,
          topP: 0.9,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      console.error('API error');
      return getFallbackDadResponse(emotion, intensity, msg);
    }

    const data = await response.json();
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    return getFallbackDadResponse(emotion, intensity, msg);
  } catch (error) {
    console.error('Error:', error);
    return getFallbackDadResponse(emotion, intensity, msg);
  }
}

function buildFatherPrompt(emotion, intensity, userMessage, msgLower, prevEmotion) {
  let prompt = `You are a caring, emotionally intelligent father figure. You are:
• Calm and protective
• Warm and wise
• Gentle but strong
• Simple in speech but deep in meaning

YOU ARE NOT:
• A therapist (don't use therapy language)
• Clinical or cold
• Saying "thank you for sharing" or "I appreciate you"
• Using complex psychological terms
• Overly long-winded

Keep responses 3–6 sentences. Sound natural, like a dad who genuinely cares.

Sometimes use soft words: "kiddo", "champ", "I'm here", "take it slow"

When they feel bad, respond like this:
1. Acknowledge their feeling like a dad would
2. Tell them they're not weak
3. Give simple, grounded advice
4. Offer ONE small action
5. End with warmth

Example tone for a hurting kid:
"Hey… slow down. You're carrying too much in your head right now. Sit back for a second. Take one deep breath with me. You don't have to solve everything tonight."

If they feel helpless:
Speak steady and protective: "You're not alone in this. I'm right here. We'll figure it out step by step."

Current situation:
- Emotion: ${emotion.emotion}
- Intensity: ${intensity}
- Message length: ${userMessage.trim().length} characters`;

  // Emotion-specific dad advice
  if (emotion.emotion === 'anxious') {
    prompt += `\n\nThey're anxious. As a dad: Acknowledge it's real. Don't minimize. Offer grounding—breathing, naming things you see/hear/touch. Give ONE small action. End with "I'm here."`;
  } else if (emotion.emotion === 'sad') {
    prompt += `\n\nThey're sad. As a dad: Say you see them hurting. That it's okay. That sadness means they loved deeply. Offer one small step forward. Be warm.`;
  } else if (emotion.emotion === 'angry') {
    prompt += `\n\nThey're angry. As a dad: Validate it. Say anger is honest. Suggest moving—walk, run, punch a pillow. Then help them see what matters. Empower them.`;
  } else if (emotion.emotion === 'lonely') {
    prompt += `\n\nThey're lonely. As a dad: Hear the isolation. Say they're not broken for feeling this. Suggest one small connection. Offer presence.`;
  } else if (emotion.emotion === 'confused') {
    prompt += `\n\nThey're confused. As a dad: Validate that not knowing is hard. Help them find the core question. Break down ONE next step. Be patient.`;
  } else if (emotion.emotion === 'stressed') {
    prompt += `\n\nThey're stressed. As a dad: Acknowledge the load. Say you see them trying hard. Pick ONE priority together. Tell them the rest can wait.`;
  } else if (emotion.emotion === 'happy') {
    prompt += `\n\nThey're happy. As a dad: Match their joy. Celebrate them. Ask what brought this. Tell them to hold onto it.`;
  }

  // Intensity-driven approach
  if (intensity === 'mild') {
    prompt += `\n\nThey're not in crisis. Keep it light, brief, encouraging.`;
  } else if (intensity === 'moderate') {
    prompt += `\n\nModerate distress. Be caring and grounded. Offer real help.`;
  } else if (intensity === 'deep') {
    prompt += `\n\nThey're really hurting. Be strong, steady, protective. Multiple grounding options. Powerful reassurance.`;
  }

  // If there was a previous detected emotion and it differs, optionally acknowledge change
  if (prevEmotion && prevEmotion !== emotion.emotion) {
    prompt += `\n\nNOTE: Previous detected emotion: ${prevEmotion}. If appropriate, briefly acknowledge the change in tone (one short sentence), e.g. \"I notice you're feeling ${emotion.emotion} now after earlier feeling ${prevEmotion}\".`;
  }

  return prompt;
}

function getFallbackDadResponse(emotion, intensity, msgLower) {
  // Dad-like fallback responses
  const dadFallbacks = {
    mild: {
      anxious: "What's worrying you, kiddo? Sometimes saying it out loud helps.",
      sad: "I see something's weighing on you. I'm listening.",
      angry: "Hey, something got under your skin. Talk to me about it.",
      lonely: "Feeling alone can be rough. You're not as alone as you think.",
      confused: "Not knowing what's going on can be frustrating. Let's figure it out.",
      stressed: "You're carrying a lot, champ. One thing at a time.",
      happy: "That's good to see. What made your day better?",
      neutral: "I'm here. What's on your mind?"
    },
    moderate: {
      anxious: "Hey, slow down. You're thinking too hard. Let's ground you. Name 5 things you see, 4 you can touch, 3 you hear.",
      sad: "The weight you're carrying—I see it. You're stronger than you know. What do you need right now?",
      angry: "Your anger is telling you something matters. That's not wrong. What do you need to say?",
      lonely: "Feeling disconnected hurts. You matter, even right now. Is there one person you could reach out to?",
      confused: "Not having answers is hard. Let's slow down and find the real question. What are you actually trying to figure out?",
      stressed: "You're trying to do too much. Pick the one thing that matters most. Let the rest go for now.",
      happy: "I love seeing you like this. Hold onto this feeling. What created it?",
      neutral: "I'm here, and I'm listening. Really. What's going on?"
    },
    deep: {
      anxious: "Hey, take my hand here. Your fear feels huge right now, but it's not. Breathe with me—slow in, slow out. You're safe in this moment.",
      sad: "I can see how much pain you're in. And I want you to know—that depth shows how much you've loved, how much you've hoped. That's strength. You'll get through this.",
      angry: "Your fury is real and it's powerful. Move it out—go run, punch a pillow, scream into the car. Then we'll talk about what you need.",
      lonely: "Isolation is lying to you. You're not alone. Reach out to just one person—even a text. It'll break the spell.",
      confused: "Everything feels like a fog right now. That's okay. Let's slow down. What's ONE thing you actually know for sure? Start there.",
      stressed: "You're drowning, kiddo. Stop. You need rest. You need help. You can't do this alone, and you don't have to.",
      happy: "This joy is yours. Soak it in. These moments are what keep us going.",
      neutral: "I feel like there's something deeper here. You can tell me. I'm not going anywhere."
    }
  };

  const fallback = dadFallbacks[intensity]?.[emotion.emotion] || dadFallbacks.moderate.neutral;
  return fallback;
}

async function sendMessage() {
  const input = document.getElementById('user-input');
  const msg = input.value.trim();
  if (!msg) return;
  
  addMessage('user', msg);
  input.value = '';
  
  const emotion = detectEmotion(msg);
  addEmotionToHistory(emotion.emotion);

  // Keep previous emotion for change-tracking, then update global
  const prev = previousDetectedEmotion;
  previousDetectedEmotion = emotion.emotion;

  // Simulate thinking delay
  setTimeout(async () => {
    const response = await generateResponse(msg, emotion, prev);
    // Ensure outputs follow the user's requested format
    const formatted = `Detected emotion: ${emotion.emotion}\nResponse: ${response}`;
    addMessage('bot', formatted);
  }, 800 + Math.random() * 400);
}

