package com.bloom.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val bloomColorScheme = lightColorScheme(
    primary = BloomColors.primary,
    onPrimary = BloomColors.onPrimary,
    primaryContainer = BloomColors.primaryContainer,
    onPrimaryContainer = BloomColors.onPrimaryContainer,
    secondary = BloomColors.secondary,
    onSecondary = BloomColors.onSecondary,
    secondaryContainer = BloomColors.secondaryContainer,
    onSecondaryContainer = BloomColors.onSecondaryContainer,
    tertiary = BloomColors.tertiary,
    onTertiary = BloomColors.onTertiary,
    tertiaryContainer = BloomColors.tertiaryContainer,
    onTertiaryContainer = BloomColors.onTertiaryContainer,
    background = BloomColors.background,
    onBackground = BloomColors.onSurface,
    surface = BloomColors.surface,
    onSurface = BloomColors.onSurface,
    surfaceVariant = BloomColors.surfaceContainer,
    onSurfaceVariant = BloomColors.onSurfaceVariant,
    outline = BloomColors.outline,
    outlineVariant = BloomColors.outlineVariant
)

@Composable
fun BloomTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = bloomColorScheme,
        typography = BloomTypography,
        content = content
    )
}
