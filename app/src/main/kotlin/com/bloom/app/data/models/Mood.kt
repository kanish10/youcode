package com.bloom.app.data.models

enum class Mood(val emoji: String, val label: String, val aiContext: String) {
    VERY_SAD("😔", "sad", "feeling very sad or hopeless"),
    ANXIOUS("😰", "anxious", "feeling anxious or worried"),
    ANGRY("😤", "angry", "feeling frustrated or angry"),
    NEUTRAL("😐", "okay", "feeling neutral or okay"),
    CONTENT("😊", "okay", "feeling calm or content")
}
