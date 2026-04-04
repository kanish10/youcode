package com.bloom.app.util

object Constants {
    // Session
    const val INACTIVITY_TIMEOUT_MS = 60_000L
    const val STAFF_PIN = "1234"

    // Groq API
    const val GROQ_BASE_URL = "https://api.groq.com/openai/v1/"
    const val GROQ_CHAT_MODEL = "llama-3.3-70b-versatile"
    const val GROQ_WHISPER_MODEL = "whisper-large-v3"
    const val GROQ_AUDIO_TRANSCRIPTION_URL = "https://api.groq.com/openai/v1/audio/transcriptions"
    const val GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"

    // Gemini Fallback
    const val GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

    // Audio recording
    const val AUDIO_SAMPLE_RATE = 16000
    const val AUDIO_CHANNEL_CONFIG = android.media.AudioFormat.CHANNEL_IN_MONO
    const val AUDIO_ENCODING = android.media.AudioFormat.ENCODING_PCM_16BIT

    // Supported language codes (ISO 639-1)
    val SUPPORTED_LANGUAGES = listOf("en", "zh", "yue", "pa", "tl", "ko", "fa", "ar", "es", "vi", "hi", "fr")

    // AI prompts
    val BLOOM_SYSTEM_PROMPT = """
You are Bloom, a gentle wellness companion integrated into a tablet
at a women's shelter. You speak with warmth, care, and respect.

CONTEXT:
- The woman you're speaking with may be fleeing domestic violence,
  experiencing homelessness, or facing other crises
- She is using a SHARED device in a COMMON AREA — others may see the screen
- She may have children with her
- Privacy and safety are paramount

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
}
