package com.bloom.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Build
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.ui.components.BreathingCircle
import com.bloom.app.ui.components.FlowerGarden
import java.util.Calendar

@Composable
fun AmbientGardenScreen(
    app: BloomApp,
    onBegin: () -> Unit,
    onStaffClick: () -> Unit
) {
    val flowers by app.gardenRepository.getAllFlowers().collectAsState(initial = emptyList())
    val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
    val topColor = if (hour in 6..17) Color(0xFFEAF5FF) else Color(0xFFDBE7F8)
    val bottomColor = if (hour in 6..17) Color(0xFFFDF7EF) else Color(0xFFECEFFB)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .clickable(onClick = onBegin)
    ) {
        androidx.compose.foundation.Canvas(modifier = Modifier.fillMaxSize()) {
            drawRect(brush = Brush.verticalGradient(listOf(topColor, bottomColor)))
        }
        FlowerGarden(flowers = flowers, modifier = Modifier.fillMaxSize())
        BreathingCircle(
            modifier = Modifier.align(Alignment.Center),
            color = MaterialTheme.colorScheme.primary
        )
        IconButton(
            onClick = onStaffClick,
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(12.dp)
        ) {
            Icon(imageVector = Icons.Default.Build, contentDescription = stringResource(R.string.staff))
        }
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(text = stringResource(R.string.moments_of_wellness, flowers.size))
            Button(onClick = onBegin) {
                Text(text = stringResource(R.string.begin))
            }
        }
    }
}
