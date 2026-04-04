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
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.ui.components.WellnessCard
import com.bloom.app.ui.theme.BloomColors

@Composable
fun MindScreen(
    app: BloomApp,
    onBack: () -> Unit,
    onBreathing: () -> Unit,
    onGrounding: () -> Unit
) {
    app.sessionManager.onUserInteraction()
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(stringResource(R.string.mind))
        WellnessCard("🫁", stringResource(R.string.breathing_title), stringResource(R.string.breathing_subtitle), BloomColors.mindBlueBg, onBreathing)
        WellnessCard("✋", stringResource(R.string.grounding_title), stringResource(R.string.grounding_subtitle), BloomColors.mindBlueBg, onGrounding)
        WellnessCard("💡", stringResource(R.string.reframe_title), stringResource(R.string.reframe_subtitle), BloomColors.mindBlueBg, onClick = {})
        WellnessCard("🪶", stringResource(R.string.release_worry_title), stringResource(R.string.release_worry_subtitle), BloomColors.mindBlueBg, onClick = {})
        Button(onClick = onBack) { Text(stringResource(R.string.back)) }
    }
}
