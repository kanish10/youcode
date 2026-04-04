package com.bloom.app

import android.app.Application
import com.bloom.app.data.db.BloomDatabase
import com.bloom.app.data.repository.GardenRepository
import com.bloom.app.data.repository.ResourceRepository
import com.bloom.app.data.repository.StatsRepository
import com.bloom.app.service.LanguageManager
import com.bloom.app.service.SessionManager
import com.bloom.app.service.SupabaseClient
import com.bloom.app.service.VoiceService
import com.bloom.app.service.WellnessAI

class BloomApp : Application() {
    lateinit var database: BloomDatabase
        private set
    lateinit var gardenRepository: GardenRepository
        private set
    lateinit var statsRepository: StatsRepository
        private set
    lateinit var resourceRepository: ResourceRepository
        private set
    lateinit var languageManager: LanguageManager
        private set
    lateinit var sessionManager: SessionManager
        private set
    lateinit var voiceService: VoiceService
        private set
    lateinit var wellnessAI: WellnessAI
        private set
    lateinit var supabaseClient: SupabaseClient
        private set

    override fun onCreate() {
        super.onCreate()
        database = BloomDatabase.getDatabase(this)
        gardenRepository = GardenRepository(database)
        statsRepository = StatsRepository(database)
        resourceRepository = ResourceRepository(this)
        languageManager = LanguageManager(this)
        sessionManager = SessionManager(languageManager, languageManager.getTTSService())
        voiceService = VoiceService(this)
        wellnessAI = WellnessAI()
        supabaseClient = SupabaseClient(
            url = BuildConfig.SUPABASE_URL,
            key = BuildConfig.SUPABASE_ANON_KEY
        )
    }

    override fun onTerminate() {
        sessionManager.destroy()
        languageManager.shutdown()
        super.onTerminate()
    }
}
