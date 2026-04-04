package com.bloom.app.data.db

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface StatsDao {
    @Insert
    suspend fun insertStat(stat: SessionStatEntity): Long

    @Query("SELECT COUNT(*) FROM session_stats WHERE timestamp >= :since")
    suspend fun getSessionCountSince(since: Long): Int

    @Query("SELECT * FROM session_stats WHERE timestamp >= :since ORDER BY timestamp DESC")
    suspend fun getStatsSince(since: Long): List<SessionStatEntity>

    @Query("SELECT quadrant, COUNT(*) as count FROM session_stats GROUP BY quadrant")
    suspend fun getQuadrantBreakdown(): List<QuadrantCount>

    @Query("SELECT language, COUNT(*) as count FROM session_stats WHERE timestamp >= :since GROUP BY language")
    suspend fun getLanguageDistribution(since: Long): List<LanguageCount>

    @Query("SELECT hourOfDay, COUNT(*) as count FROM session_stats GROUP BY hourOfDay ORDER BY hourOfDay")
    suspend fun getSessionsByHour(): List<HourCount>

    @Query("SELECT mood, COUNT(*) as count FROM session_stats WHERE mood IS NOT NULL AND timestamp >= :since GROUP BY mood")
    suspend fun getMoodDistribution(since: Long): List<MoodCount>
}

data class QuadrantCount(val quadrant: String, val count: Int)
data class LanguageCount(val language: String, val count: Int)
data class HourCount(val hourOfDay: Int, val count: Int)
data class MoodCount(val mood: String, val count: Int)
