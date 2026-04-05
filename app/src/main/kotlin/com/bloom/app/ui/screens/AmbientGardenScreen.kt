package com.bloom.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.LocalFlorist
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material.icons.outlined.Shield
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.ui.components.BreathingCircle
import com.bloom.app.ui.components.FlowerGarden
import com.bloom.app.ui.theme.BloomColors
import java.util.Calendar

@Composable
fun AmbientGardenScreen(
    app: BloomApp,
    onBegin: () -> Unit,
    onStaffClick: () -> Unit,
    onSettingsClick: () -> Unit = {}
) {
    val flowers by app.gardenRepository.getAllFlowers().collectAsState(initial = emptyList())
    val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)

    // Time-of-day gradient — warm tones matching the design palette
    val topColor = when {
        hour in 6..11 -> Color(0xFFFFFCF7)   // morning: warm white
        hour in 12..17 -> Color(0xFFF6F3EC)   // afternoon: cream
        else -> Color(0xFFF0EEE6)             // evening: muted warm
    }
    val bottomColor = when {
        hour in 6..11 -> Color(0xFFCEE9DA)    // morning: sage green tint
        hour in 12..17 -> Color(0xFFEFE0D2)   // afternoon: warm beige tint
        else -> Color(0xFFEEE0FC)             // evening: lavender tint
    }

    Box(modifier = Modifier.fillMaxSize()) {
        // Gradient background
        androidx.compose.foundation.Canvas(modifier = Modifier.fillMaxSize()) {
            drawRect(brush = Brush.verticalGradient(listOf(topColor, bottomColor)))
        }

        // Flower garden visualization (transparent bg, just flowers + soil)
        FlowerGarden(flowers = flowers, modifier = Modifier.fillMaxSize())

        // Breathing circle (centered, calming animation)
        BreathingCircle(
            modifier = Modifier.align(Alignment.Center),
            color = BloomColors.sageGreen
        )

        // Top bar overlay
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.TopCenter)
                .statusBarsPadding()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Brand
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(
                    Icons.Outlined.LocalFlorist,
                    contentDescription = null,
                    tint = BloomColors.sageGreen,
                    modifier = Modifier.size(26.dp)
                )
                Text(
                    text = stringResource(R.string.app_name),
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Serif,
                    color = BloomColors.sageGreen
                )
            }

            // Actions
            Row {
                IconButton(onClick = onSettingsClick) {
                    Icon(
                        Icons.Outlined.Settings,
                        contentDescription = stringResource(R.string.settings_title),
                        tint = BloomColors.primary
                    )
                }
                IconButton(onClick = onStaffClick) {
                    Icon(
                        Icons.Outlined.Shield,
                        contentDescription = stringResource(R.string.staff),
                        tint = BloomColors.primary
                    )
                }
            }
        }

        // Bottom content overlay with gradient fade
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color.Transparent,
                            BloomColors.creamBg.copy(alpha = 0.85f),
                            BloomColors.creamBg
                        ),
                        startY = 0f,
                        endY = 250f
                    )
                )
                .padding(horizontal = 24.dp)
                .padding(bottom = 16.dp, top = 48.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = stringResource(R.string.living_garden_title),
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily.Serif,
                color = BloomColors.onSurface
            )

            Text(
                text = stringResource(R.string.moments_of_wellness, flowers.size),
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = BloomColors.primary
            )

            Text(
                text = stringResource(R.string.garden_subtitle),
                fontSize = 13.sp,
                color = BloomColors.onSurfaceVariant,
                textAlign = TextAlign.Center,
                lineHeight = 18.sp,
                modifier = Modifier.padding(horizontal = 12.dp)
            )

            Spacer(Modifier.height(8.dp))

            Button(
                onClick = onBegin,
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = BloomColors.primary,
                    contentColor = BloomColors.onPrimary
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp)
            ) {
                Text(
                    text = stringResource(R.string.begin_practice),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}
