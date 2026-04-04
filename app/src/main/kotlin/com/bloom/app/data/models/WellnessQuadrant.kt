package com.bloom.app.data.models

import androidx.compose.ui.graphics.Color
import com.bloom.app.ui.theme.BloomColors

enum class WellnessQuadrant(
    val label: String,
    val emoji: String,
    val color: Color,
    val backgroundColor: Color,
    val colorHex: String
) {
    MIND("Mind", "🧠", BloomColors.mindBlue, BloomColors.mindBlueBg, "#7EB8E0"),
    BODY("Body", "🏃‍♀️", BloomColors.bodyGreen, BloomColors.bodyGreenBg, "#8BC6A3"),
    SOUL("Soul", "✨", BloomColors.soulPink, BloomColors.soulPinkBg, "#E4A0B7"),
    CONNECT("Connect", "🤝", BloomColors.connectAmber, BloomColors.connectAmberBg, "#E8C170")
}
