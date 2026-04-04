package com.bloom.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import com.bloom.app.data.models.Flower
import com.bloom.app.ui.theme.BloomColors
import kotlin.math.sin

@Composable
fun FlowerGarden(
    flowers: List<Flower>,
    modifier: Modifier = Modifier
) {
    Canvas(modifier = modifier.fillMaxSize()) {
        val width = size.width
        val height = size.height

        drawRect(color = BloomColors.gardenGreen)
        drawRect(
            color = BloomColors.soil,
            topLeft = Offset(0f, height * 0.82f),
            size = androidx.compose.ui.geometry.Size(width, height * 0.18f)
        )

        val total = flowers.take(60).ifEmpty { listOf(Flower(0, flowers.firstOrNull()?.quadrant ?: com.bloom.app.data.models.WellnessQuadrant.MIND, 0, "#7EB8E0")) }
        total.forEachIndexed { index, flower ->
            val x = ((index + 1f) / (total.size + 1f)) * width
            val sway = (sin((index + 1) * 0.8) * 5f).toFloat()
            val stemTop = height * 0.72f - (index % 3) * 10f
            val bloomCenter = Offset(x + sway, stemTop)
            drawLine(
                color = BloomColors.soil,
                start = Offset(x, height * 0.82f),
                end = bloomCenter,
                strokeWidth = 5f,
                cap = StrokeCap.Round
            )
            val c = runCatching { Color(android.graphics.Color.parseColor(flower.colorHex)) }
                .getOrDefault(BloomColors.mindBlue)
            drawCircle(color = c, radius = 16f, center = bloomCenter)
            drawCircle(color = Color.White.copy(alpha = 0.45f), radius = 6f, center = bloomCenter)
        }
    }
}
