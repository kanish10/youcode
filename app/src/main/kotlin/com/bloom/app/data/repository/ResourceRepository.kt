package com.bloom.app.data.repository

import android.content.Context
import com.bloom.app.data.models.Resource
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json

class ResourceRepository(private val context: Context) {

    private val json = Json { ignoreUnknownKeys = true }
    private var cachedResources: List<Resource>? = null

    suspend fun getResources(): List<Resource> = withContext(Dispatchers.IO) {
        cachedResources ?: loadResources().also { cachedResources = it }
    }

    suspend fun getResourcesByCategory(category: String): List<Resource> {
        return getResources().filter { it.category == category }
    }

    private fun loadResources(): List<Resource> {
        return try {
            val inputStream = context.assets.open("bc211_resources.json")
            val jsonString = inputStream.bufferedReader().use { it.readText() }
            json.decodeFromString<List<Resource>>(jsonString)
        } catch (e: Exception) {
            emptyList()
        }
    }
}
