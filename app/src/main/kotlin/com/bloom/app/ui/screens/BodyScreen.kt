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
fun BodyScreen(onBack: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(stringResource(R.string.body))
        WellnessCard("🧘", stringResource(R.string.stretch_title), stringResource(R.string.stretch_subtitle), BloomColors.bodyGreenBg, onClick = {})
        WellnessCard("💆", stringResource(R.string.tension_title), stringResource(R.string.tension_subtitle), BloomColors.bodyGreenBg, onClick = {})
        WellnessCard("💃", stringResource(R.string.movement_title), stringResource(R.string.movement_subtitle), BloomColors.bodyGreenBg, onClick = {})
        WellnessCard("🍲", stringResource(R.string.food_title), stringResource(R.string.food_subtitle), BloomColors.bodyGreenBg, onClick = {})
        Button(onClick = onBack) { Text(stringResource(R.string.back)) }
    }
}
