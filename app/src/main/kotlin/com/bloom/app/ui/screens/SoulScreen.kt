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
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.History
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

private val soulAffirmations = listOf(
    "You are more resilient than you know.",
    "Your feelings are allowed to be complicated and still worthy of care.",
    "Creativity can be a form of rest, not performance.",
    "A quiet memory can still be a powerful source of strength."
)

@Composable
fun SoulScreen(
    app: BloomApp,
    onBack: () -> Unit,
    onCanvas: () -> Unit,
    onGratitude: () -> Unit,
    onAffirmation: () -> Unit,
    onMemory: () -> Unit
) {
    app.sessionManager.onUserInteraction()
    val dailyAffirmation = soulAffirmations[(System.currentTimeMillis() / 86_400_000L).toInt().mod(soulAffirmations.size)]

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BloomColors.background)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(250.dp)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            BloomColors.tertiaryContainer.copy(alpha = 0.62f),
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
                        text = stringResource(R.string.soul),
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = BloomColors.onSurface
                    )
                }
            }

            item {
                SanctuaryHeroCard(
                    badge = stringResource(R.string.soul_hero_badge),
                    title = stringResource(R.string.soul_hero_title),
                    body = stringResource(R.string.soul_hero_body),
                    accentColor = BloomColors.tertiary,
                    badgeContainer = BloomColors.tertiaryContainer,
                    modifier = Modifier.padding(horizontal = 20.dp),
                    trailing = {
                        Box(
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(BloomColors.tertiaryContainer)
                                .padding(horizontal = 18.dp, vertical = 16.dp)
                        ) {
                            Text(
                                text = stringResource(R.string.soul),
                                color = BloomColors.tertiary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
                        }
                    }
                )
            }

            item {
                SanctuarySupportCard(
                    title = stringResource(R.string.affirmation_title),
                    body = dailyAffirmation,
                    accentColor = BloomColors.tertiary,
                    containerColor = BloomColors.tertiaryContainer,
                    modifier = Modifier.padding(horizontal = 20.dp),
                    eyebrow = stringResource(R.string.soul_subtitle),
                    italic = true
                )
            }

            item {
                SanctuaryActionCard(
                    title = stringResource(R.string.canvas_title),
                    subtitle = stringResource(R.string.canvas_subtitle),
                    icon = Icons.Filled.Edit,
                    accentColor = BloomColors.tertiary,
                    containerColor = BloomColors.tertiaryContainer,
                    onClick = onCanvas,
                    modifier = Modifier.padding(horizontal = 20.dp),
                    eyebrow = stringResource(R.string.soul_expression_title),
                    metadata = stringResource(R.string.soul_canvas_meta)
                )
            }

            item {
                SanctuaryActionCard(
                    title = stringResource(R.string.gratitude_title),
                    subtitle = stringResource(R.string.gratitude_subtitle),
                    icon = Icons.Filled.Favorite,
                    accentColor = BloomColors.secondary,
                    containerColor = BloomColors.secondaryContainer,
                    onClick = onGratitude,
                    modifier = Modifier.padding(horizontal = 20.dp),
                    eyebrow = stringResource(R.string.soul),
                    metadata = stringResource(R.string.soul_gratitude_meta)
                )
            }

            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    SanctuaryActionCard(
                        title = stringResource(R.string.affirmation_title),
                        subtitle = stringResource(R.string.affirmation_subtitle),
                        icon = Icons.Filled.AutoAwesome,
                        accentColor = BloomColors.primary,
                        containerColor = BloomColors.primaryContainer,
                        onClick = onAffirmation,
                        modifier = Modifier.weight(1f),
                        eyebrow = stringResource(R.string.soul)
                    )
                    SanctuaryActionCard(
                        title = stringResource(R.string.memory_title),
                        subtitle = stringResource(R.string.memory_subtitle),
                        icon = Icons.Filled.History,
                        accentColor = BloomColors.tertiary,
                        containerColor = BloomColors.tertiaryContainer,
                        onClick = onMemory,
                        modifier = Modifier.weight(1f),
                        eyebrow = stringResource(R.string.soul)
                    )
                }
            }

            item {
                SanctuarySupportCard(
                    title = stringResource(R.string.soul_private_title),
                    body = stringResource(R.string.soul_private_body),
                    accentColor = BloomColors.primary,
                    containerColor = BloomColors.primaryContainer,
                    modifier = Modifier.padding(horizontal = 20.dp),
                    eyebrow = stringResource(R.string.private_sanctuary_title)
                )
            }
        }
    }
}
