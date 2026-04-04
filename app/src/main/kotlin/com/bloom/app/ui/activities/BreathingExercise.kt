package com.bloom.app.ui.activities

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.data.models.WellnessQuadrant
import com.bloom.app.ui.components.BreathingCircle
import kotlinx.coroutines.delay

@Composable
fun BreathingExercise(
    app: BloomApp,
    onDone: () -> Unit
) {
    var elapsed by remember { mutableLongStateOf(0L) }
    var completed by remember { mutableStateOf(false) }

    DisposableEffect(Unit) {
        app.sessionManager.pauseInactivityTimer()
        onDispose {
            app.sessionManager.resumeInactivityTimer()
        }
    }

    LaunchedEffect(Unit) {
        while (!completed && elapsed < 120_000L) {
            delay(1000)
            elapsed += 1000
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        val phase = ((elapsed / 4000) % 2 == 0L)
        Text(if (phase) stringResource(R.string.breathe_in) else stringResource(R.string.breathe_out))
        BreathingCircle()
        Text(stringResource(R.string.elapsed_seconds, (elapsed / 1000).toInt()))

        if (elapsed >= 60_000L) {
            Button(
                onClick = {
                    completed = true
                }
            ) { Text(stringResource(R.string.done)) }
        }

        if (completed || elapsed >= 120_000L) {
            LaunchedEffect("saveFlower") {
                app.gardenRepository.addFlower(WellnessQuadrant.MIND)
                app.supabaseClient.logActivity(
                    quadrant = "mind",
                    activityType = "breathing",
                    durationSeconds = (elapsed / 1000).toInt(),
                    completed = true
                )
                app.supabaseClient.addFlower("mind", WellnessQuadrant.MIND.colorHex)
                onDone()
            }
            Text(stringResource(R.string.great_job_flower))
        }
    }
}
