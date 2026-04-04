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
import androidx.compose.runtime.mutableIntStateOf
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

@Composable
fun GroundingExercise(
    app: BloomApp,
    onDone: () -> Unit
) {
    var step by remember { mutableIntStateOf(0) }
    var completed by remember { mutableStateOf(false) }
    val prompts = listOf(
        stringResource(R.string.grounding_see),
        stringResource(R.string.grounding_touch),
        stringResource(R.string.grounding_hear),
        stringResource(R.string.grounding_smell),
        stringResource(R.string.grounding_taste),
        stringResource(R.string.grounding_safe)
    )

    DisposableEffect(Unit) {
        app.sessionManager.pauseInactivityTimer()
        onDispose { app.sessionManager.resumeInactivityTimer() }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = if (step < 5) "${5 - step}" else "✓")
        Text(text = prompts[step])
        if (!completed) {
            Button(
                onClick = {
                    if (step < prompts.lastIndex) {
                        step += 1
                    } else {
                        completed = true
                    }
                }
            ) { Text(if (step < prompts.lastIndex) stringResource(R.string.next) else stringResource(R.string.complete)) }
        }

        if (completed) {
            LaunchedEffect("finishGrounding") {
                app.gardenRepository.addFlower(WellnessQuadrant.MIND)
                app.supabaseClient.logActivity(
                    quadrant = "mind",
                    activityType = "grounding",
                    durationSeconds = 180,
                    completed = true
                )
                app.supabaseClient.addFlower("mind", WellnessQuadrant.MIND.colorHex)
                onDone()
            }
        }
    }
}
