package com.bloom.app.data.models

import kotlinx.serialization.Serializable

@Serializable
data class Shelter(
    val name: String,
    val city: String = "",
    val organization: String = "",
    val phone: String = "",
    val type: String = "",
    val latitude: Double? = null,
    val longitude: Double? = null
)
