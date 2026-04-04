# CLAUDE.md — Bloom: Wellness Kiosk for Women's Shelters

## You are building Bloom, a hackathon-winning Android app.

> **Read this ENTIRE file before writing any code. Every section matters.**

---

## PROJECT IDENTITY

**Name:** Bloom
**Tagline:** "A wellness kiosk that turns a shared tablet into a healing garden"
**What it is:** A voice-first, multilingual, zero-login wellness app for women's shelters. Runs on a shared Android tablet in a shelter common area. Women tap a quadrant (Mind, Body, Soul, Connect), do a 2–5 minute guided wellness activity, and a flower blooms in a shared digital garden. No accounts. No data stored. Any language.
**Hackathon:** youCode 2025 — Theme: "Innovation and Equity"
**Challenge:** "Safe, Sound, and Seen: Technology for Women's Wellbeing in Shelters" by Community Women's Initiative (CWI), Vancouver BC

---

## WHAT YOU NEED TO KNOW ABOUT THE USERS

These are women living in shelters — fleeing domestic violence, housing instability, or other crises. Design every interaction with these realities:

1. **They may not have personal phones.** This runs on a SHARED device (a shelter tablet).
2. **They speak many languages.** Lower Mainland demographics: English, Mandarin, Cantonese, Punjabi, Tagalog, Korean, Farsi, Arabic, Spanish, Vietnamese, Hindi, French.
3. **Digital literacy varies enormously.** Some are tech-savvy. Some have never used a smartphone.
4. **Privacy is physical, not just digital.** They're in shared spaces. Someone might be watching.
5. **They may have children with them.**
6. **Time is scarce.** Activities must be 2–5 minutes max.
7. **Autonomy matters.** Use invitational language ("You might try..." NOT "Do this now").
8. **Trust is earned through absence of risk.** Zero login. Zero stored data. Zero tracking.

---

## TECH STACK (final decisions — do not deviate)

| Layer | Technology | Why |
|---|---|---|
| Language | **Kotlin** | Modern Android standard |
| UI | **Jetpack Compose + Material 3** | Declarative, fast iteration, beautiful defaults |
| Navigation | **Compose Navigation** | Single-activity architecture |
| Database | **Room** | Local SQLite for garden flowers + anonymous aggregate stats ONLY |
| Async | **Kotlin Coroutines + Flow** | Standard async pattern |
| AI Brain | **Groq API — Llama 3.3 70B** (llama-3.3-70b-versatile) | Free, blazing fast (<500ms), strong multilingual, one key for everything |
| STT | **Groq API — Whisper Large V3** (whisper-large-v3) | Fast multilingual speech-to-text with auto language detection, same API key |
| STT Fallback | **Android SpeechRecognizer** | Offline fallback, English default |
| TTS | **Android TextToSpeech** | Built-in, supports 30+ languages, offline capable |
| HTTP | **OkHttp + Retrofit** | Standard Android networking |
| JSON | **Kotlinx Serialization** | Kotlin-native JSON parsing |
| Animations | **Compose Animation APIs + Canvas** | Breathing circles, flower garden, transitions |
| Drawing | **Compose Canvas + touch input** | Digital art canvas for Soul quadrant |
| Kiosk | **Immersive mode + auto-timeout** | Full-screen, session auto-wipe after 60s idle |

### API Keys Required (user will provide these as environment config)

**Only ONE API key needed — Groq handles both STT and AI:**

```
GROQ_API_KEY=gsk_...
```

Backup (only if Groq rate limits during heavy testing):
```
GEMINI_API_KEY=AIza...
```

Store these in `local.properties` (gitignored) and access via BuildConfig:
```properties
# local.properties
GROQ_API_KEY=gsk_xxx
GEMINI_API_KEY=AIza_xxx_optional_backup
```

**Groq Free Tier Limits (more than enough):**
- Chat completions (Llama 3.3 70B): 14,400 requests/day, 6,000 tokens/min
- Whisper STT: 14,400 requests/day
- If you hit rate limits during intense testing, temporarily switch AI brain to Gemini 2.0 Flash

---

## APP ARCHITECTURE

