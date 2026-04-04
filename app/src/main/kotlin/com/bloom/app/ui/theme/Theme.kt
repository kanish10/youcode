package com.bloom.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val bloomColorScheme = lightColorScheme(
    primary = BloomColors.mindBlue,
    secondary = BloomColors.bodyGreen,
    tertiary = BloomColors.soulPink,
    background = BloomColors.background,
    surface = BloomColors.surface,
    onPrimary = BloomColors.textPrimary,
    onSecondary = BloomColors.textPrimary,
    onTertiary = BloomColors.textPrimary,
    onBackground = BloomColors.textPrimary,
    onSurface = BloomColors.textPrimary
)

@Composable
fun BloomTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = bloomColorScheme,
        typography = BloomTypography,
        content = content
    )
}
