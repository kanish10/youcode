package com.bloom.app.data.db

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface FlowerDao {
    @Query("SELECT * FROM flowers ORDER BY timestamp DESC")
    fun getAllFlowers(): Flow<List<FlowerEntity>>

    @Query("SELECT COUNT(*) FROM flowers")
    fun getFlowerCount(): Flow<Int>

    @Query("SELECT COUNT(*) FROM flowers WHERE timestamp >= :since")
    suspend fun getFlowerCountSince(since: Long): Int

    @Insert
    suspend fun insertFlower(flower: FlowerEntity): Long

    @Query("SELECT * FROM flowers ORDER BY timestamp DESC LIMIT :limit")
    suspend fun getRecentFlowers(limit: Int): List<FlowerEntity>
}