```
bloom/
├── app/
│   ├── src/main/
│   │   ├── kotlin/com/bloom/app/
│   │   │   ├── BloomApp.kt                    # Application class, init TTS
│   │   │   ├── MainActivity.kt                 # Single activity, immersive mode
│   │   │   │
│   │   │   ├── navigation/
│   │   │   │   └── BloomNavGraph.kt            # All screen routes
│   │   │   │
│   │   │   ├── ui/
│   │   │   │   ├── theme/
│   │   │   │   │   ├── Color.kt               # Bloom color palette
│   │   │   │   │   ├── Theme.kt               # Material 3 theme
│   │   │   │   │   └── Type.kt                # Typography
│   │   │   │   │
│   │   │   │   ├── screens/
│   │   │   │   │   ├── AmbientGardenScreen.kt  # Idle screen: living garden + breathing circle
│   │   │   │   │   ├── WellnessWheelScreen.kt  # 4-quadrant selection + mood emoji bar
│   │   │   │   │   ├── MindScreen.kt           # Mind activities menu
│   │   │   │   │   ├── BodyScreen.kt           # Body activities menu
│   │   │   │   │   ├── SoulScreen.kt           # Soul activities menu
│   │   │   │   │   ├── ConnectScreen.kt         # Connect: garden view, gratitude wall, resources
│   │   │   │   │   ├── StaffDashboardScreen.kt  # PIN-protected staff view
│   │   │   │   │   └── ResourceFinderScreen.kt  # BC211 resource lookup
│   │   │   │   │
│   │   │   │   ├── activities/                   # Individual wellness activities
│   │   │   │   │   ├── BreathingExercise.kt     # Animated breathing circle with patterns
│   │   │   │   │   ├── GroundingExercise.kt     # 5-4-3-2-1 guided grounding
│   │   │   │   │   ├── ThoughtReframe.kt        # AI-powered cognitive reframe
│   │   │   │   │   ├── GentleStretch.kt         # Guided seated stretches
│   │   │   │   │   ├── TensionRelease.kt        # Progressive muscle relaxation
│   │   │   │   │   ├── MovementSnack.kt         # 60-second micro-movement
│   │   │   │   │   ├── DrawingCanvas.kt         # Finger painting
│   │   │   │   │   ├── GratitudePrompt.kt       # "What was okay today?"
│   │   │   │   │   ├── AffirmationScreen.kt     # Culturally-aware affirmation
│   │   │   │   │   └── MemorySpark.kt           # Identity reclamation prompt
│   │   │   │   │
│   │   │   │   └── components/
│   │   │   │       ├── FlowerGarden.kt          # Shared garden Canvas visualization
│   │   │   │       ├── BreathingCircle.kt       # Reusable breathing animation
│   │   │   │       ├── MoodSelector.kt          # Emoji mood bar
│   │   │   │       ├── VoiceButton.kt           # Mic button with recording state
│   │   │   │       ├── WellnessCard.kt          # Activity selection card
│   │   │   │       ├── FlowerBloom.kt           # Single flower bloom animation
│   │   │   │       ├── LanguageBadge.kt         # Shows detected language
│   │   │   │       ├── SessionTimer.kt          # Inactivity countdown
│   │   │   │       └── GratitudeWall.kt         # Anonymous message wall
│   │   │   │
│   │   │   ├── data/
│   │   │   │   ├── db/
│   │   │   │   │   ├── BloomDatabase.kt         # Room database
│   │   │   │   │   ├── FlowerDao.kt             # Garden flowers CRUD
│   │   │   │   │   ├── StatsDao.kt              # Aggregate stats CRUD
│   │   │   │   │   ├── GratitudeDao.kt          # Anonymous gratitude messages
│   │   │   │   │   └── Entities.kt              # All Room entities
│   │   │   │   │
│   │   │   │   ├── models/
│   │   │   │   │   ├── WellnessQuadrant.kt      # Enum: MIND, BODY, SOUL, CONNECT
│   │   │   │   │   ├── Mood.kt                  # Enum: moods with emoji
│   │   │   │   │   ├── Flower.kt                # Flower data (quadrant, timestamp, color)
│   │   │   │   │   ├── SessionState.kt          # Current ephemeral session
│   │   │   │   │   └── Resource.kt              # BC211 resource model
│   │   │   │   │
│   │   │   │   └── repository/
│   │   │   │       ├── GardenRepository.kt      # Flower operations
│   │   │   │       ├── StatsRepository.kt       # Anonymous aggregate stats
│   │   │   │       └── ResourceRepository.kt    # BC211 resource lookup
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── VoiceService.kt              # STT orchestration (Groq Whisper + fallback)
│   │   │   │   ├── TTSService.kt                # Text-to-speech wrapper
│   │   │   │   ├── WellnessAI.kt               # Claude API integration
│   │   │   │   ├── LanguageManager.kt           # Language detection + UI locale switching
│   │   │   │   └── SessionManager.kt            # Inactivity timeout, session wipe
│   │   │   │
│   │   │   └── util/
│   │   │       ├── AudioRecorder.kt             # Record audio for Whisper
│   │   │       └── Constants.kt                 # App-wide constants
│   │   │
│   │   ├── res/
│   │   │   ├── values/strings.xml               # English strings
│   │   │   ├── values-zh/strings.xml            # Mandarin
│   │   │   ├── values-pa/strings.xml            # Punjabi
│   │   │   ├── values-tl/strings.xml            # Tagalog
│   │   │   ├── values-ko/strings.xml            # Korean
│   │   │   ├── values-fa/strings.xml            # Farsi
│   │   │   ├── values-ar/strings.xml            # Arabic
│   │   │   ├── values-es/strings.xml            # Spanish
│   │   │   ├── values-vi/strings.xml            # Vietnamese
│   │   │   ├── values-hi/strings.xml            # Hindi
│   │   │   ├── values-fr/strings.xml            # French
│   │   │   ├── raw/                             # Guided exercise audio (if any)
│   │   │   └── font/                            # Noto Sans for multilingual support
│   │   │
│   │   └── AndroidManifest.xml
│   │
│   └── build.gradle.kts
│
├── data/                                         # CWI datasets
│   └── raw/                                      # Raw files from hackathon (Excel/CSV)
│       ├── Merged Shelter List.xlsx               # Shelter locations
│       ├── bc211_mental_health.csv                # BC211 exports
│       ├── bc211_food.csv
│       ├── bc211_counselling.csv
│       ├── ... (other BC211 categories)
│       └── CWI_synthetic_residents.csv            # 500 synthetic profiles
│
├── scripts/
│   └── parse_data.py                             # Script to parse raw → JSON in assets/
│
├── local.properties                              # API keys (GITIGNORED)
├── CLAUDE.md                                     # This file
└── README.md                                     # Project documentation for submission
```

---

## SCREEN-BY-SCREEN SPECIFICATION

### Screen 1: Ambient Garden (Idle / Home)

**Route:** `/ambient`
**Purpose:** The "always-on" screen when nobody is actively using the app. Transforms the tablet from a dead screen into a living piece of calm technology.

**What it shows:**
- A **digital garden** filling the screen — flowers of different colors (blue=Mind, green=Body, pink=Soul, amber=Connect) gently swaying. Each flower represents a completed wellness activity by ANY resident (anonymous). The garden grows over time as the app is used.
- A **breathing circle** in the center — a soft, translucent circle that slowly expands (inhale, 4 seconds) and contracts (exhale, 4 seconds) continuously. Anyone walking by can sync their breathing to it without touching the screen.
- Subtle **time-of-day ambient color shift** — warmer tones in morning, cooler at night. Use system clock.
- A single large **"Begin" button** at the bottom center. Tapping anywhere on the screen also works.
- Small, subtle **staff icon** in the top-right corner (🔧) that leads to PIN-protected staff dashboard.
- **Flower count** displayed subtly: "47 moments of wellness in our garden"

