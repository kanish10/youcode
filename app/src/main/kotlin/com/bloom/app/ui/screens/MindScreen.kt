package com.bloom.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Air
import androidx.compose.material.icons.filled.PanTool
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.ui.components.SanctuaryActionCard
import com.bloom.app.ui.components.SanctuaryHeroCard
import com.bloom.app.ui.components.SanctuarySupportCard
import com.bloom.app.ui.theme.BloomColors

@Composable
fun MindScreen(
    app: BloomApp,
    onBack: () -> Unit,
    onBreathing: () -> Unit,
    onGrounding: () -> Unit
) {
    app.sessionManager.onUserInteraction()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BloomColors.background)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(240.dp)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            BloomColors.primaryContainer.copy(alpha = 0.52f),
                            BloomColors.background
                        )
                    )
                )
        )

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = 28.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .statusBarsPadding()
                        .padding(horizontal = 16.dp, vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onBack) {
                        Icon(
                            Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = stringResource(R.string.back),
                            tint = BloomColors.onSurface
                        )
                    }
                    Text(
                        text = stringResource(R.string.mind),
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = BloomColors.onSurface
                    )
                }
            }

            item {
                SanctuaryHeroCard(
                    badge = stringResource(R.string.mind_hero_badge),
                    title = stringResource(R.string.mind_hero_title),
                    body = stringResource(R.string.mind_hero_body),
                    accentColor = BloomColors.primary,
                    badgeContainer = BloomColors.primaryContainer,
                    modifier = Modifier.padding(horizontal = 20.dp),
                    trailing = {
                        Box(
                            modifier = Modifier
                                .size(68.dp)
                                .clip(CircleShape)
                                .background(BloomColors.primaryContainer),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Filled.PanTool,
                                contentDescription = null,
                                tint = BloomColors.primary,
                                modifier = Modifier.size(34.dp)
                            )
                        }
                    }
                )
            }

            item {
                SanctuaryActionCard(
                    title = stringResource(R.string.breathing_title),
                    subtitle = stringResource(R.string.breathing_subtitle),
                    icon = Icons.Filled.Air,
                    accentColor = BloomColors.primary,
                    containerColor = BloomColors.primaryContainer,
                    onClick = onBreathing,
                    modifier = Modifier.padding(horizontal = 20.dp),
                    eyebrow = stringResource(R.string.mind),
                    metadata = stringResource(R.string.mind_breathing_meta)
                )
            }

            item {
                SanctuaryActionCard(
                    title = stringResource(R.string.grounding_title),
                    subtitle = stringResource(R.string.grounding_subtitle),
                    icon = Icons.Filled.PanTool,
                    accentColor = BloomColors.secondary,
                    containerColor = BloomColors.secondaryContainer,
                    onClick = onGrounding,
                    modifier = Modifier.padding(horizontal = 20.dp),
                    eyebrow = stringResource(R.string.mind_hero_badge),
                    metadata = stringResource(R.string.mind_grounding_meta)
                )
            }

            item {
                Text(
                    text = stringResource(R.string.mind_reflections_title),
                    modifier = Modifier.padding(horizontal = 24.dp, vertical = 4.dp),
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = BloomColors.primary,
                    letterSpacing = 1.sp
                )
            }

            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    SanctuarySupportCard(
                        title = stringResource(R.string.reframe_title),
                        body = stringResource(R.string.reframe_subtitle),
                        accentColor = BloomColors.primary,
                        containerColor = BloomColors.primaryContainer,
                        modifier = Modifier.weight(1f),
                        eyebrow = stringResource(R.string.mind_reflections_title)
                    )
                    SanctuarySupportCard(
                        title = stringResource(R.string.release_worry_title),
                        body = stringResource(R.string.release_worry_subtitle),
                        accentColor = BloomColors.tertiary,
                        containerColor = BloomColors.tertiaryContainer,
                        modifier = Modifier.weight(1f),
                        eyebrow = stringResource(R.string.mind_reflections_title)
                    )
                }
            }

            item {
                SanctuarySupportCard(
                    title = stringResource(R.string.mind_reflections_title),
                    body = stringResource(R.string.mind_reflections_body),
                    accentColor = BloomColors.secondary,
                    containerColor = BloomColors.secondaryContainer,
                    modifier = Modifier.padding(horizontal = 20.dp),
                    eyebrow = stringResource(R.string.talk_to_bloom),
                    italic = true
                )
            }
        }
    }
}
