package com.bloom.app.data.repository

import com.bloom.app.data.db.BloomDatabase
import com.bloom.app.data.db.FlowerEntity
import com.bloom.app.data.models.Flower
import com.bloom.app.data.models.WellnessQuadrant
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class GardenRepository(private val db: BloomDatabase) {

    fun getAllFlowers(): Flow<List<Flower>> {
        return db.flowerDao().getAllFlowers().map { entities ->
            entities.map { it.toModel() }
        }
    }

    fun getFlowerCount(): Flow<Int> = db.flowerDao().getFlowerCount()

    suspend fun addFlower(quadrant: WellnessQuadrant) {
        val entity = FlowerEntity(
            quadrant = quadrant.name,
            timestamp = System.currentTimeMillis(),
            colorHex = quadrant.colorHex
        )
        db.flowerDao().insertFlower(entity)
    }

    private fun FlowerEntity.toModel(): Flower {
        val quadrant = try {
            WellnessQuadrant.valueOf(this.quadrant)
        } catch (e: Exception) {
            WellnessQuadrant.MIND
        }
        return Flower(
            id = this.id,
            quadrant = quadrant,
            timestamp = this.timestamp,
            colorHex = this.colorHex
        )
    }
}