**Technical notes:**
- Garden rendered with Compose Canvas. Flowers are simple shapes (circles + stems + petals) drawn procedurally based on data from Room DB.
- Breathing circle: `animateFloatAsState` with `infiniteRepeatable` tween between scale 0.6 and 1.0.
- Time-of-day: use `Calendar.getInstance().get(Calendar.HOUR_OF_DAY)` to shift background gradient.
- Staff PIN default: "1234" (changeable in staff settings).

**Transition:** Tap "Begin" → animate garden fading out → Wellness Wheel slides up.

---

### Screen 2: Wellness Wheel

**Route:** `/wheel`
**Purpose:** The main menu. Four quadrants + mood check-in + voice input.

**Layout (portrait):**

```
┌─────────────────────────┐
│  [Language: EN 🌐]  [X] │   ← top bar: detected language badge + close/back
│                         │
│    😔 😰 😤 😐 😊      │   ← mood emoji bar (tap one, optional)
│   How are you feeling?  │
│                         │
│   ┌─────────┬─────────┐ │
│   │  🧠     │  🏃‍♀️    │ │
│   │  Mind   │  Body   │ │   ← four large tappable quadrant cards
│   │  (blue) │ (green) │ │      each ~40% of screen width
│   ├─────────┼─────────┤ │      rounded corners, soft shadows
│   │  ✨     │  🤝     │ │
│   │  Soul   │ Connect │ │
│   │  (pink) │ (amber) │ │
│   └─────────┴─────────┘ │
│                         │
│      🎤 Talk to Bloom   │   ← voice input button
│                         │
└─────────────────────────┘
```

**Behavior:**
- **Mood emoji bar:** Tap one emoji to set the mood context. This is NOT stored permanently — it's held in session memory only and used to personalize AI responses within this session. If user taps 😰 (anxious) and then taps Mind, the AI knows to prioritize grounding/breathing.
- **Quadrant cards:** Large, colorful, with a simple icon and one-word label. Tapping one navigates to that quadrant's activity menu.
- **Voice button:** Hold to record. Release to send to Groq Whisper. Bloom detects language automatically and responds. Example: user says "I can't sleep" in Mandarin → Bloom detects Mandarin, responds in Mandarin, suggests a Mind activity (breathing or grounding). User says "my shoulders hurt" → Body quadrant, tension release.
- **Language badge:** Shows currently detected language (e.g., "EN", "中文", "ਪੰਜਾਬੀ"). Tapping it opens a manual language selector (grid of language names in their native script). Auto-updates when voice input detects a different language.
- **Close button (X):** Returns to Ambient Garden. Wipes session.

**Session management:** A `SessionManager` starts a 60-second inactivity timer on this screen. Any touch or voice input resets the timer. If timer expires → auto-navigate back to Ambient Garden, wipe session state.

---

### Screen 3: Mind Activities

**Route:** `/mind`
**Purpose:** Mental health and emotional support micro-activities.

**Shows 4 activity cards:**

1. **Breathing with Bloom**
   - Icon: Animated breathing circle preview
   - Subtitle: "2 minutes · Follow the circle"
   - Leads to: BreathingExercise screen

2. **Grounding (5-4-3-2-1)**
   - Icon: Hand with 5 fingers
   - Subtitle: "3 minutes · Come back to now"
   - Leads to: GroundingExercise screen

3. **Reframe a thought**
   - Icon: Lightbulb
   - Subtitle: "3 minutes · Shift your perspective"
   - Leads to: ThoughtReframe screen (AI-powered)

4. **Release a worry**
   - Icon: Feather floating away
   - Subtitle: "2 minutes · Let it out"
   - Leads to: Voice journaling moment (speak → AI responds with compassion → nothing stored)

Each card has the **quadrant color (blue)** as accent. Large touch targets (minimum 80dp height). Icons should be simple, not clipart — use Material icons or simple Compose Canvas drawings.

---

### Screen 4: Body Activities

**Route:** `/body`

1. **Gentle stretch (seated)**
   - "3 minutes · No mat needed"
   - Step-by-step animated figure showing seated stretches
   - Voice guidance in detected language

2. **Tension release**
   - "3 minutes · Melt the stress away"
   - Progressive muscle relaxation with voice guidance
   - "Squeeze your shoulders to your ears... hold... now let them drop"

3. **Movement snack**
   - "1 minute · Shake it out"
   - Fun, playful micro-movement
   - Shake hands, roll neck, hip circles

4. **Find food nearby** (BC211 integration)
   - "Community food resources"
   - Shows nearest free/low-cost food programs from BC211 data
   - Filtered by shelter location

---

### Screen 5: Soul Activities

**Route:** `/soul`

1. **Digital canvas**
   - Full-screen finger painting with color palette
   - No prompts — just colors and freedom
   - On finish: option to "Plant this in the garden" (saves as anonymous flower) or "Let it go" (discard)

2. **Gratitude moment**
   - AI asks (voice + text): "What's one small thing that was okay today?"
   - User can speak or type response
   - AI responds warmly in their language
   - Option to share anonymously to the gratitude wall

3. **Affirmation**
   - Culturally-thoughtful affirmation displayed beautifully and spoken aloud
   - Different affirmations for different cultural contexts
   - AI generates these based on detected language/cultural context
   - Large, beautiful typography centered on screen

4. **Memory spark**
   - "Tell me about something that makes you smile"
   - Voice-first conversation with AI
   - Warm, gentle, identity-reclamation focused
   - Nothing stored

---

### Screen 6: Connect

**Route:** `/connect`

1. **The Garden** (full view)
   - Larger, scrollable view of the shared digital garden
   - Each flower has a subtle animation
   - Counter: "127 moments of wellness"
   - Tap a flower to see which quadrant it came from (not who)

2. **Gratitude Wall**
   - Scrollable list of anonymous messages
   - "The sun came out today and I actually noticed"
   - "My kid laughed at breakfast"
   - Each message is a card with soft background color
   - "Add yours" button at bottom

