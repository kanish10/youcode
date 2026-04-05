package com.bloom.app.ui.screens

import android.annotation.SuppressLint
import android.net.Uri
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.EventSeat
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.data.models.Exercise
import com.bloom.app.data.models.ExerciseCategory
import com.bloom.app.data.models.WellnessQuadrant
import com.bloom.app.ui.theme.BloomColors
import kotlinx.coroutines.launch

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun ExerciseDetailScreen(
    app: BloomApp,
    exercise: Exercise,
    onBack: () -> Unit
) {
    val scope = rememberCoroutineScope()
    var completed by remember { mutableStateOf(false) }
    val bgColor = when (exercise.category) {
        ExerciseCategory.YOGA, ExerciseCategory.BREATHING -> BloomColors.mindBlueBg
        ExerciseCategory.STRETCHING, ExerciseCategory.STRENGTH -> BloomColors.bodyGreenBg
        ExerciseCategory.DANCE -> BloomColors.soulPinkBg
    }
    val accentColor = when (exercise.category) {
        ExerciseCategory.YOGA, ExerciseCategory.BREATHING -> BloomColors.mindBlue
        ExerciseCategory.STRETCHING, ExerciseCategory.STRENGTH -> BloomColors.bodyGreen
        ExerciseCategory.DANCE -> BloomColors.soulPink
    }

    DisposableEffect(Unit) {
        app.sessionManager.pauseInactivityTimer()
        onDispose { app.sessionManager.resumeInactivityTimer() }
    }

    LaunchedEffect(completed) {
        if (completed) {
            app.gardenRepository.addFlower(WellnessQuadrant.BODY)
            app.supabaseClient.logActivity(
                quadrant = "body",
                activityType = exercise.id,
                durationSeconds = exercise.durationMin * 60,
                completed = true
            )
            app.supabaseClient.addFlower("body", WellnessQuadrant.BODY.colorHex)
            onBack()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BloomColors.background)
            .statusBarsPadding()
    ) {
        // Top bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = stringResource(R.string.back), tint = BloomColors.textPrimary)
            }
            Text(
                text = exercise.name,
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold,
                color = BloomColors.textPrimary,
                modifier = Modifier.weight(1f)
            )
        }

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
        ) {
            // Video player (YouTube WebView)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(220.dp)
                    .background(Color.Black)
            ) {
                val ytUrl = "https://www.youtube.com/results?search_query=${Uri.encode(exercise.youtubeQuery)}"
                AndroidView(
                    factory = { context ->
                        WebView(context).apply {
                            settings.apply {
                                javaScriptEnabled = true
                                domStorageEnabled = true
                                mediaPlaybackRequiresUserGesture = false
                                loadWithOverviewMode = true
                                useWideViewPort = true
                                setSupportZoom(false)
                                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                            }
                            webChromeClient = WebChromeClient()
                            loadUrl(ytUrl)
                        }
                    },
                    modifier = Modifier.fillMaxSize()
                )
            }

            // Exercise info
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Emoji + title
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(52.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(bgColor),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(exercise.emoji, fontSize = 26.sp)
                    }
                    Column {
                        Text(exercise.name, fontWeight = FontWeight.Bold, fontSize = 20.sp, color = BloomColors.textPrimary)
                        Text(exercise.desc, fontSize = 13.sp, color = BloomColors.textSecondary, lineHeight = 18.sp)
                    }
                }

                // Tags
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Tag(text = "${exercise.durationMin} min", icon = Icons.Default.AccessTime, color = accentColor)
                    Tag(text = exercise.difficulty.label, color = accentColor)
                    if (exercise.isSeated) {
                        Tag(text = stringResource(R.string.exercise_seated), icon = Icons.Default.EventSeat, color = accentColor)
                    }
                    Tag(text = exercise.category.displayName, color = accentColor)
                }

                // Steps
                Text(
                    text = stringResource(R.string.exercise_steps_title),
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 16.sp,
                    color = BloomColors.textPrimary
                )
                exercise.steps.forEachIndexed { index, step ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(bgColor)
                            .padding(12.dp),
                        verticalAlignment = Alignment.Top,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(26.dp)
                                .clip(CircleShape)
                                .background(accentColor),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "${index + 1}",
                                color = Color.White,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Text(
                            text = step,
                            fontSize = 14.sp,
                            color = BloomColors.textPrimary,
                            lineHeight = 20.sp,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                Box(Modifier.padding(bottom = 8.dp))
            }
        }

        // Complete button
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(BloomColors.surface)
                .navigationBarsPadding()
                .padding(16.dp)
        ) {
            Button(
                onClick = { completed = true },
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = accentColor)
            ) {
                Text(
                    text = stringResource(R.string.exercise_complete),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}

@Composable
private fun Tag(text: String, color: Color, icon: androidx.compose.ui.graphics.vector.ImageVector? = null) {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(color.copy(alpha = 0.12f))
            .padding(horizontal = 10.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        if (icon != null) {
            Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(12.dp))
        }
        Text(text, fontSize = 11.sp, color = color, fontWeight = FontWeight.Medium)
    }
}
