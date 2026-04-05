package com.bloom.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.FitnessCenter
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material.icons.outlined.Chat
import androidx.compose.material.icons.outlined.LocalFlorist
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.data.models.WellnessQuadrant
import com.bloom.app.navigation.BloomRoute
import com.bloom.app.ui.components.SanctuaryBadge
import com.bloom.app.ui.components.SanctuarySupportCard
import com.bloom.app.ui.theme.BloomColors

@Composable
fun WellnessWheelScreen(
    app: BloomApp,
    onQuadrantClick: (String) -> Unit,
    onClose: () -> Unit,
    onChatClick: () -> Unit = {},
    onSettingsClick: () -> Unit = {}
) {
    LaunchedEffect(Unit) {
        app.sessionManager.startSession()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BloomColors.background)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(280.dp)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            BloomColors.primaryContainer.copy(alpha = 0.55f),
                            BloomColors.background
                        )
                    )
                )
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .pointerInput(Unit) {
                    detectTapGestures(onTap = { app.sessionManager.onUserInteraction() })
                },
            contentPadding = PaddingValues(bottom = 28.dp)
        ) {
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .statusBarsPadding()
                        .padding(horizontal = 18.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(BloomColors.primaryContainer),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                Icons.Outlined.LocalFlorist,
                                contentDescription = null,
                                tint = BloomColors.primary
                            )
                        }
                        Column {
                            Text(
                                text = stringResource(R.string.app_name),
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Bold,
                                color = BloomColors.primary
                            )
                            Text(
                                text = stringResource(R.string.your_sanctuary),
                                fontSize = 11.sp,
                                color = BloomColors.onSurfaceVariant,
                                letterSpacing = 1.sp
                            )
                        }
                    }
                    IconButton(onClick = onSettingsClick) {
                        Icon(
                            Icons.Outlined.Settings,
                            contentDescription = stringResource(R.string.settings_title),
                            tint = BloomColors.primary
                        )
                    }
                }
            }

            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        Column(
                            modifier = Modifier.weight(1.25f),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            SanctuaryBadge(
                                text = stringResource(R.string.sanctuary_badge),
                                containerColor = BloomColors.primaryContainer,
                                contentColor = BloomColors.primary
                            )
                            Text(
                                text = stringResource(R.string.sanctuary_title),
                                fontSize = 36.sp,
                                fontWeight = FontWeight.Bold,
                                color = BloomColors.onSurface
                            )
                            Text(
                                text = stringResource(R.string.sanctuary_hero_body),
                                fontSize = 15.sp,
                                color = BloomColors.onSurfaceVariant,
                                lineHeight = 23.sp
                            )
                        }

                        Column(
                            modifier = Modifier
                                .weight(0.95f)
                                .clip(RoundedCornerShape(24.dp))
                                .background(Color.White.copy(alpha = 0.84f))
                                .border(
                                    1.dp,
                                    BloomColors.outlineVariant.copy(alpha = 0.18f),
                                    RoundedCornerShape(24.dp)
                                )
                                .padding(18.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = stringResource(R.string.sanctuary_quote_label),
                                fontSize = 11.sp,
                                color = BloomColors.primary,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.1.sp
                            )
                            Text(
                                text = stringResource(R.string.sanctuary_quote_text),
                                fontSize = 18.sp,
                                color = BloomColors.onSurface,
                                lineHeight = 26.sp,
                                fontStyle = FontStyle.Italic,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }

            item { Spacer(Modifier.height(18.dp)) }

            item {
                PillarCard(
                    title = stringResource(R.string.mind),
                    description = stringResource(R.string.pillar_mind_desc),
                    iconVector = Icons.Default.Psychology,
                    accentColor = BloomColors.primary,
                    containerColor = BloomColors.primaryContainer,
                    buttonText = stringResource(R.string.pillar_mind_button),
                    onClick = {
                        app.sessionManager.updateQuadrant(WellnessQuadrant.MIND)
                        app.sessionManager.onUserInteraction()
                        onQuadrantClick(BloomRoute.MIND)
                    }
                )
            }

            item {
                PillarCard(
                    title = stringResource(R.string.body),
                    description = stringResource(R.string.pillar_body_desc),
                    iconVector = Icons.Default.FitnessCenter,
                    accentColor = BloomColors.secondary,
                    containerColor = BloomColors.secondaryContainer,
                    buttonText = stringResource(R.string.pillar_body_button),
                    onClick = {
                        app.sessionManager.updateQuadrant(WellnessQuadrant.BODY)
                        app.sessionManager.onUserInteraction()
                        onQuadrantClick(BloomRoute.BODY)
                    }
                )
            }

            item {
                PillarCard(
                    title = stringResource(R.string.soul),
                    description = stringResource(R.string.pillar_soul_desc),
                    iconVector = Icons.Default.AutoAwesome,
                    accentColor = BloomColors.tertiary,
                    containerColor = BloomColors.tertiaryContainer,
                    buttonText = stringResource(R.string.pillar_soul_button),
                    onClick = {
                        app.sessionManager.updateQuadrant(WellnessQuadrant.SOUL)
                        app.sessionManager.onUserInteraction()
                        onQuadrantClick(BloomRoute.SOUL)
                    }
                )
            }

            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    SanctuarySupportCard(
                        title = stringResource(R.string.private_sanctuary_title),
                        body = stringResource(R.string.private_sanctuary_desc),
                        accentColor = BloomColors.secondary,
                        containerColor = BloomColors.secondaryContainer,
                        modifier = Modifier.weight(1f),
                        eyebrow = stringResource(R.string.sanctuary_quote_label)
                    )
                    TalkToBloomCard(
                        modifier = Modifier.weight(1f),
                        onClick = {
                            app.sessionManager.onUserInteraction()
                            onChatClick()
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun PillarCard(
    title: String,
    description: String,
    iconVector: ImageVector,
    accentColor: Color,
    containerColor: Color,
    buttonText: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 7.dp)
            .clip(RoundedCornerShape(26.dp))
            .background(containerColor.copy(alpha = 0.32f))
            .border(1.dp, accentColor.copy(alpha = 0.14f), RoundedCornerShape(26.dp))
            .clickable(onClick = onClick)
            .padding(20.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(58.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(containerColor),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = iconVector,
                contentDescription = null,
                tint = accentColor,
                modifier = Modifier.size(30.dp)
            )
        }

        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = title,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = accentColor
            )
            Text(
                text = description,
                fontSize = 14.sp,
                color = BloomColors.onSurfaceVariant,
                lineHeight = 21.sp
            )
        }

        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(999.dp))
                .background(accentColor)
                .padding(horizontal = 18.dp, vertical = 10.dp)
        ) {
            Text(
                text = buttonText,
                color = Color.White,
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}

@Composable
private fun TalkToBloomCard(
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Row(
        modifier = modifier
            .clip(RoundedCornerShape(22.dp))
            .background(BloomColors.surfaceContainer)
            .border(
                1.dp,
                BloomColors.outlineVariant.copy(alpha = 0.22f),
                RoundedCornerShape(22.dp)
            )
            .clickable(onClick = onClick)
            .padding(18.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .clip(CircleShape)
                .background(BloomColors.primary),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                Icons.Outlined.Chat,
                contentDescription = null,
                tint = BloomColors.onPrimary
            )
        }
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                text = stringResource(R.string.talk_to_bloom),
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = BloomColors.onSurface
            )
            Text(
                text = stringResource(R.string.talk_to_bloom_desc),
                fontSize = 12.sp,
                color = BloomColors.onSurfaceVariant,
                lineHeight = 18.sp
            )
        }
    }
}
