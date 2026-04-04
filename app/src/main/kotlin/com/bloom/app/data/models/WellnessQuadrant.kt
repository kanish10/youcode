package com.bloom.app.data.models

import androidx.annotation.StringRes
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import com.bloom.app.R
import com.bloom.app.ui.theme.BloomColors

enum class WellnessQuadrant(
    val label: String,
    val emoji: String,
    val color: Color,
    val backgroundColor: Color,
    val colorHex: String,
    @StringRes val labelResId: Int
) {
    MIND("Mind", "🧠", BloomColors.mindBlue, BloomColors.mindBlueBg, "#7EB8E0", R.string.mind),
    BODY("Body", "🏃‍♀️", BloomColors.bodyGreen, BloomColors.bodyGreenBg, "#8BC6A3", R.string.body),
    SOUL("Soul", "✨", BloomColors.soulPink, BloomColors.soulPinkBg, "#E4A0B7", R.string.soul),
    CONNECT("Connect", "🤝", BloomColors.connectAmber, BloomColors.connectAmberBg, "#E8C170", R.string.connect);

    @Composable
    fun localizedLabel(): String = stringResource(labelResId)
}
