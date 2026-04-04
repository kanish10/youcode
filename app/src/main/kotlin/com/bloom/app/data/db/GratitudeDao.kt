package com.bloom.app.data.db

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface GratitudeDao {
    @Query("SELECT * FROM gratitude_messages ORDER BY timestamp DESC")
    fun getAllMessages(): Flow<List<GratitudeEntity>>

    @Insert
    suspend fun insertMessage(message: GratitudeEntity): Long

    @Delete
    suspend fun deleteMessage(message: GratitudeEntity)

    @Query("SELECT COUNT(*) FROM gratitude_messages")
    suspend fun getMessageCount(): Int
}
