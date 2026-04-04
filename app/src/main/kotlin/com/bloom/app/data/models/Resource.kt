package com.bloom.app.data.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Resource(
    val category: String,
    val name: String,
    val phone: String = "",
    val address: String = "",
    val city: String = "",
    val hours: String = "",
    val languages: List<String> = listOf("en"),
    val description: String = ""
)

enum class ResourceCategory(val key: String, val displayName: String, val emoji: String) {
    MENTAL_HEALTH("mental_health", "Mental Health", "🧠"),
    FOOD("food", "Food", "🍽️"),
    CLOTHING("clothing", "Clothing", "👗"),
    COUNSELLING("counselling", "Counselling", "💬"),
    RECREATION("recreation", "Recreation", "🌿"),
    INDIGENOUS("indigenous", "Indigenous Services", "🪶"),
    LGBTQ("lgbtq", "LGBTQ+", "🏳️‍🌈"),
    DISABILITY("disability", "Disability", "♿"),
    IMMIGRANT_REFUGEE("immigrant_refugee", "Immigrant & Refugee", "🌍"),
    VICTIM_SERVICES("victim_services", "Victim Services", "🛡️"),
    ADDICTION("addiction", "Addiction Support", "💙"),
    EMERGENCY_CRISIS("emergency_crisis", "Emergency & Crisis", "🆘")
}
