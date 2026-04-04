package com.bloom.app.data.models

data class SessionState(
    val isActive: Boolean = false,
    val detectedLanguage: String = "en",
    val selectedMood: Mood? = null,
    val currentQuadrant: WellnessQuadrant? = null,
    val sessionStartTime: Long = 0L
)
