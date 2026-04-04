package com.bloom.app.data.repository

import com.bloom.app.data.db.BloomDatabase
import com.bloom.app.data.db.SessionStatEntity
import java.util.Calendar

class StatsRepository(private val db: BloomDatabase) {

    suspend fun recordSession(
        quadrant: String,
        activityType: String,
        durationSeconds: Int,
        language: String,
        mood: String?
    ) {
        val now = System.currentTimeMillis()
        val hourOfDay = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
        db.statsDao().insertStat(
            SessionStatEntity(
                timestamp = now,
                quadrant = quadrant,
                activityType = activityType,
                durationSeconds = durationSeconds,
                language = language,
                mood = mood,
                hourOfDay = hourOfDay
            )
        )
    }

    suspend fun getTodaySessionCount(): Int {
        val startOfDay = getStartOfDay()
        return db.statsDao().getSessionCountSince(startOfDay)
    }

    suspend fun getWeeklyStats(): List<Int> {
        // Returns session counts for last 7 days (oldest first)
        val result = mutableListOf<Int>()
        for (daysAgo in 6 downTo 0) {
            val start = getStartOfDay(daysAgo)
            val end = if (daysAgo == 0) Long.MAX_VALUE else getStartOfDay(daysAgo - 1)
            val stats = db.statsDao().getStatsSince(start).filter { it.timestamp < end }
            result.add(stats.size)
        }
        return result
    }

    suspend fun getQuadrantBreakdown() = db.statsDao().getQuadrantBreakdown()

    suspend fun getLanguageDistribution(): Map<String, Int> {
        val weekAgo = System.currentTimeMillis() - 7 * 24 * 60 * 60 * 1000L
        return db.statsDao().getLanguageDistribution(weekAgo)
            .associate { it.language to it.count }
    }

    suspend fun getSessionsByHour() = db.statsDao().getSessionsByHour()

    suspend fun getMoodDistribution(): Map<String, Int> {
        val weekAgo = System.currentTimeMillis() - 7 * 24 * 60 * 60 * 1000L
        return db.statsDao().getMoodDistribution(weekAgo)
            .associate { it.mood to it.count }
    }

    private fun getStartOfDay(daysAgo: Int = 0): Long {
        val cal = Calendar.getInstance()
        cal.set(Calendar.HOUR_OF_DAY, 0)
        cal.set(Calendar.MINUTE, 0)
        cal.set(Calendar.SECOND, 0)
        cal.set(Calendar.MILLISECOND, 0)
        cal.add(Calendar.DAY_OF_YEAR, -daysAgo)
        return cal.timeInMillis
    }
}
