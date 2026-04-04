package com.bloom.app.data.models

data class Flower(
    val id: Long,
    val quadrant: WellnessQuadrant,
    val timestamp: Long,
    val colorHex: String,
    val x: Float = 0f,
    val y: Float = 0f
)
