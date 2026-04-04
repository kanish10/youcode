package com.bloom.app.data.db

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "flowers")
data class FlowerEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val quadrant: String,      // "MIND", "BODY", "SOUL", "CONNECT"
    val timestamp: Long,
    val colorHex: String
)

@Entity(tableName = "gratitude_messages")
data class GratitudeEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val message: String,
    val timestamp: Long,
    val language: String
)

@Entity(tableName = "session_stats")
data class SessionStatEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val timestamp: Long,
    val quadrant: String,
    val activityType: String,
    val durationSeconds: Int,
    val language: String,
    val mood: String?,
    val hourOfDay: Int
)
