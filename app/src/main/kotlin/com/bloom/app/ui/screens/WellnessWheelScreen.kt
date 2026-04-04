package com.bloom.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.data.models.WellnessQuadrant
import com.bloom.app.navigation.BloomRoute
import com.bloom.app.ui.components.LanguageBadge
import com.bloom.app.ui.components.MoodSelector

@Composable
fun WellnessWheelScreen(
    app: BloomApp,
    onQuadrantClick: (String) -> Unit,
    onClose: () -> Unit
) {
    val session by app.sessionManager.sessionState.collectAsState()
    val language by app.languageManager.currentLanguage.collectAsState()

    LaunchedEffect(Unit) {
        app.sessionManager.startSession()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .pointerInput(Unit) {
                detectTapGestures(onTap = { app.sessionManager.onUserInteraction() })
            }
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            LanguageBadge(
                text = stringResource(R.string.language_label, app.languageManager.getDisplayName(language)),
                onClick = { app.sessionManager.onUserInteraction() }
            )
            IconButton(onClick = onClose) {
                Icon(Icons.Default.Close, contentDescription = stringResource(R.string.close))
            }
        }

        Text(stringResource(R.string.how_feeling))
        MoodSelector(selected = session.selectedMood, onSelect = {
            app.sessionManager.updateMood(it)
            app.sessionManager.onUserInteraction()
        })

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.weight(1f),
            contentPadding = PaddingValues(top = 8.dp, bottom = 8.dp)
        ) {
            items(WellnessQuadrant.values()) { quadrant ->
                Column(
                    modifier = Modifier
                        .background(quadrant.backgroundColor, RoundedCornerShape(20.dp))
                        .padding(18.dp)
                        .fillMaxWidth()
                        .pointerInput(quadrant) {
                            detectTapGestures(onTap = {
                                app.sessionManager.updateQuadrant(quadrant)
                                app.sessionManager.onUserInteraction()
                                onQuadrantClick(
                                    when (quadrant) {
                                        WellnessQuadrant.MIND -> BloomRoute.MIND
                                        WellnessQuadrant.BODY -> BloomRoute.BODY
                                        WellnessQuadrant.SOUL -> BloomRoute.SOUL
                                        WellnessQuadrant.CONNECT -> BloomRoute.CONNECT
                                    }
                                )
                            })
                        }
                ) {
                    Text(quadrant.emoji)
                    Text(quadrant.localizedLabel())
                }
            }
        }

        Button(
            onClick = {
                app.sessionManager.onUserInteraction()
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(stringResource(R.string.talk_to_bloom))
        }
    }
}
