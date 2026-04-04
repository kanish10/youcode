package com.bloom.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.bloom.app.R
import com.bloom.app.ui.components.WellnessCard
import com.bloom.app.ui.theme.BloomColors

@Composable
fun SoulScreen(onBack: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(stringResource(R.string.soul))
        WellnessCard("🎨", stringResource(R.string.canvas_title), stringResource(R.string.canvas_subtitle), BloomColors.soulPinkBg, onClick = {})
        WellnessCard("🙏", stringResource(R.string.gratitude_title), stringResource(R.string.gratitude_subtitle), BloomColors.soulPinkBg, onClick = {})
        WellnessCard("🌟", stringResource(R.string.affirmation_title), stringResource(R.string.affirmation_subtitle), BloomColors.soulPinkBg, onClick = {})
        WellnessCard("🫶", stringResource(R.string.memory_title), stringResource(R.string.memory_subtitle), BloomColors.soulPinkBg, onClick = {})
        Button(onClick = onBack) { Text(stringResource(R.string.back)) }
    }
}
