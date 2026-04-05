package com.bloom.app.service

import com.bloom.app.BuildConfig
import com.bloom.app.util.Constants
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class WellnessAI {

    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .build()

    suspend fun getGroqResponse(
        userMessage: String,
        language: String = "en",
        additionalContext: String = ""
    ): String? = withContext(Dispatchers.IO) {
        try {
            val systemPrompt = buildSystemPrompt(language, additionalContext)
            val requestBody = buildGroqRequest(systemPrompt, userMessage)

            val request = Request.Builder()
                .url(Constants.GROQ_CHAT_URL)
                .header("Authorization", "Bearer ${BuildConfig.GROQ_API_KEY}")
                .header("Content-Type", "application/json")
                .post(requestBody.toRequestBody("application/json".toMediaType()))
                .build()

            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: return@withContext null
                parseGroqResponse(body)
            } else {
                // Try Gemini fallback
                getGeminiResponse(userMessage, language)
            }
        } catch (e: Exception) {
            getGeminiResponse(userMessage, language)
        }
    }

    private fun buildSystemPrompt(language: String, additionalContext: String): String {
        val languageName = getLanguageName(language)
        return """
${Constants.BLOOM_SYSTEM_PROMPT}

LANGUAGE: You MUST respond ONLY in $languageName using its native writing system and characters.
Never romanize, transliterate, or use Latin alphabet for non-Latin languages.
If the language is English, respond in simple, clear English.

$additionalContext
        """.trimIndent()
    }

    private fun buildGroqRequest(systemPrompt: String, userMessage: String): String {
        val messages = JSONArray().apply {
            put(JSONObject().apply {
                put("role", "system")
                put("content", systemPrompt)
            })
            put(JSONObject().apply {
                put("role", "user")
                put("content", userMessage)
            })
        }
        return JSONObject().apply {
            put("model", Constants.GROQ_CHAT_MODEL)
            put("messages", messages)
            put("temperature", 0.7)
            put("max_tokens", 200)
            put("stream", false)
        }.toString()
    }

    private fun parseGroqResponse(body: String): String? {
        return try {
            val json = JSONObject(body)
            val choices = json.getJSONArray("choices")
            val firstChoice = choices.getJSONObject(0)
            val message = firstChoice.getJSONObject("message")
            message.getString("content").trim()
        } catch (e: Exception) {
            null
        }
    }

    private suspend fun getGeminiResponse(userMessage: String, language: String): String? = withContext(Dispatchers.IO) {
        if (BuildConfig.GEMINI_API_KEY.isBlank()) return@withContext getFallbackResponse(language)
        try {
            val languageName = getLanguageName(language)
            val prompt = "${Constants.BLOOM_SYSTEM_PROMPT}\n\nRespond in $languageName only.\n\nUser: $userMessage"
            val requestBody = JSONObject().apply {
                put("contents", JSONArray().apply {
                    put(JSONObject().apply {
                        put("parts", JSONArray().apply {
                            put(JSONObject().apply { put("text", prompt) })
                        })
                    })
                })
                put("generationConfig", JSONObject().apply {
                    put("temperature", 0.7)
                    put("maxOutputTokens", 200)
                })
            }.toString()

            val request = Request.Builder()
                .url("${Constants.GEMINI_BASE_URL}?key=${BuildConfig.GEMINI_API_KEY}")
                .header("Content-Type", "application/json")
                .post(requestBody.toRequestBody("application/json".toMediaType()))
                .build()

            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: return@withContext null
                val json = JSONObject(body)
                json.getJSONArray("candidates")
                    .getJSONObject(0)
                    .getJSONObject("content")
                    .getJSONArray("parts")
                    .getJSONObject(0)
                    .getString("text")
                    .trim()
            } else null
        } catch (e: Exception) {
            getFallbackResponse(language)
        }
    }

    fun getFallback(language: String): String = getFallbackResponse(language)

    private fun getFallbackResponse(language: String): String {
        return when (language) {
            "zh" -> "您分享的感受很重要。请深呼吸，照顾好自己。"
            "ar" -> "مشاعرك مهمة. خذي نفساً عميقاً واعتني بنفسك."
            "es" -> "Lo que sientes es importante. Respira profundo y cuídate."
            "fr" -> "Ce que vous ressentez est important. Respirez profondément."
            "hi" -> "आपकी भावनाएं महत्वपूर्ण हैं। गहरी सांस लें।"
            else -> "What you're feeling matters. You might take a gentle breath and be kind to yourself."
        }
    }

    // Activity-specific prompt builders
    fun buildThoughtReframeMessage(userInput: String): String {
        return "A woman has shared this difficult thought: '$userInput'. Help her gently reframe it with validation first, then a compassionate alternative perspective, then a small suggestion. Keep under 60 words."
    }

    fun buildGratitudeResponseMessage(userInput: String): String {
        return "A woman in a shelter shared what was okay today: '$userInput'. Respond with genuine warmth in 1-2 sentences. Reflect back what she said with care. End with brief encouragement. Keep under 40 words."
    }

    fun buildAffirmationMessage(): String {
        return "Generate one culturally thoughtful affirmation for a woman who needs strength today. Just the affirmation itself, nothing else. Make it beautiful, empowering, and under 20 words."
    }

    fun buildMemorySparkMessage(userInput: String): String {
        return "A woman shared this memory that makes her smile: '$userInput'. Respond with warmth and help her reconnect with this part of herself. Keep under 50 words."
    }

    fun buildVoiceRoutingMessage(userInput: String, mood: String?): String {
        val moodContext = if (mood != null) " She selected the mood: $mood." else ""
        return "A woman said: '$userInput'.$moodContext Respond helpfully and gently suggest one relevant wellness activity from: breathing, grounding, stretching, drawing, gratitude. Keep under 50 words."
    }

    fun buildWorryReleaseMessage(userInput: String): String {
        return "A woman shared this worry with you: '$userInput'. Respond with deep compassion and validation. Do NOT offer solutions. Just acknowledge, validate, and offer one gentle comforting thought. Keep under 50 words."
    }

    private fun getLanguageName(code: String): String {
        return when (code) {
            "en" -> "English"
            "zh" -> "Mandarin Chinese (simplified)"
            "yue" -> "Cantonese Chinese (traditional)"
            "pa" -> "Punjabi"
            "tl" -> "Tagalog"
            "ko" -> "Korean"
            "fa" -> "Farsi (Persian)"
            "ar" -> "Arabic"
            "es" -> "Spanish"
            "vi" -> "Vietnamese"
            "hi" -> "Hindi"
            "fr" -> "French"
            else -> "English"
        }
    }
}