3. **Community Mood**
   - Simple aggregate: "Today, our community is feeling:" with averaged emoji
   - Calculated from anonymous mood check-ins (from Wellness Wheel)
   - Shows last 7 days as a simple line

4. **Find Support** (BC211 Resource Bridge)
   - Categories: Mental Health, Food, Counselling, Crisis, Indigenous Services, Immigrant/Refugee, Victim Services, Recreation
   - Each category shows nearest resources from BC211 data
   - Phone numbers, addresses, hours
   - "Call" button for phone numbers

---

### Screen 7: Staff Dashboard

**Route:** `/staff`
**Access:** PIN-protected (default: 1234)

**Shows:**
- **Today's sessions:** Count of Bloom sessions today
- **This week:** Chart (simple bar) of daily session counts
- **Quadrant breakdown:** Pie or donut chart — which quadrants are most used
- **Peak times:** Bar chart of sessions by hour of day
- **Language distribution:** What languages residents are using
- **Garden stats:** Total flowers, flowers this week
- **Gratitude wall moderation:** Ability to remove inappropriate messages

**Important:** This dashboard shows ONLY aggregate, anonymous data. No individual sessions. No identifying information. No mood data tied to any session.

---

## ACTIVITY SCREEN SPECIFICATIONS

### BreathingExercise.kt

**Layout:**
- Full screen, calming background color (very light blue)
- Large breathing circle in center (takes up ~60% of screen)
- Circle **smoothly** expands on inhale, holds, contracts on exhale
- Text above circle changes: "Breathe in..." → "Hold..." → "Breathe out..." → "Hold..."
- Three breathing patterns offered at start (tap to select):
  - **Box breathing:** 4-4-4-4 (inhale-hold-exhale-hold, 4 seconds each)
  - **Calming breath:** 4-7-8
  - **Simple deep breath:** 4-0-6-0 (no hold)
- Timer shows elapsed time and remaining (2 minutes default)
- Soft voice guidance via TTS: "Breathe in... hold... breathe out..."
- "Done" button appears after minimum 1 minute

**On completion:** Show "Great job. You grew a flower." → animate a blue flower blooming → save flower to Room DB → return to Wellness Wheel.

### GroundingExercise.kt

