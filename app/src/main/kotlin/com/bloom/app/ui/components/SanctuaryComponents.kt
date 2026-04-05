package com.bloom.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bloom.app.ui.theme.BloomColors

@Composable
fun SanctuaryBadge(
    text: String,
    containerColor: Color,
    contentColor: Color,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .background(containerColor, RoundedCornerShape(999.dp))
            .padding(horizontal = 14.dp, vertical = 7.dp)
    ) {
        Text(
            text = text,
            color = contentColor,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 1.2.sp
        )
    }
}

@Composable
fun SanctuaryHeroCard(
    badge: String,
    title: String,
    body: String,
    accentColor: Color,
    badgeContainer: Color,
    modifier: Modifier = Modifier,
    trailing: (@Composable () -> Unit)? = null
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(Color.White.copy(alpha = 0.9f), RoundedCornerShape(28.dp))
            .border(
                width = 1.dp,
                color = BloomColors.outlineVariant.copy(alpha = 0.18f),
                shape = RoundedCornerShape(28.dp)
            )
            .padding(24.dp),
        horizontalArrangement = Arrangement.spacedBy(18.dp),
        verticalAlignment = Alignment.Top
    ) {
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            SanctuaryBadge(
                text = badge,
                containerColor = badgeContainer,
                contentColor = accentColor
            )
            Text(
                text = title,
                fontSize = 30.sp,
                fontWeight = FontWeight.Bold,
                color = BloomColors.onSurface,
                lineHeight = 36.sp
            )
            Text(
                text = body,
                fontSize = 15.sp,
                color = BloomColors.onSurfaceVariant,
                lineHeight = 23.sp
            )
        }

        if (trailing != null) {
            Box(
                modifier = Modifier
                    .background(
                        accentColor.copy(alpha = 0.08f),
                        RoundedCornerShape(24.dp)
                    )
                    .padding(16.dp)
            ) {
                trailing()
            }
        }
    }
}

@Composable
fun SanctuaryActionCard(
    title: String,
    subtitle: String,
    icon: ImageVector,
    accentColor: Color,
    containerColor: Color,
    onClick: (() -> Unit)?,
    modifier: Modifier = Modifier,
    eyebrow: String? = null,
    metadata: String? = null
) {
    val clickableModifier = if (onClick != null) {
        Modifier.clickable(onClick = onClick)
    } else {
        Modifier
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(containerColor.copy(alpha = 0.34f), RoundedCornerShape(24.dp))
            .border(
                width = 1.dp,
                color = accentColor.copy(alpha = 0.16f),
                shape = RoundedCornerShape(24.dp)
            )
            .then(clickableModifier)
            .padding(18.dp),
        horizontalArrangement = Arrangement.spacedBy(14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(54.dp)
                .background(containerColor, RoundedCornerShape(18.dp)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = accentColor,
                modifier = Modifier.size(28.dp)
            )
        }

        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            if (eyebrow != null) {
                Text(
                    text = eyebrow,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = accentColor,
                    letterSpacing = 1.1.sp
                )
            }
            Text(
                text = title,
                fontSize = 19.sp,
                fontWeight = FontWeight.SemiBold,
                color = BloomColors.onSurface
            )
            Text(
                text = subtitle,
                fontSize = 13.sp,
                color = BloomColors.onSurfaceVariant,
                lineHeight = 19.sp,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis
            )
            if (metadata != null) {
                Text(
                    text = metadata,
                    fontSize = 11.sp,
                    color = accentColor,
                    fontWeight = FontWeight.Medium
                )
            }
        }

        if (onClick != null) {
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .background(Color.White.copy(alpha = 0.86f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                    contentDescription = null,
                    tint = accentColor
                )
            }
        }
    }
}

@Composable
fun SanctuarySupportCard(
    title: String,
    body: String,
    accentColor: Color,
    containerColor: Color,
    modifier: Modifier = Modifier,
    eyebrow: String? = null,
    italic: Boolean = false
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(containerColor.copy(alpha = 0.26f), RoundedCornerShape(22.dp))
            .border(
                width = 1.dp,
                color = accentColor.copy(alpha = 0.12f),
                shape = RoundedCornerShape(22.dp)
            )
            .padding(18.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        if (eyebrow != null) {
            Text(
                text = eyebrow,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = accentColor,
                letterSpacing = 1.1.sp
            )
        }
        Text(
            text = title,
            fontSize = 18.sp,
            fontWeight = FontWeight.SemiBold,
            color = BloomColors.onSurface
        )
        Text(
            text = body,
            fontSize = 13.sp,
            color = BloomColors.onSurfaceVariant,
            lineHeight = 19.sp,
            fontStyle = if (italic) FontStyle.Italic else FontStyle.Normal
        )
    }
}
