package com.bloom.app.service

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody

class SupabaseClient(
    private val url: String,
    private val key: String
) {
    private val http = OkHttpClient()
    private val json = Json { ignoreUnknownKeys = true; encodeDefaults = true }
    private val jsonMedia = "application/json".toMediaType()

    val isConfigured: Boolean get() = url.isNotBlank() && key.isNotBlank()

    private var accessToken: String? = null
    private var userId: String? = null

    val currentUserId: String? get() = userId

    suspend fun signUp(email: String, password: String): AuthResult = withContext(Dispatchers.IO) {
        val body = json.encodeToString(AuthBody(email, password))
        val req = Request.Builder()
            .url("$url/auth/v1/signup")
            .post(body.toRequestBody(jsonMedia))
            .addHeader("apikey", key)
            .addHeader("Content-Type", "application/json")
            .build()
        val resp = http.newCall(req).execute()
        val respBody = resp.body?.string() ?: ""
        if (!resp.isSuccessful) return@withContext AuthResult(false, error = extractError(respBody))
        val parsed = json.decodeFromString<AuthResponse>(respBody)
        accessToken = parsed.access_token
        userId = parsed.user?.id
        AuthResult(true, userId = parsed.user?.id)
    }

    suspend fun signIn(email: String, password: String): AuthResult = withContext(Dispatchers.IO) {
        val body = json.encodeToString(AuthBody(email, password))
        val req = Request.Builder()
            .url("$url/auth/v1/token?grant_type=password")
            .post(body.toRequestBody(jsonMedia))
            .addHeader("apikey", key)
            .addHeader("Content-Type", "application/json")
            .build()
        val resp = http.newCall(req).execute()
        val respBody = resp.body?.string() ?: ""
        if (!resp.isSuccessful) return@withContext AuthResult(false, error = extractError(respBody))
        val parsed = json.decodeFromString<AuthResponse>(respBody)
        accessToken = parsed.access_token
        userId = parsed.user?.id
        AuthResult(true, userId = parsed.user?.id)
    }

    fun signOut() {
        accessToken = null
        userId = null
    }

    val isLoggedIn: Boolean get() = accessToken != null && userId != null

    suspend fun logActivity(
        quadrant: String,
        activityType: String,
        durationSeconds: Int,
        completed: Boolean,
        sessionId: String? = null
    ): Boolean = withContext(Dispatchers.IO) {
        if (!isConfigured || !isLoggedIn) return@withContext false
        val payload = json.encodeToString(ActivityPayload(
            user_id = userId!!,
            session_id = sessionId,
            quadrant = quadrant,
            activity_type = activityType,
            duration_seconds = durationSeconds,
            completed = completed
        ))
        post("activity_logs", payload)
    }

    suspend fun addFlower(quadrant: String, colorHex: String): Boolean = withContext(Dispatchers.IO) {
        if (!isConfigured || !isLoggedIn) return@withContext false
        val payload = json.encodeToString(FlowerPayload(
            user_id = userId!!,
            quadrant = quadrant,
            color_hex = colorHex
        ))
        post("flowers", payload)
    }

    suspend fun startSession(mood: String?, language: String): String? = withContext(Dispatchers.IO) {
        if (!isConfigured || !isLoggedIn) return@withContext null
        val payload = json.encodeToString(SessionPayload(
            user_id = userId!!,
            mood = mood,
            language = language
        ))
        val body = postRaw("sessions", payload) ?: return@withContext null
        try {
            val rows = json.decodeFromString<List<SessionResponse>>(body)
            rows.firstOrNull()?.id
        } catch (_: Exception) { null }
    }

    private fun post(table: String, jsonBody: String): Boolean {
        val req = Request.Builder()
            .url("$url/rest/v1/$table")
            .post(jsonBody.toRequestBody(jsonMedia))
            .addHeader("apikey", key)
            .addHeader("Authorization", "Bearer ${accessToken ?: key}")
            .addHeader("Content-Type", "application/json")
            .addHeader("Prefer", "return=minimal")
            .build()
        return http.newCall(req).execute().isSuccessful
    }

    private fun postRaw(table: String, jsonBody: String): String? {
        val req = Request.Builder()
            .url("$url/rest/v1/$table")
            .post(jsonBody.toRequestBody(jsonMedia))
            .addHeader("apikey", key)
            .addHeader("Authorization", "Bearer ${accessToken ?: key}")
            .addHeader("Content-Type", "application/json")
            .addHeader("Prefer", "return=representation")
            .build()
        val resp = http.newCall(req).execute()
        return if (resp.isSuccessful) resp.body?.string() else null
    }

    private fun extractError(body: String): String {
        return try {
            val err = json.decodeFromString<ErrorBody>(body)
            err.msg ?: err.error_description ?: err.message ?: "Unknown error"
        } catch (_: Exception) { body.take(200) }
    }

    @Serializable data class AuthBody(val email: String, val password: String)
    @Serializable data class AuthUser(val id: String? = null)
    @Serializable data class AuthResponse(val access_token: String? = null, val user: AuthUser? = null)
    @Serializable data class ErrorBody(
        val msg: String? = null,
        val error_description: String? = null,
        val message: String? = null
    )
    @Serializable data class ActivityPayload(
        val user_id: String,
        val session_id: String? = null,
        val quadrant: String,
        val activity_type: String,
        val duration_seconds: Int,
        val completed: Boolean
    )
    @Serializable data class FlowerPayload(
        val user_id: String,
        val quadrant: String,
        val color_hex: String
    )
    @Serializable data class SessionPayload(
        val user_id: String,
        val mood: String? = null,
        val language: String
    )
    @Serializable data class SessionResponse(val id: String)
    data class AuthResult(val success: Boolean, val userId: String? = null, val error: String? = null)
}
