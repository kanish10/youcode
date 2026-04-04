package com.bloom.app.data.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(
    entities = [FlowerEntity::class, GratitudeEntity::class, SessionStatEntity::class],
    version = 1,
    exportSchema = false
)
abstract class BloomDatabase : RoomDatabase() {
    abstract fun flowerDao(): FlowerDao
    abstract fun gratitudeDao(): GratitudeDao
    abstract fun statsDao(): StatsDao

    companion object {
        @Volatile
        private var INSTANCE: BloomDatabase? = null

        fun getDatabase(context: Context): BloomDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    BloomDatabase::class.java,
                    "bloom_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
