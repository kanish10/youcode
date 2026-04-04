package com.bloom.app.service

import android.content.Context
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.os.LocaleListCompat
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.Locale

class LanguageManager(private val context: Context) {

    private val _currentLanguage = MutableStateFlow("en")
    val currentLanguage: StateFlow<String> = _currentLanguage.asStateFlow()

    private val ttsService = TTSService(context)

    fun updateLanguage(languageCode: String) {
        val normalizedCode = normalizeLanguageCode(languageCode)
        if (normalizedCode == _currentLanguage.value) return
        _currentLanguage.value = normalizedCode
        ttsService.setLanguage(getLocale(normalizedCode))
    }

    fun resetToDefault() {
        _currentLanguage.value = "en"
        ttsService.setLanguage(Locale.ENGLISH)
    }

    fun getLocale(code: String = _currentLanguage.value): Locale {
        return when (code) {
            "en" -> Locale.ENGLISH
            "zh", "zh-cn", "zh-hans" -> Locale.SIMPLIFIED_CHINESE
            "yue", "zh-tw", "zh-hant" -> Locale.TRADITIONAL_CHINESE
            "pa" -> Locale("pa", "IN")
            "tl" -> Locale("tl", "PH")
            "ja" -> Locale.JAPANESE
            "ko" -> Locale.KOREAN
            "fa" -> Locale("fa", "IR")
            "ar" -> Locale("ar")
            "es" -> Locale("es")
            "vi" -> Locale("vi", "VN")
            "hi" -> Locale.forLanguageTag("hi-IN")
            "fr" -> Locale.FRENCH
            else -> Locale.ENGLISH
        }
    }

    fun getDisplayName(code: String = _currentLanguage.value): String {
        return when (code) {
            "en" -> "EN"
            "zh", "zh-cn", "zh-hans" -> "中文"
            "yue", "zh-tw", "zh-hant" -> "粵語"
            "pa" -> "ਪੰਜਾਬੀ"
            "tl" -> "Filipino"
            "ja" -> "日本語"
            "ko" -> "한국어"
            "fa" -> "فارسی"
            "ar" -> "عربي"
            "es" -> "Español"
            "vi" -> "Tiếng Việt"
            "hi" -> "हिन्दी"
            "fr" -> "Français"
            else -> "EN"
        }
    }

    fun getLanguageName(code: String): String {
        return when (code) {
            "en" -> "English"
            "zh", "zh-cn", "zh-hans" -> "Mandarin (普通话)"
            "yue", "zh-tw", "zh-hant" -> "Cantonese (廣東話)"
            "pa" -> "Punjabi (ਪੰਜਾਬੀ)"
            "tl" -> "Tagalog / Filipino"
            "ja" -> "Japanese (日本語)"
            "ko" -> "Korean (한국어)"
            "fa" -> "Farsi / Persian (فارسی)"
            "ar" -> "Arabic (عربي)"
            "es" -> "Spanish (Español)"
            "vi" -> "Vietnamese (Tiếng Việt)"
            "hi" -> "Hindi (हिन्दी)"
            "fr" -> "French (Français)"
            else -> "English"
        }
    }

    fun isRTL(code: String = _currentLanguage.value): Boolean {
        return code in listOf("ar", "fa", "he", "ur")
    }

    fun isCJK(code: String = _currentLanguage.value): Boolean {
        return code in listOf("zh", "yue", "ja", "ko")
    }

    val supportedLanguages = listOf(
        "en", "zh", "yue", "pa", "tl", "ja", "ko", "fa", "ar", "es", "vi", "hi", "fr"
    )

    private fun normalizeLanguageCode(code: String): String {
        return when (code.lowercase().trim()) {
            "zh", "zh-cn", "zh-hans", "cmn" -> "zh"
            "yue", "zh-tw", "zh-hant", "zh-yue" -> "yue"
            "pa", "pun" -> "pa"
            "tl", "fil" -> "tl"
            "ja", "jpn" -> "ja"
            "ko" -> "ko"
            "fa", "per" -> "fa"
            "ar" -> "ar"
            "es" -> "es"
            "vi" -> "vi"
            "hi" -> "hi"
            "fr" -> "fr"
            else -> "en"
        }
    }

    fun getTTSService(): TTSService = ttsService

    fun shutdown() {
        ttsService.shutdown()
    }
}
