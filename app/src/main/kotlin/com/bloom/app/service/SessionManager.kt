package com.bloom.app.service

import com.bloom.app.data.models.Mood
import com.bloom.app.data.models.SessionState
import com.bloom.app.data.models.WellnessQuadrant
import com.bloom.app.util.Constants
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class SessionManager(
    private val languageManager: LanguageManager,
    private val ttsService: TTSService
) {

    private val _sessionState = MutableStateFlow(SessionState())
    val sessionState: StateFlow<SessionState> = _sessionState.asStateFlow()

    private val _shouldNavigateToGarden = MutableStateFlow(false)
    val shouldNavigateToGarden: StateFlow<Boolean> = _shouldNavigateToGarden.asStateFlow()

    private var inactivityJob: Job? = null
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    private var isActivityActive = false

    fun startSession() {
        _sessionState.value = SessionState(
            isActive = true,
            sessionStartTime = System.currentTimeMillis()
        )
        resetInactivityTimer()
    }

    fun endSession() {
        inactivityJob?.cancel()
        _sessionState.value = SessionState()
        languageManager.resetToDefault()
        ttsService.stop()
    }

    fun resetInactivityTimer() {
        if (isActivityActive) return
        inactivityJob?.cancel()
        inactivityJob = scope.launch {
            delay(Constants.INACTIVITY_TIMEOUT_MS)
            triggerInactivityTimeout()
        }
    }

    fun pauseInactivityTimer() {
        isActivityActive = true
        inactivityJob?.cancel()
    }

    fun resumeInactivityTimer() {
        isActivityActive = false
        resetInactivityTimer()
    }

    fun onUserInteraction() {
        if (!isActivityActive) resetInactivityTimer()
    }

    fun updateMood(mood: Mood) {
        _sessionState.value = _sessionState.value.copy(selectedMood = mood)
    }

    fun updateQuadrant(quadrant: WellnessQuadrant) {
        _sessionState.value = _sessionState.value.copy(currentQuadrant = quadrant)
    }

    fun updateLanguage(code: String) {
        _sessionState.value = _sessionState.value.copy(detectedLanguage = code)
        languageManager.updateLanguage(code)
    }

    fun clearNavigationFlag() {
        _shouldNavigateToGarden.value = false
    }

    private fun triggerInactivityTimeout() {
        endSession()
        _shouldNavigateToGarden.value = true
    }

    fun destroy() {
        scope.cancel()
    }
}
