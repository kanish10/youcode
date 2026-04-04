package com.bloom.app.util

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import androidx.core.content.ContextCompat
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.ByteArrayOutputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder

class AudioRecorder(private val context: Context) {

    private var audioRecord: AudioRecord? = null
    private var isRecording = false

    fun hasPermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.RECORD_AUDIO
        ) == PackageManager.PERMISSION_GRANTED
    }

    suspend fun recordAudio(durationMs: Long = 10_000): ByteArray = withContext(Dispatchers.IO) {
        val bufferSize = AudioRecord.getMinBufferSize(
            Constants.AUDIO_SAMPLE_RATE,
            Constants.AUDIO_CHANNEL_CONFIG,
            Constants.AUDIO_ENCODING
        )

        val audioRecord = AudioRecord(
            MediaRecorder.AudioSource.MIC,
            Constants.AUDIO_SAMPLE_RATE,
            Constants.AUDIO_CHANNEL_CONFIG,
            Constants.AUDIO_ENCODING,
            bufferSize
        )

        this@AudioRecorder.audioRecord = audioRecord
        val outputStream = ByteArrayOutputStream()
        val buffer = ByteArray(bufferSize)

        try {
            audioRecord.startRecording()
            isRecording = true
            val startTime = System.currentTimeMillis()

            while (isRecording && (System.currentTimeMillis() - startTime) < durationMs) {
                val bytesRead = audioRecord.read(buffer, 0, bufferSize)
                if (bytesRead > 0) {
                    outputStream.write(buffer, 0, bytesRead)
                }
            }
        } finally {
            isRecording = false
            audioRecord.stop()
            audioRecord.release()
            this@AudioRecorder.audioRecord = null
        }

        val pcmData = outputStream.toByteArray()
        addWavHeader(pcmData, Constants.AUDIO_SAMPLE_RATE, 1, 16)
    }

    fun stopRecording() {
        isRecording = false
    }

    private fun addWavHeader(pcmData: ByteArray, sampleRate: Int, channels: Int, bitsPerSample: Int): ByteArray {
        val dataSize = pcmData.size
        val header = ByteArray(44)
        val buffer = ByteBuffer.wrap(header).order(ByteOrder.LITTLE_ENDIAN)

        // RIFF header
        buffer.put("RIFF".toByteArray())
        buffer.putInt(36 + dataSize)
        buffer.put("WAVE".toByteArray())

        // fmt chunk
        buffer.put("fmt ".toByteArray())
        buffer.putInt(16)          // chunk size
        buffer.putShort(1)         // PCM format
        buffer.putShort(channels.toShort())
        buffer.putInt(sampleRate)
        buffer.putInt(sampleRate * channels * bitsPerSample / 8)
        buffer.putShort((channels * bitsPerSample / 8).toShort())
        buffer.putShort(bitsPerSample.toShort())

        // data chunk
        buffer.put("data".toByteArray())
        buffer.putInt(dataSize)

        return header + pcmData
    }
}
