package com.bloom.app.service

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import com.bloom.app.BuildConfig
import com.bloom.app.util.AudioRecorder
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.Locale
import java.util.concurrent.TimeUnit
import kotlin.coroutines.suspendCoroutine
import kotlin.coroutines.resume

data class TranscriptionResult(
    val text: String,
    val language: String
)

class VoiceService(private val context: Context) {

    private val audioRecorder = AudioRecorder(context)
    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .build()

    var isRecording = false
        private set

    suspend fun transcribeWithGroq(audioData: ByteArray, currentLanguage: String = "en"): TranscriptionResult? {
        return withContext(Dispatchers.IO) {
            try {
                val requestBody = MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart(
                        "file", "audio.wav",
                        audioData.toRequestBody("audio/wav".toMediaType())
                    )
                    .addFormDataPart("model", "whisper-large-v3")
                    .addFormDataPart("response_format", "verbose_json")
                    .build()

                val request = Request.Builder()
                    .url("https://api.groq.com/openai/v1/audio/transcriptions")
                    .header("Authorization", "Bearer ${BuildConfig.GROQ_API_KEY}")
                    .post(requestBody)
                    .build()

                val response = client.newCall(request).execute()
                if (response.isSuccessful) {
                    val body = response.body?.string() ?: return@withContext null
                    val json = JSONObject(body)
                    val text = json.optString("text", "")
                    val language = json.optString("language", currentLanguage)
                    TranscriptionResult(text, language)
                } else {
                    null
                }
            } catch (e: Exception) {
                null
            }
        }
    }

    suspend fun recordAndTranscribe(
        currentLanguage: String = "en",
        durationMs: Long = 8_000
    ): TranscriptionResult? {
        if (!audioRecorder.hasPermission()) return null
        isRecording = true
        val audioData = try {
            audioRecorder.recordAudio(durationMs)
        } finally {
            isRecording = false
        }
        return transcribeWithGroq(audioData, currentLanguage)
            ?: transcribeWithAndroid(currentLanguage)
    }

    private suspend fun transcribeWithAndroid(language: String): TranscriptionResult? {
        return suspendCoroutine { cont ->
            val speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context)
            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, language)
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, language)
                putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
            }
            speechRecognizer.setRecognitionListener(object : RecognitionListener {
                override fun onResults(results: Bundle?) {
                    val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    val text = matches?.firstOrNull() ?: ""
                    speechRecognizer.destroy()
                    cont.resume(if (text.isNotBlank()) TranscriptionResult(text, language) else null)
                }
                override fun onError(error: Int) {
                    speechRecognizer.destroy()
                    cont.resume(null)
                }
                override fun onReadyForSpeech(params: Bundle?) {}
                override fun onBeginningOfSpeech() {}
                override fun onRmsChanged(rmsdB: Float) {}
                override fun onBufferReceived(buffer: ByteArray?) {}
                override fun onEndOfSpeech() {}
                override fun onPartialResults(partialResults: Bundle?) {}
                override fun onEvent(eventType: Int, params: Bundle?) {}
            })
            speechRecognizer.startListening(intent)
        }
    }

    fun stopRecording() {
        audioRecorder.stopRecording()
        isRecording = false
    }
}