**Flow (5-4-3-2-1 technique):**
1. Screen shows large "5" with text: "Name 5 things you can see"
   - TTS speaks the instruction in detected language
   - User can tap "Next" when ready (no need to actually list them — we don't record)
   - Gentle pulse animation on the number
2. "4" → "Name 4 things you can touch"
3. "3" → "Name 3 things you can hear"
4. "2" → "Name 2 things you can smell"
5. "1" → "Name 1 thing you can taste"
6. Final screen: "You are here. You are safe. You are present." with breathing circle.

**On completion:** Blue flower blooms.

### ThoughtReframe.kt (AI-Powered)

**Flow:**
1. Screen asks: "What thought is weighing on you?" (voice + text, in detected language)
2. User speaks or types
3. Send to Groq Llama 3.3 70B with this system prompt:

```
You are Bloom, a gentle wellness companion for women in shelters.
A woman has shared a difficult thought with you. Respond with:
1. Validation — acknowledge her feeling without judgment (1 sentence)
2. A gentle cognitive reframe — offer an alternative perspective (1-2 sentences)
3. A small, actionable suggestion (1 sentence)

RULES:
- Respond in {detected_language}
- Use invitational language: "You might consider..." not "You should..."
- Never minimize her experience
- Never give medical/legal/therapeutic advice
- Keep total response under 60 words
- Be warm, not clinical
```

4. Display AI response in large text + speak via TTS
5. "Would you like to try another thought?" or "Return to garden"

**On completion:** Blue flower blooms.

### DrawingCanvas.kt

**Full-screen canvas:**
- White background
- Color palette at bottom: 8-10 colors (the quadrant colors + black + white + brown + rainbow)
- Brush size slider (small, medium, large)
- Undo button, clear button
- "Done" button
- Touch drawing via Compose Canvas `pointerInput` + `drawPath`

**On done:**
- Dialog: "Would you like to plant this in our garden?" → Yes saves as pink flower. No discards.
- The drawing itself is NOT saved (no image storage). Only the flower record.

### GratitudePrompt.kt

**Flow:**
1. Beautiful screen with soft pink/coral background
2. Large text + TTS: "What's one small thing that was okay today?"
3. Voice input button OR text field
4. User responds
5. Send to Groq Llama 3.3 70B:

```
You are Bloom. A woman in a shelter just shared something she's grateful for.
Respond with genuine warmth in 1-2 sentences. Reflect back what she said
with care. End with a brief encouragement.
Respond in {detected_language}. Keep under 40 words.
```

6. Display + speak AI response
7. "Would you like to share this anonymously on our gratitude wall?" → Yes saves the USER's original message (not the AI response) as a gratitude wall entry. No discards.

**On completion:** Pink flower blooms.

---

## VOICE & LANGUAGE SYSTEM

### How multilingual works end-to-end:

```
User speaks → AudioRecorder captures PCM → 
Send to Groq Whisper API → 
Returns: { text: "...", language: "zh" } →
LanguageManager updates detected language →
UI strings switch to that language (Android locale) →
TTS engine switches to that language →
AI prompts include language instruction →
AI responds in that language →
TTS speaks the response in that language
```

### VoiceService.kt — STT Implementation

```kotlin
// Groq Whisper API endpoint
// POST https://api.groq.com/openai/v1/audio/transcriptions
// Model: whisper-large-v3
// Form data: file (audio), model, response_format="verbose_json"
// Returns: { text: "...", language: "zh", segments: [...] }

// 1. Record audio using AudioRecord (PCM 16-bit, 16kHz, mono)
// 2. Convert to WAV format (add WAV header to PCM bytes)
// 3. Send as multipart/form-data to Groq Whisper
// 4. Parse response for text + detected language
// 5. Update LanguageManager with detected language
// 6. Return transcribed text

// OFFLINE FALLBACK: If Groq fails (no internet), use Android SpeechRecognizer
// with the currently selected language locale
```

### TTSService.kt — Text-to-Speech

```kotlin
// Wrapper around Android TextToSpeech
// On init: tts = TextToSpeech(context) { status -> ... }
// On language change: tts.setLanguage(Locale(languageCode))
// On speak: tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
//
// Language mapping:
// "en" → Locale.ENGLISH
// "zh" → Locale.CHINESE
// "pa" → Locale("pa", "IN")   // Punjabi
// "tl" → Locale("tl", "PH")   // Tagalog
// "ko" → Locale.KOREAN
// "fa" → Locale("fa", "IR")   // Farsi
// "ar" → Locale("ar")          // Arabic
// "es" → Locale("es")          // Spanish
// "vi" → Locale("vi", "VN")   // Vietnamese
// "hi" → Locale.forLanguageTag("hi-IN")  // Hindi
// "fr" → Locale.FRENCH
//
// Samsung S25+ ships with Samsung TTS and Google TTS — both support these languages.
// Check tts.isLanguageAvailable(locale) and fall back to Google TTS engine if needed.
```

### LanguageManager.kt — State Management

```kotlin
// Holds: currentLanguage: StateFlow<String> (ISO 639-1 code, default "en")
// When updated:
//   1. Updates TTS language
//   2. Updates app locale for string resources (AppCompatDelegate.setApplicationLocales)
//   3. Stores in session (NOT persisted across sessions)
//
// Manual override: User can tap the language badge and select from a grid
// Auto-detect: Updated when Groq Whisper returns a language code
```

### String Resources for Multilingual UI

Create `strings.xml` files for each supported language. Key strings to translate:

```xml
<!-- values/strings.xml (English - default) -->
<string name="app_name">Bloom</string>
<string name="begin">Begin</string>
<string name="how_feeling">How are you feeling?</string>
<string name="mind">Mind</string>
<string name="body">Body</string>
<string name="soul">Soul</string>
<string name="connect">Connect</string>
<string name="talk_to_bloom">Talk to Bloom</string>
<string name="breathe_in">Breathe in</string>
<string name="hold">Hold</string>
<string name="breathe_out">Breathe out</string>
<string name="done">Done</string>
<string name="great_job">You grew a flower</string>
<string name="back_to_garden">Return to garden</string>
<string name="gratitude_prompt">What\'s one small thing that was okay today?</string>
<string name="share_anonymous">Share anonymously?</string>
<string name="garden_count">%d moments of wellness</string>
<string name="find_support">Find support</string>
<string name="staff_dashboard">Staff dashboard</string>
<string name="enter_pin">Enter PIN</string>
<string name="sessions_today">Sessions today</string>
<string name="name_5_see">Name 5 things you can see</string>
<string name="name_4_touch">Name 4 things you can touch</string>
<string name="name_3_hear">Name 3 things you can hear</string>
<string name="name_2_smell">Name 2 things you can smell</string>
<string name="name_1_taste">Name 1 thing you can taste</string>
<string name="you_are_here">You are here. You are safe. You are present.</string>
<string name="whats_on_mind">What thought is weighing on you?</string>
<string name="memory_prompt">Tell me about something that makes you smile</string>
<string name="gentle_stretch">Gentle stretch</string>
<string name="tension_release">Tension release</string>
<string name="movement_snack">Movement snack</string>
<string name="find_food">Find food nearby</string>
<string name="digital_canvas">Digital canvas</string>
<string name="gratitude_moment">Gratitude moment</string>
<string name="affirmation">Affirmation</string>
<string name="memory_spark">Memory spark</string>
<string name="the_garden">The garden</string>
<string name="gratitude_wall">Gratitude wall</string>
<string name="community_mood">Community mood</string>
<string name="plant_in_garden">Plant this in the garden</string>
<string name="let_it_go">Let it go</string>
```

**IMPORTANT:** Use Claude Code (the tool building this project) to generate translations for all these strings into the 11 target languages. Create a script or do it once and commit the translated strings.xml files.

---

## AI INTEGRATION — Groq API (Llama 3.3 70B + Whisper)

**Everything goes through one API: Groq.** Same key, same base URL, two endpoints.

### WellnessAI.kt — LLM (Llama 3.3 70B)

```kotlin
// POST https://api.groq.com/openai/v1/chat/completions
// Headers:
//   Authorization: Bearer {GROQ_API_KEY}
//   Content-Type: application/json
//
// Request body (OpenAI-compatible format):
// {
//   "model": "llama-3.3-70b-versatile",
//   "messages": [
//     { "role": "system", "content": BLOOM_SYSTEM_PROMPT },
//     { "role": "user", "content": user_message }
//   ],
//   "temperature": 0.7,
//   "max_tokens": 150,
//   "stream": true
// }
//
// SYSTEM PROMPT (shared across all AI interactions):

val BLOOM_SYSTEM_PROMPT = """
You are Bloom, a gentle wellness companion integrated into a tablet
at a women's shelter. You speak with warmth, care, and respect.

CONTEXT:
- The woman you're speaking with may be fleeing domestic violence,
  experiencing homelessness, or facing other crises
- She is using a SHARED device in a COMMON AREA — others may see the screen
- She may have children with her
- Privacy and safety are paramount

LANGUAGE: Respond ONLY in {LANGUAGE}. Do not switch languages.
If the language is English, respond in simple, clear English.

RULES:
1. Use invitational language: "You might..." "If you'd like..." "Perhaps..."
   NEVER commanding: "You must..." "You should..." "Do this..."
2. Keep responses under 60 words. She has 2-5 minutes.
3. Never give medical, legal, or therapeutic advice.
4. Never ask about her abuser, her situation details, or anything that
   could be seen on screen by someone unsafe.
5. Never store, reference, or recall anything from previous sessions.
6. Validate her feelings before offering any suggestion.
7. If she expresses crisis/danger, gently direct to crisis resources:
   - "If you're in immediate danger, please tell a staff member or call 911"
   - "VictimLink BC: 1-800-563-0808 (24/7)"
8. Be warm and human, not clinical or robotic.
9. End interactions with gentle encouragement, never pressure.
""".trimIndent()

// For each AI-powered activity, add a specific user message:
// ThoughtReframe: "A woman shared this thought: '{user_input}'. Help her gently reframe it."
// GratitudePrompt: "A woman said this when asked what was okay today: '{user_input}'. Respond warmly."
// Affirmation: "Generate one culturally thoughtful affirmation for a woman whose detected language/cultural context is {language}. Just the affirmation, nothing else."
// MemorySpark: "A woman shared this memory: '{user_input}'. Respond with warmth and help her reconnect with this part of herself."
// VoiceChat: "A woman said: '{user_input}'. She selected the mood: {mood}. Respond helpfully and suggest a relevant wellness activity from: breathing, grounding, stretching, drawing, gratitude."
```

### Streaming Responses (Groq is OpenAI-compatible)

```kotlin
// Groq streaming uses the exact same SSE format as OpenAI:
// stream=true in request body
// Response chunks: data: {"choices":[{"delta":{"content":"..."}}]}
// Parse each chunk's delta.content and append to UI text
// Groq is EXTREMELY fast — first token typically arrives in <100ms
// Start TTS once a full sentence is detected (period, question mark, etc.)
```

### Gemini Fallback (if Groq rate-limited)

```kotlin
// Only use if Groq hits rate limits during heavy testing/demo
// POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}
// {
//   "contents": [{"parts":[{"text": system_prompt + "\n\nUser: " + user_message}]}],
//   "generationConfig": {"temperature": 0.7, "maxOutputTokens": 150}
// }
// Parse: response.candidates[0].content.parts[0].text
```

---

## DATA MODELS (Room Database)

```kotlin
@Entity(tableName = "flowers")
data class FlowerEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val quadrant: String,      // "MIND", "BODY", "SOUL", "CONNECT"
    val timestamp: Long,        // System.currentTimeMillis()
    val colorHex: String        // Flower color based on quadrant
)

@Entity(tableName = "gratitude_messages")
data class GratitudeEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val message: String,        // Anonymous message text
    val timestamp: Long,
    val language: String        // Language it was written in
)

@Entity(tableName = "session_stats")
data class SessionStatEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val timestamp: Long,
    val quadrant: String,       // Which quadrant was used
    val activityType: String,   // Which specific activity
    val durationSeconds: Int,   // How long the session lasted
    val language: String,       // Detected language
    val mood: String?,          // Selected mood emoji (nullable)
    val hourOfDay: Int          // 0-23, for peak time analysis
)
// NOTE: No user ID, no name, no identifiable data. Ever.
```

---

## BC211 RESOURCE DATA INTEGRATION

### HOW TO HANDLE DATASETS

**The user has placed raw dataset files in `data/raw/` in the project root.**
These include:
- `Merged Shelter List (ShelterSafe and BC Housing data).xlsx` — shelter locations
- BC211 CSV/Excel files for various resource categories
- `CWI_synthetic_residents.csv` (or .xlsx) — 500 synthetic resident profiles

**Your job:**
1. Write a Kotlin script OR a Python script (in `scripts/parse_data.py`) that parses these raw files into clean JSON
2. Output the JSON files to `app/src/main/assets/` so the Android app can load them
3. If raw files are Excel (.xlsx), use a library to parse them (Apache POI for Kotlin, openpyxl for Python)
4. Commit both the raw data AND the parsed JSON to the repo

If the raw files haven't been placed yet, create the JSON files manually with representative sample data based on the formats below, and mark them with a TODO comment so the real data can be swapped in.

### Data Format (app/src/main/assets/bc211_resources.json)

```json
[
  {
    "category": "mental_health",
    "name": "Crisis Centre BC",
    "phone": "1-800-784-2433",
    "address": "...",
    "city": "Vancouver",
    "hours": "24/7",
    "languages": ["en", "fr"],
    "description": "24-hour crisis support line"
  },
  {
    "category": "food",
    "name": "Greater Vancouver Food Bank",
    "phone": "604-876-3601",
    "address": "1150 Raymur Ave, Vancouver",
    "hours": "Mon-Fri 8am-4pm",
    "languages": ["en"],
    "description": "Free food hampers"
  }
]
```

Categories: `mental_health`, `food`, `clothing`, `counselling`, `recreation`, `indigenous`, `lgbtq`, `disability`, `immigrant_refugee`, `victim_services`, `addiction`, `emergency_crisis`

**Parse the actual BC211 CSV data provided by the hackathon into this JSON format.** The user will upload the BC211 data files. Parse them with a script and commit the JSON.

### ResourceRepository.kt

Load from assets at app startup. Filter by category. Display in ResourceFinderScreen. Include "Call" button that opens dialer with `Intent(Intent.ACTION_DIAL, Uri.parse("tel:$phone"))`.

---

## SHELTER DATA INTEGRATION

### app/src/main/assets/shelters.json

Parse the "Merged Shelter List" Excel into JSON:

```json
[
  {
    "name": "Atira Women's Resource Centre",
    "city": "Vancouver",
    "organization": "Atira Women's Resource Society",
    "phone": "604-331-1407",
    "type": "Transition House",
    "latitude": 49.2827,
    "longitude": -123.1207,
    "accessibility": true,
    "pets": false,
    "children": true,
    "has_shared_device": true,
    "has_shared_kitchen": true,
    "has_outdoor_space": false
  }
]
```

Used in:
1. Staff dashboard: "This Bloom is deployed at [shelter name]"
2. Resource finder: calculate distance to BC211 resources from shelter location
3. Demo mode: show CWI's partner shelters on a map

---

## SYNTHETIC RESIDENT PROFILES (Demo Only)

The 500 synthetic profiles are used ONLY for demo/pitch purposes — to show judges how Bloom adapts to different residents. They are NOT used in the actual app flow.

Create a **Demo Mode** accessible from the staff dashboard:
- "Run Demo" button
- Cycles through 5 diverse profiles:
  1. Mandarin speaker, low digital familiarity, 2 children
  2. English speaker, high digital familiarity, no children
  3. Punjabi speaker, medium familiarity, limited mobility
  4. Arabic speaker, low familiarity, 1 child
  5. Spanish speaker, medium familiarity, no children
- For each profile, show how the UI adapts: language switches, activities adjust (seated exercises for limited mobility), voice responds in their language

---

## VISUAL DESIGN SYSTEM

### Color Palette

```kotlin
// Bloom colors — soft, warm, trauma-informed
object BloomColors {
    // Quadrant colors
    val mindBlue = Color(0xFF7EB8E0)        // Calm, clear
    val mindBlueBg = Color(0xFFE8F2FA)      // Light background
    val bodyGreen = Color(0xFF8BC6A3)        // Growth, vitality
    val bodyGreenBg = Color(0xFFE8F5EE)
    val soulPink = Color(0xFFE4A0B7)        // Warmth, creativity
    val soulPinkBg = Color(0xFFFBEAF0)
    val connectAmber = Color(0xFFE8C170)    // Connection, light
    val connectAmberBg = Color(0xFFFAEEDA)

    // Neutrals
    val background = Color(0xFFFAF8F5)      // Warm off-white
    val surface = Color(0xFFFFFFFF)
    val textPrimary = Color(0xFF2C2C2A)
    val textSecondary = Color(0xFF6B6B68)
    val textTertiary = Color(0xFF9C9A92)

    // Garden
    val gardenGreen = Color(0xFFC8E6C9)     // Garden background
    val soil = Color(0xFF8D6E63)            // Stem/ground color
}
```

### Typography

Use **Noto Sans** as the primary font — it has the best multilingual coverage (supports all our target scripts: Latin, Chinese, Devanagari, Gurmukhi, Arabic, Korean, Vietnamese).

```kotlin
// Include Noto Sans from Google Fonts
// Body: 16sp, weight 400
// Heading: 24sp, weight 500
// Large display (affirmations): 32sp, weight 400
// Buttons: 16sp, weight 500
// Small labels: 12sp, weight 400
```

### Design Principles

1. **Large touch targets:** Minimum 56dp, prefer 80dp+ for primary actions
2. **Generous whitespace:** Don't crowd elements. Breathing room = calm.
3. **Soft corners:** 16dp border radius on cards, 24dp on large containers
4. **No harsh borders:** Use subtle elevation/shadow or very light borders
5. **Animations are slow and gentle:** 600ms-1000ms transitions. Nothing fast or jarring.
6. **No red for errors:** Use warm amber for warnings. Red can trigger anxiety.
7. **Icons over text:** Prefer visual communication. Text is secondary.
8. **RTL support:** Arabic and Farsi are right-to-left. Use Compose's `CompositionLocalLayoutDirection` and ensure all layouts flip correctly.

---

## SESSION MANAGEMENT

### SessionManager.kt

```kotlin
// Manages the ephemeral session lifecycle
//
// Session state (in-memory only, NEVER persisted):
// - isActive: Boolean
// - detectedLanguage: String
// - selectedMood: Mood?
// - currentQuadrant: WellnessQuadrant?
// - sessionStartTime: Long
//
// Inactivity timeout:
// - Start a 60-second countdown on every screen except active activities
// - Any touch/voice input resets the countdown
// - When countdown expires: navigate to AmbientGarden, clear all session state
// - During active activities (breathing, grounding, etc.): pause the timeout
//
// Session end actions:
// 1. Clear all in-memory state
// 2. Reset language to default (English)
// 3. Stop any active TTS
// 4. Navigate to AmbientGarden
// 5. The garden screen resumes its ambient animations
```

---

## KIOSK MODE SETUP

For the hackathon demo on Samsung S25+:

```kotlin
// In MainActivity.kt:

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Immersive sticky mode — hides status bar and nav bar
    WindowCompat.setDecorFitsSystemWindows(window, false)
    WindowInsetsControllerCompat(window, window.decorView).let { controller ->
        controller.hide(WindowInsetsCompat.Type.systemBars())
        controller.systemBarsBehavior =
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
    }

    // Keep screen on
    window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
}

// NOTE: For a full production kiosk, you'd use Android's Lock Task Mode (COSU).
// For the hackathon demo, immersive mode + keep screen on is sufficient.
```

---

## BUILD & RUN INSTRUCTIONS

### Prerequisites
- Android Studio (latest stable)
- Samsung S25+ with USB debugging enabled
- API keys in `local.properties`

### build.gradle.kts (app level) — Key dependencies

```kotlin
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("org.jetbrains.kotlin.plugin.serialization")
    id("com.google.devtools.ksp")  // For Room
}

android {
    namespace = "com.bloom.app"
    compileSdk = 35
    
    defaultConfig {
        applicationId = "com.bloom.app"
        minSdk = 28
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
        
        // Read API keys from local.properties
        val properties = java.util.Properties()
        val localPropsFile = rootProject.file("local.properties")
        if (localPropsFile.exists()) {
            properties.load(localPropsFile.inputStream())
        }
        buildConfigField("String", "GROQ_API_KEY", 
            "\"${properties.getProperty("GROQ_API_KEY", "")}\"")
        buildConfigField("String", "GEMINI_API_KEY", 
            "\"${properties.getProperty("GEMINI_API_KEY", "")}\"")  // backup only    }

    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    // Compose BOM
    val composeBom = platform("androidx.compose:compose-bom:2024.12.01")
    implementation(composeBom)
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.navigation:navigation-compose:2.8.5")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")

    // Room
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    ksp("androidx.room:room-compiler:$roomVersion")

    // Networking
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
    
    // Google Fonts (for Noto Sans)
    implementation("androidx.compose.ui:ui-text-google-fonts")
}
```

### AndroidManifest.xml — Key permissions

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.CALL_PHONE" />

<application
    android:name=".BloomApp"
    android:theme="@style/Theme.Bloom"
    android:supportsRtl="true">
    <activity
        android:name=".MainActivity"
        android:exported="true"
        android:screenOrientation="portrait"
        android:configChanges="locale|layoutDirection">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
    </activity>
</application>
```

---

## IMPLEMENTATION ORDER (Build in this sequence)

### Phase 1: Foundation (first 3 hours)
1. Create Android project with above config
2. Set up theme (colors, typography, Noto Sans)
3. Set up navigation graph with all routes
4. Build AmbientGardenScreen with breathing circle animation
5. Build WellnessWheelScreen with 4 quadrant cards
6. Set up Room database with all entities and DAOs
7. Implement SessionManager with inactivity timeout

### Phase 2: Core Activities (hours 3-8)
8. Build BreathingExercise (the single most important activity — visually impressive)
9. Build GroundingExercise (5-4-3-2-1)
10. Build DrawingCanvas (finger painting)
11. Build GratitudePrompt
12. Implement flower bloom animation on activity completion
13. Connect flower creation to Room DB → garden visualization

### Phase 3: Voice & AI (hours 8-13)
14. Implement AudioRecorder (record to WAV)
15. Implement VoiceService (Groq Whisper STT)
16. Implement TTSService (Android TTS)
17. Implement LanguageManager (auto language switching)
18. Implement WellnessAI (Claude API integration)
19. Wire voice to WellnessWheel (speak → AI routes to quadrant)
20. Build ThoughtReframe with AI
21. Build AffirmationScreen with AI

### Phase 4: Data & Connect (hours 13-17)
22. Parse BC211 data into JSON, load into ResourceRepository
23. Build ResourceFinderScreen
24. Build GratitudeWall (read/write anonymous messages)
25. Build community mood indicator
26. Parse shelter data, load into app
27. Build StaffDashboard with aggregate stats

### Phase 5: Polish (hours 17-22)
28. Add all multilingual string translations
29. RTL layout support for Arabic/Farsi
30. Smooth all animations (garden, breathing, transitions)
31. Test on Samsung S25+
32. Add ambient mode time-of-day color shifting
33. Add remaining activities (TensionRelease, MovementSnack, MemorySpark)
34. Demo mode for pitch

### Phase 6: Ship (hours 22-24)
35. Final testing on device
36. Record demo video
37. Write README.md
38. Push to GitHub (must be created after Apr 4th 12pm)
39. Practice 4-minute pitch

---

## CRITICAL REMINDERS

1. **NEVER store personal data.** No names, no IDs, no session content. Only anonymous flowers, anonymous gratitude messages, and aggregate stats.

2. **Every interaction must work in 2-5 minutes.** If an activity takes longer, it's too long. Cut it.

3. **Voice is the primary input, touch is the fallback.** But touch must work perfectly on its own for users who don't want to speak aloud in a shared space.

4. **The garden is the heart of the app.** Make it beautiful. Make it grow. Make it the first and last thing anyone sees.

5. **Invitational language everywhere.** Check every string, every AI prompt, every button label. "You might..." not "You should..."

6. **Test with RTL.** Arabic and Farsi users will see a mirrored layout. Make sure it works.

7. **Offline degradation:** If no internet → voice still works (Android STT fallback in English), AI features show pre-written responses, resource finder still works (local JSON), garden still grows.

8. **The flower bloom animation after each activity is the reward moment.** Make it delightful. A small celebration. Not flashy — gentle, beautiful, like a real flower opening.

---

## README.md TEMPLATE (for GitHub submission)

```markdown
# 🌸 Bloom — Wellness Kiosk for Women's Shelters

> A voice-first, multilingual, zero-login wellness app that transforms a shared 
> shelter tablet into a healing garden.

## The Problem
68% of women entering shelters meet criteria for clinical depression. They know
what supports their wellbeing — the barrier is structural: no private space, no
personal device, no time, no tool designed for their reality.

**No wellness tool exists for shared shelter devices. Bloom is the first.**

## What Bloom Does
A tablet sits in a shelter common area. Women tap "Begin," choose a wellness
quadrant (Mind, Body, Soul, or Connect), and complete a 2–5 minute guided
activity — in any language, with no account, no data stored. Each activity
grows a flower in a shared digital garden, making collective healing visible.

## Features
- **Wellness Wheel**: 4 quadrants with 12+ micro-activities
- **Voice-First**: Auto-detects language from speech (12 languages)
- **AI-Powered**: Claude provides personalized, trauma-informed guidance
- **Zero Login**: No accounts, no personal data, ephemeral sessions
- **Shared Garden**: Collective visualization of community wellness
- **Staff Dashboard**: Anonymous aggregate insights for shelter staff
- **BC211 Integration**: Surfaces nearest community resources
- **Offline-First**: Core features work without internet

## Tech Stack
- Kotlin + Jetpack Compose + Material 3
- Groq API — Llama 3.3 70B (AI wellness guidance, blazing fast)
- Groq API — Whisper Large V3 (multilingual speech-to-text)
- Android TextToSpeech (12-language voice output)
- Room Database (anonymous aggregates only)
- CWI datasets: BC211 resources, shelter locations, synthetic profiles

## Design Constraints Addressed
- ✅ No personal smartphone required — runs on shared device
- ✅ Multilingual + low-literacy accessible (voice + icons first)
- ✅ No account creation, no sensitive data
- ✅ Minimal onboarding (tap "Begin" and go)
- ✅ Privacy as physical constraint (ephemeral sessions, auto-wipe)
- ✅ Staff included (dashboard with aggregate trends)
- ✅ Holistic (Mind + Body + Soul + Connect)

## Built for
Community Women's Initiative (CWI) × youCode 2025

## Team
[Your names here]
```