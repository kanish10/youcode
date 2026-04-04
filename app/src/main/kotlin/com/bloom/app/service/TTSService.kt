package com.bloom.app.service

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import kotlinx.coroutines.suspendCancellableCoroutine
import java.util.Locale
import kotlin.coroutines.resume

class TTSService(context: Context) {

    private var tts: TextToSpeech? = null
    private var isReady = false

    init {
        tts = TextToSpeech(context) { status ->
            if (status == TextToSpeech.SUCCESS) {
                isReady = true
                tts?.setLanguage(Locale.ENGLISH)
                tts?.setSpeechRate(0.9f)
                tts?.setPitch(1.0f)
            }
        }
    }

    fun setLanguage(locale: Locale) {
        if (!isReady) return
        val result = tts?.isLanguageAvailable(locale)
        if (result == TextToSpeech.LANG_AVAILABLE ||
            result == TextToSpeech.LANG_COUNTRY_AVAILABLE ||
            result == TextToSpeech.LANG_COUNTRY_VAR_AVAILABLE) {
            tts?.setLanguage(locale)
        } else {
            // Fallback: try without region
            val fallback = Locale(locale.language)
            val fallbackResult = tts?.isLanguageAvailable(fallback)
            if (fallbackResult != TextToSpeech.LANG_MISSING_DATA &&
                fallbackResult != TextToSpeech.LANG_NOT_SUPPORTED) {
                tts?.setLanguage(fallback)
            } else {
                tts?.setLanguage(Locale.ENGLISH)
            }
        }
    }

    fun speak(text: String, utteranceId: String = "bloom_tts_${System.currentTimeMillis()}") {
        if (!isReady) return
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
    }

    fun speakQueued(text: String, utteranceId: String = "bloom_tts_${System.currentTimeMillis()}") {
        if (!isReady) return
        tts?.speak(text, TextToSpeech.QUEUE_ADD, null, utteranceId)
    }

    fun stop() {
        tts?.stop()
    }

    fun isSpeaking(): Boolean = tts?.isSpeaking ?: false

    suspend fun speakAndWait(text: String): Unit = suspendCancellableCoroutine { cont ->
        val utteranceId = "bloom_wait_${System.currentTimeMillis()}"
        tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onStart(utteranceId: String?) {}
            override fun onDone(id: String?) {
                if (id == utteranceId && cont.isActive) cont.resume(Unit)
            }
            override fun onError(utteranceId: String?) {
                if (cont.isActive) cont.resume(Unit)
            }
        })
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
        cont.invokeOnCancellation { tts?.stop() }
    }

    fun shutdown() {
        tts?.stop()
        tts?.shutdown()
        tts = null
    }
}
