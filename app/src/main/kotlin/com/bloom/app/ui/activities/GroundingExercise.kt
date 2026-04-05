package com.bloom.app.ui.activities

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
import androidx.compose.material.icons.filled.Hearing
import androidx.compose.material.icons.filled.PanTool
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Visibility
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.data.models.WellnessQuadrant
import com.bloom.app.ui.components.SanctuaryBadge
import com.bloom.app.ui.theme.BloomColors

private data class GroundingStepUi(
    val count: Int,
    val titleRes: Int,
    val bodyRes: Int,
    val icon: ImageVector,
    val accent: Color,
    val container: Color
)

@Composable
fun GroundingExercise(
    app: BloomApp,
    onDone: () -> Unit
) {
    var stepIndex by remember { mutableIntStateOf(0) }
    var finishing by remember { mutableStateOf(false) }
    var shouldSave by remember { mutableStateOf(false) }

    val steps = listOf(
        GroundingStepUi(
            count = 5,
            titleRes = R.string.grounding_see,
            bodyRes = R.string.grounding_step_see_body,
            icon = Icons.Default.Visibility,
            accent = BloomColors.primary,
            container = BloomColors.primaryContainer
        ),
        GroundingStepUi(
            count = 4,
            titleRes = R.string.grounding_touch,
            bodyRes = R.string.grounding_step_touch_body,
            icon = Icons.Default.PanTool,
            accent = BloomColors.secondary,
            container = BloomColors.secondaryContainer
        ),
        GroundingStepUi(
            count = 3,
            titleRes = R.string.grounding_hear,
            bodyRes = R.string.grounding_step_hear_body,
            icon = Icons.Default.Hearing,
            accent = BloomColors.tertiary,
            container = BloomColors.tertiaryContainer
        ),
        GroundingStepUi(
            count = 2,
            titleRes = R.string.grounding_smell,
            bodyRes = R.string.grounding_step_smell_body,
            icon = Icons.Default.Air,
            accent = BloomColors.primary,
            container = BloomColors.primaryContainer
        ),
        GroundingStepUi(
            count = 1,
            titleRes = R.string.grounding_taste,
            bodyRes = R.string.grounding_step_taste_body,
            icon = Icons.Default.Restaurant,
            accent = BloomColors.secondary,
            container = BloomColors.secondaryContainer
        )
    )

    val introMode = stepIndex == 0
    val completionMode = stepIndex == steps.size + 1
    val currentStep = if (stepIndex in 1..steps.size) steps[stepIndex - 1] else null

    DisposableEffect(Unit) {
        app.sessionManager.pauseInactivityTimer()
        onDispose { app.sessionManager.resumeInactivityTimer() }
    }

    suspend fun saveAndExit() {
        if (finishing) return
        finishing = true
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
                            BloomColors.primaryContainer.copy(alpha = 0.56f),
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
                IconButton(onClick = onDone) {
                    Icon(
                        Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = stringResource(R.string.back),
                        tint = BloomColors.onSurface
                    )
                }
                SanctuaryBadge(
                    text = stringResource(R.string.grounding_title),
                    containerColor = BloomColors.primaryContainer,
                    contentColor = BloomColors.primary
                )
                Box(modifier = Modifier.width(48.dp))
            }

            Column(
                modifier = Modifier.padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                if (introMode) {
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
                                text = stringResource(R.string.grounding_hero_badge),
                                fontSize = 11.sp,
                                color = BloomColors.primary,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.1.sp
                            )
                            Text(
                                text = stringResource(R.string.grounding_hero_title),
                                fontSize = 30.sp,
                                fontWeight = FontWeight.Bold,
                                color = BloomColors.onSurface,
                                lineHeight = 36.sp
                            )
                            Text(
                                text = stringResource(R.string.grounding_hero_body),
                                fontSize = 15.sp,
                                color = BloomColors.onSurfaceVariant,
                                lineHeight = 23.sp
                            )
                        }
                    }

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(28.dp))
                            .background(Color.White.copy(alpha = 0.92f))
                            .border(
                                1.dp,
                                BloomColors.outlineVariant.copy(alpha = 0.18f),
                                RoundedCornerShape(28.dp)
                            )
                            .padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        steps.forEach { step ->
                            GroundingOverviewCard(step = step)
                        }
                    }

                    Button(
                        onClick = { stepIndex = 1 },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 20.dp),
                        shape = RoundedCornerShape(20.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = BloomColors.primary)
                    ) {
                        Text(stringResource(R.string.grounding_begin))
                    }
                } else if (completionMode) {
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
                            .padding(28.dp)
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(96.dp)
                                    .clip(CircleShape)
                                    .background(BloomColors.primaryContainer),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = stringResource(R.string.grounding_complete_icon),
                                    fontSize = 34.sp
                                )
                            }
                            Text(
                                text = stringResource(R.string.grounding_complete_title),
                                fontSize = 30.sp,
                                fontWeight = FontWeight.Bold,
                                color = BloomColors.onSurface,
                                lineHeight = 36.sp
                            )
                            Text(
                                text = stringResource(R.string.grounding_complete_body),
                                fontSize = 15.sp,
                                color = BloomColors.onSurfaceVariant,
                                lineHeight = 23.sp
                            )
                        }
                    }

                    Button(
                        onClick = {
                            if (!finishing) shouldSave = true
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 20.dp),
                        enabled = !finishing,
                        shape = RoundedCornerShape(20.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = BloomColors.primary)
                    ) {
                        Text(stringResource(R.string.grounding_save))
                    }
                } else if (currentStep != null) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        steps.forEachIndexed { index, _ ->
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .size(height = 6.dp, width = 1.dp)
                                    .clip(RoundedCornerShape(999.dp))
                                    .background(
                                        when {
                                            index < stepIndex - 1 -> BloomColors.primary.copy(alpha = 0.55f)
                                            index == stepIndex - 1 -> BloomColors.primary
                                            else -> BloomColors.outlineVariant.copy(alpha = 0.45f)
                                        }
                                    )
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
                            .padding(24.dp)
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(14.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(118.dp)
                                    .clip(CircleShape)
                                    .background(currentStep.container)
                                    .border(
                                        2.dp,
                                        currentStep.accent.copy(alpha = 0.18f),
                                        CircleShape
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = currentStep.count.toString(),
                                    fontSize = 54.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = currentStep.accent
                                )
                            }

                            Icon(
                                imageVector = currentStep.icon,
                                contentDescription = null,
                                tint = currentStep.accent,
                                modifier = Modifier.size(34.dp)
                            )

                            Text(
                                text = stringResource(R.string.grounding_step_counter, stepIndex, steps.size),
                                fontSize = 12.sp,
                                color = BloomColors.onSurfaceVariant,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = stringResource(currentStep.titleRes),
                                fontSize = 28.sp,
                                fontWeight = FontWeight.Bold,
                                color = BloomColors.onSurface,
                                lineHeight = 34.sp
                            )
                            Text(
                                text = stringResource(currentStep.bodyRes),
                                fontSize = 16.sp,
                                color = BloomColors.onSurfaceVariant,
                                lineHeight = 24.sp
                            )
                        }
                    }

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 20.dp),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        if (stepIndex > 1) {
                            Button(
                                onClick = { stepIndex -= 1 },
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(20.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = BloomColors.surfaceContainer,
                                    contentColor = BloomColors.onSurface
                                )
                            ) {
                                Text(stringResource(R.string.grounding_previous))
                            }
                        }

                        Button(
                            onClick = { stepIndex += 1 },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(20.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = currentStep.accent)
                        ) {
                            Text(
                                stringResource(
                                    if (stepIndex == steps.size) {
                                        R.string.grounding_complete_button
                                    } else {
                                        R.string.next
                                    }
                                )
                            )
                        }
                    }
                }
            }
        }
    }

    if (shouldSave && !finishing) {
        LaunchedEffect(shouldSave) {
            saveAndExit()
        }
    }
}

@Composable
private fun GroundingOverviewCard(step: GroundingStepUi) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(22.dp))
            .background(step.container.copy(alpha = 0.32f))
            .border(
                1.dp,
                step.accent.copy(alpha = 0.16f),
                RoundedCornerShape(22.dp)
            )
            .padding(16.dp),
        horizontalArrangement = Arrangement.spacedBy(14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(42.dp)
                .clip(CircleShape)
                .background(step.accent),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = step.count.toString(),
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp
            )
        }

        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                text = stringResource(step.titleRes),
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                color = BloomColors.onSurface
            )
            Text(
                text = stringResource(step.bodyRes),
                fontSize = 13.sp,
                color = BloomColors.onSurfaceVariant,
                lineHeight = 19.sp
            )
        }
    }
}
