package com.bloom.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.bloom.app.BloomApp
import com.bloom.app.R

@Composable
fun ConnectScreen(
    app: BloomApp,
    onBack: () -> Unit
) {
    val flowers by app.gardenRepository.getFlowerCount().collectAsState(initial = 0)
    val gratitudeCount = flowers / 3

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(stringResource(R.string.connect))
        Text(stringResource(R.string.garden_count, flowers))
        Text(stringResource(R.string.gratitude_count, gratitudeCount))
        Text(stringResource(R.string.connect_coming_soon))
        Button(onClick = onBack) { Text(stringResource(R.string.back)) }
    }
}
