package com.bloom.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import com.bloom.app.data.models.Flower
import com.bloom.app.data.models.WellnessQuadrant
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

        // Soft soil at bottom (transparent above so parent gradient shows)
        drawRect(
            color = BloomColors.soil.copy(alpha = 0.25f),
            topLeft = Offset(0f, height * 0.82f),
            size = androidx.compose.ui.geometry.Size(width, height * 0.18f)
        )

        // Grass line
        drawLine(
            color = BloomColors.sageGreen.copy(alpha = 0.35f),
            start = Offset(0f, height * 0.82f),
            end = Offset(width, height * 0.82f),
            strokeWidth = 2.5f
        )

        val total = flowers.take(60).ifEmpty {
            listOf(Flower(0, flowers.firstOrNull()?.quadrant ?: WellnessQuadrant.MIND, 0, "#8FA89B"))
        }
        total.forEachIndexed { index, flower ->
            val x = ((index + 1f) / (total.size + 1f)) * width
            val sway = (sin((index + 1) * 0.8) * 5f).toFloat()
            val stemTop = height * 0.68f - (index % 3) * 14f
            val bloomCenter = Offset(x + sway, stemTop)

            // Stem
            drawLine(
                color = BloomColors.sageGreen.copy(alpha = 0.5f),
                start = Offset(x, height * 0.82f),
                end = bloomCenter,
                strokeWidth = 6f,
                cap = StrokeCap.Round
            )

            // Bloom
            val c = runCatching { Color(android.graphics.Color.parseColor(flower.colorHex)) }
                .getOrDefault(BloomColors.sageGreen)
            drawCircle(color = c, radius = 30f, center = bloomCenter)
            drawCircle(color = Color.White.copy(alpha = 0.45f), radius = 11f, center = bloomCenter)
        }
    }
}
