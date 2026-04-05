package com.bloom.app.data.models

data class Whisper(
    val id: String = "",
    val content: String,
    val resonanceCount: Int = 0,
    val heartCount: Int = 0,
    val timeAgo: String = "just now",
    val isLocal: Boolean = false
)
