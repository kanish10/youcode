package com.bloom.app.ui.activities

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Air
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.filled.Waves
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.data.models.WellnessQuadrant
import com.bloom.app.ui.components.SanctuaryBadge
import com.bloom.app.ui.theme.BloomColors
import kotlinx.coroutines.delay

private data class BreathPhase(
    val labelRes: Int,
    val descriptionRes: Int,
    val seconds: Int,
    val targetScale: Float
)

private val breathPhases = listOf(
    BreathPhase(
        labelRes = R.string.breathing_phase_inhale,
        descriptionRes = R.string.breathing_phase_inhale_desc,
        seconds = 4,
        targetScale = 1.08f
    ),
    BreathPhase(
        labelRes = R.string.breathing_phase_hold,
        descriptionRes = R.string.breathing_phase_hold_desc,
        seconds = 4,
        targetScale = 1.08f
    ),
    BreathPhase(
        labelRes = R.string.breathing_phase_exhale,
        descriptionRes = R.string.breathing_phase_exhale_desc,
        seconds = 6,
        targetScale = 0.8f
    )
)

@Composable
fun BreathingExercise(
    app: BloomApp,
    onDone: () -> Unit
) {
    var elapsedSeconds by remember { mutableIntStateOf(0) }
    var secondsLeft by remember { mutableIntStateOf(breathPhases.first().seconds) }
    var phaseIndex by remember { mutableIntStateOf(0) }
    var cycles by remember { mutableIntStateOf(0) }
    var running by remember { mutableStateOf(false) }
    var saving by remember { mutableStateOf(false) }
    var shouldFinish by remember { mutableStateOf(false) }

    val phase = breathPhases[phaseIndex]

    DisposableEffect(Unit) {
        app.sessionManager.pauseInactivityTimer()
        onDispose {
            app.sessionManager.resumeInactivityTimer()
        }
    }

    LaunchedEffect(running, phaseIndex) {
        if (!running || saving) return@LaunchedEffect

        while (running && !saving) {
            delay(1000)
            elapsedSeconds += 1

            if (secondsLeft > 1) {
                secondsLeft -= 1
            } else {
                val nextPhase = (phaseIndex + 1) % breathPhases.size
                if (nextPhase == 0) cycles += 1
                phaseIndex = nextPhase
                secondsLeft = breathPhases[nextPhase].seconds
            }
        }
    }

    val orbScale by animateFloatAsState(
        targetValue = if (running) phase.targetScale else 0.84f,
        animationSpec = tween(durationMillis = if (running) phase.seconds * 1000 else 500),
        label = "breathing_orb_scale"
    )

    fun resetPractice() {
        running = false
        shouldFinish = false
        elapsedSeconds = 0
        secondsLeft = breathPhases.first().seconds
        phaseIndex = 0
        cycles = 0
    }

    suspend fun saveAndExit() {
        if (saving) return
        saving = true
        app.gardenRepository.addFlower(WellnessQuadrant.MIND)
        app.supabaseClient.logActivity(
            quadrant = "mind",
            activityType = "breathing",
            durationSeconds = elapsedSeconds.coerceAtLeast(60),
            completed = true
        )
        app.supabaseClient.addFlower("mind", WellnessQuadrant.MIND.colorHex)
        onDone()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BloomColors.background)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            BloomColors.primaryContainer.copy(alpha = 0.58f),
                            BloomColors.background
                        )
                    )
                )
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .statusBarsPadding()
                .navigationBarsPadding()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = {
                        if (!saving) onDone()
                    }
                ) {
                    Icon(
                        Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = stringResource(R.string.back),
                        tint = BloomColors.onSurface
                    )
                }
                SanctuaryBadge(
                    text = stringResource(R.string.breathing_title),
                    containerColor = BloomColors.primaryContainer,
                    contentColor = BloomColors.primary
                )
                Box(modifier = Modifier.width(48.dp))
            }

            Column(
                modifier = Modifier.padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(28.dp))
                        .background(Color.White.copy(alpha = 0.9f))
                        .border(
                            1.dp,
                            BloomColors.outlineVariant.copy(alpha = 0.18f),
                            RoundedCornerShape(28.dp)
                        )
                        .padding(24.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text(
                            text = stringResource(R.string.breathing_hero_badge),
                            fontSize = 11.sp,
                            color = BloomColors.primary,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.1.sp
                        )
                        Text(
                            text = stringResource(R.string.breathing_hero_title),
                            fontSize = 30.sp,
                            fontWeight = FontWeight.Bold,
                            color = BloomColors.onSurface,
                            lineHeight = 36.sp
                        )
                        Text(
                            text = stringResource(R.string.breathing_hero_body),
                            fontSize = 15.sp,
                            color = BloomColors.onSurfaceVariant,
                            lineHeight = 23.sp
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(28.dp))
                        .background(Color.White.copy(alpha = 0.92f))
                        .border(
                            1.dp,
                            BloomColors.outlineVariant.copy(alpha = 0.18f),
                            RoundedCornerShape(28.dp)
                        )
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(18.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(260.dp)
                                .clip(CircleShape)
                                .background(BloomColors.primaryContainer.copy(alpha = 0.45f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(168.dp)
                                    .scale(orbScale)
                                    .clip(CircleShape)
                                    .background(BloomColors.primary),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text(
                                        text = stringResource(phase.labelRes),
                                        fontSize = 13.sp,
                                        color = BloomColors.onPrimary.copy(alpha = 0.8f),
                                        fontWeight = FontWeight.Bold,
                                        letterSpacing = 1.sp
                                    )
                                    Text(
                                        text = secondsLeft.toString(),
                                        fontSize = 46.sp,
                                        color = BloomColors.onPrimary,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            BreathingStatCard(
                                label = stringResource(R.string.breathing_stat_elapsed),
                                value = formatClock(elapsedSeconds),
                                modifier = Modifier.weight(1f)
                            )
                            BreathingStatCard(
                                label = stringResource(R.string.breathing_stat_cycles),
                                value = cycles.toString(),
                                modifier = Modifier.weight(1f)
                            )
                            BreathingStatCard(
                                label = stringResource(R.string.breathing_stat_current),
                                value = stringResource(phase.labelRes),
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(28.dp))
                        .background(BloomColors.surfaceContainer)
                        .border(
                            1.dp,
                            BloomColors.outlineVariant.copy(alpha = 0.16f),
                            RoundedCornerShape(28.dp)
                        )
                        .padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = stringResource(R.string.breathing_guidance_title),
                        fontSize = 13.sp,
                        color = BloomColors.onSurfaceVariant,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )

                    breathPhases.forEachIndexed { index, item ->
                        val highlighted = index == phaseIndex
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(22.dp))
                                .background(
                                    if (highlighted) BloomColors.primaryContainer.copy(alpha = 0.45f)
                                    else Color.White
                                )
                                .border(
                                    1.dp,
                                    if (highlighted) BloomColors.primary.copy(alpha = 0.2f)
                                    else BloomColors.outlineVariant.copy(alpha = 0.16f),
                                    RoundedCornerShape(22.dp)
                                )
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(42.dp)
                                    .clip(CircleShape)
                                    .background(
                                        if (highlighted) BloomColors.primary else BloomColors.primaryContainer
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = if (index == 2) Icons.Default.Waves else Icons.Default.Air,
                                    contentDescription = null,
                                    tint = if (highlighted) BloomColors.onPrimary else BloomColors.primary
                                )
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = stringResource(item.labelRes),
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = BloomColors.onSurface
                                )
                                Text(
                                    text = stringResource(item.descriptionRes),
                                    fontSize = 13.sp,
                                    color = BloomColors.onSurfaceVariant,
                                    lineHeight = 19.sp
                                )
                            }
                            Text(
                                text = stringResource(R.string.breathing_seconds_format, item.seconds),
                                fontSize = 12.sp,
                                color = BloomColors.primary,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 20.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Button(
                            onClick = { running = !running },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(20.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = BloomColors.primary)
                        ) {
                            Icon(
                                imageVector = Icons.Default.PlayArrow,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp)
                            )
                            Text(
                                text = stringResource(
                                    if (running) R.string.breathing_pause
                                    else if (elapsedSeconds > 0) R.string.breathing_resume
                                    else R.string.breathing_start
                                ),
                                modifier = Modifier.padding(start = 6.dp)
                            )
                        }
                        Button(
                            onClick = { resetPractice() },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(20.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = BloomColors.surfaceContainer,
                                contentColor = BloomColors.onSurface
                            )
                        ) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp)
                            )
                            Text(
                                text = stringResource(R.string.breathing_reset),
                                modifier = Modifier.padding(start = 6.dp)
                            )
                        }
                    }

                    Button(
                        onClick = {
                            if (!saving) {
                                running = false
                                shouldFinish = true
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        enabled = elapsedSeconds >= 20 && !saving,
                        shape = RoundedCornerShape(20.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = BloomColors.primaryContainer,
                            contentColor = BloomColors.primary
                        )
                    ) {
                        Text(stringResource(R.string.breathing_finish))
                    }
                }
            }
        }
    }

    if (shouldFinish && !saving) {
        LaunchedEffect(shouldFinish) {
            if (shouldFinish && !saving) saveAndExit()
        }
    }
}

@Composable
private fun BreathingStatCard(
    label: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .background(BloomColors.surfaceContainer)
            .padding(horizontal = 14.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Text(
            text = label,
            fontSize = 11.sp,
            color = BloomColors.onSurfaceVariant,
            fontWeight = FontWeight.Bold,
            letterSpacing = 1.sp
        )
        Text(
            text = value,
            fontSize = 22.sp,
            color = BloomColors.onSurface,
            fontWeight = FontWeight.Bold
        )
    }
}

private fun formatClock(totalSeconds: Int): String {
    val minutes = totalSeconds / 60
    val seconds = totalSeconds % 60
    return "%d:%02d".format(minutes, seconds)
}
