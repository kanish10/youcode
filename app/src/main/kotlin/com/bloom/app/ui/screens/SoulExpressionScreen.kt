package com.bloom.app.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Draw
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.filled.Undo
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.data.models.WellnessQuadrant
import com.bloom.app.ui.components.SanctuaryBadge
import com.bloom.app.ui.theme.BloomColors
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private data class DrawnStroke(val points: List<Offset>, val color: Color, val strokeWidth: Float)

@Composable
fun SoulExpressionScreen(
    app: BloomApp,
    onDone: () -> Unit
) {
    val scope = rememberCoroutineScope()
    val language by app.languageManager.currentLanguage.collectAsState()
    var affirmation by remember { mutableStateOf("") }
    var timerSeconds by remember { mutableIntStateOf(0) }
    var timerRunning by remember { mutableStateOf(false) }
    val strokes = remember { mutableStateListOf<DrawnStroke>() }
    var currentPoints = remember { mutableStateListOf<Offset>() }
    var selectedColor by remember { mutableStateOf(BloomColors.primary) }
    var brushSize by remember { mutableStateOf(8f) }

    val paletteColors = listOf(
        BloomColors.primary,
        BloomColors.secondary,
        BloomColors.tertiary,
        Color(0xFF2D443A),
        Color(0xFF473E34),
        BloomColors.onSurface
    )

    DisposableEffect(Unit) {
        app.sessionManager.pauseInactivityTimer()
        onDispose { app.sessionManager.resumeInactivityTimer() }
    }

    LaunchedEffect(Unit) {
        affirmation = app.wellnessAI.getGroqResponse(
            userMessage = "affirmation",
            language = language,
            additionalContext = app.wellnessAI.buildAffirmationMessage()
        ) ?: "You carry strength that you have not yet fully discovered."
    }

    LaunchedEffect(timerRunning) {
        if (timerRunning) {
            while (timerRunning) {
                delay(1000)
                timerSeconds++
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BloomColors.background)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 0.dp)
                .aspectRatio(1.5f)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            BloomColors.tertiaryContainer.copy(alpha = 0.58f),
                            BloomColors.background
                        )
                    )
                )
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .verticalScroll(rememberScrollState())
                .navigationBarsPadding()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onDone) {
                    Icon(
                        Icons.Default.Close,
                        contentDescription = stringResource(R.string.close),
                        tint = BloomColors.textSecondary
                    )
                }
                SanctuaryBadge(
                    text = stringResource(R.string.soul_expression_title),
                    containerColor = BloomColors.tertiaryContainer,
                    contentColor = BloomColors.tertiary
                )
                Button(
                    onClick = {
                        scope.launch {
                            app.gardenRepository.addFlower(WellnessQuadrant.SOUL)
                            app.supabaseClient.logActivity(
                                "soul",
                                "soul_expression",
                                timerSeconds,
                                true
                            )
                            app.supabaseClient.addFlower(
                                "soul",
                                WellnessQuadrant.SOUL.colorHex
                            )
                            onDone()
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = BloomColors.primary),
                    shape = RoundedCornerShape(999.dp)
                ) {
                    Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                    Text(
                        text = stringResource(R.string.done),
                        modifier = Modifier.padding(start = 6.dp),
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }

            Column(
                modifier = Modifier.padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(28.dp))
                        .background(BloomColors.tertiaryContainer.copy(alpha = 0.84f))
                        .border(
                            1.dp,
                            BloomColors.tertiary.copy(alpha = 0.14f),
                            RoundedCornerShape(28.dp)
                        )
                        .padding(24.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text(
                            text = stringResource(R.string.affirmation_title),
                            fontSize = 11.sp,
                            color = BloomColors.tertiary,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.1.sp
                        )
                        Text(
                            text = if (affirmation.isNotBlank()) "\"$affirmation\"" else "…",
                            fontSize = 24.sp,
                            fontStyle = FontStyle.Italic,
                            lineHeight = 33.sp,
                            color = BloomColors.onTertiaryContainer,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(28.dp))
                        .background(Color.White.copy(alpha = 0.92f))
                        .border(
                            1.dp,
                            BloomColors.outlineVariant.copy(alpha = 0.18f),
                            RoundedCornerShape(28.dp)
                        )
                        .padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text(
                                text = stringResource(R.string.soul_doodle_title),
                                fontSize = 22.sp,
                                fontWeight = FontWeight.Bold,
                                color = BloomColors.onSurface
                            )
                            Text(
                                text = stringResource(R.string.canvas_subtitle),
                                fontSize = 13.sp,
                                color = BloomColors.onSurfaceVariant
                            )
                        }

                        Row(
                            modifier = Modifier
                                .clip(RoundedCornerShape(999.dp))
                                .background(BloomColors.surfaceContainer)
                                .padding(horizontal = 14.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Timer,
                                contentDescription = null,
                                tint = BloomColors.tertiary,
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = "%d:%02d".format(timerSeconds / 60, timerSeconds % 60),
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = BloomColors.onSurface
                            )
                        }
                    }

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .aspectRatio(1f)
                            .clip(RoundedCornerShape(24.dp))
                            .background(Color.White)
                            .border(
                                1.dp,
                                BloomColors.outlineVariant.copy(alpha = 0.22f),
                                RoundedCornerShape(24.dp)
                            )
                    ) {
                        Canvas(
                            modifier = Modifier
                                .fillMaxSize()
                                .pointerInput(selectedColor, brushSize) {
                                    detectDragGestures(
                                        onDragStart = { offset ->
                                            currentPoints.clear()
                                            currentPoints.add(offset)
                                            if (!timerRunning) timerRunning = true
                                        },
                                        onDrag = { change, _ ->
                                            currentPoints.add(change.position)
                                        },
                                        onDragEnd = {
                                            if (currentPoints.size > 1) {
                                                strokes.add(
                                                    DrawnStroke(
                                                        currentPoints.toList(),
                                                        selectedColor,
                                                        brushSize
                                                    )
                                                )
                                            }
                                            currentPoints.clear()
                                        }
                                    )
                                }
                        ) {
                            strokes.forEach { stroke ->
                                if (stroke.points.size > 1) {
                                    val path = Path().apply {
                                        moveTo(stroke.points.first().x, stroke.points.first().y)
                                        stroke.points.drop(1).forEach { point ->
                                            lineTo(point.x, point.y)
                                        }
                                    }
                                    drawPath(
                                        path = path,
                                        color = stroke.color,
                                        style = Stroke(
                                            width = stroke.strokeWidth,
                                            cap = StrokeCap.Round,
                                            join = StrokeJoin.Round
                                        )
                                    )
                                }
                            }

                            if (currentPoints.size > 1) {
                                val path = Path().apply {
                                    moveTo(currentPoints.first().x, currentPoints.first().y)
                                    currentPoints.drop(1).forEach { point ->
                                        lineTo(point.x, point.y)
                                    }
                                }
                                drawPath(
                                    path = path,
                                    color = selectedColor,
                                    style = Stroke(
                                        width = brushSize,
                                        cap = StrokeCap.Round,
                                        join = StrokeJoin.Round
                                    )
                                )
                            }
                        }

                        if (strokes.isEmpty() && currentPoints.isEmpty()) {
                            Column(
                                modifier = Modifier.align(Alignment.Center),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Draw,
                                    contentDescription = null,
                                    tint = BloomColors.outline,
                                    modifier = Modifier.size(36.dp)
                                )
                                Text(
                                    text = stringResource(R.string.soul_expression_placeholder),
                                    fontSize = 13.sp,
                                    color = BloomColors.onSurfaceVariant
                                )
                            }
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            paletteColors.forEach { color ->
                                Box(
                                    modifier = Modifier
                                        .size(32.dp)
                                        .clip(CircleShape)
                                        .background(color)
                                        .then(
                                            if (selectedColor == color) {
                                                Modifier.border(
                                                    3.dp,
                                                    BloomColors.onSurface,
                                                    CircleShape
                                                )
                                            } else {
                                                Modifier
                                            }
                                        )
                                        .clickable { selectedColor = color }
                                )
                            }
                        }

                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            IconButton(
                                onClick = {
                                    if (strokes.isNotEmpty()) {
                                        strokes.removeAt(strokes.lastIndex)
                                    }
                                }
                            ) {
                                Icon(
                                    Icons.Default.Undo,
                                    contentDescription = stringResource(R.string.soul_undo),
                                    tint = BloomColors.textSecondary
                                )
                            }
                            IconButton(onClick = { strokes.clear() }) {
                                Icon(
                                    Icons.Default.Delete,
                                    contentDescription = stringResource(R.string.soul_clear),
                                    tint = BloomColors.textSecondary
                                )
                            }
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = stringResource(R.string.soul_brush_size),
                            fontSize = 12.sp,
                            color = BloomColors.textSecondary
                        )
                        listOf(4f to "S", 8f to "M", 16f to "L").forEach { (size, label) ->
                            Box(
                                modifier = Modifier
                                    .size(34.dp)
                                    .clip(CircleShape)
                                    .background(
                                        if (brushSize == size) {
                                            BloomColors.primaryContainer
                                        } else {
                                            BloomColors.surfaceContainer
                                        }
                                    )
                                    .border(
                                        1.dp,
                                        if (brushSize == size) BloomColors.primary else BloomColors.outlineVariant,
                                        CircleShape
                                    )
                                    .clickable { brushSize = size },
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = label,
                                    fontSize = 11.sp,
                                    color = if (brushSize == size) BloomColors.primary else BloomColors.textSecondary
                                )
                            }
                        }
                    }
                }

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 20.dp),
                    horizontalArrangement = Arrangement.Center
                ) {
                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(999.dp))
                            .background(BloomColors.surfaceContainer)
                            .padding(horizontal = 18.dp, vertical = 10.dp),
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = stringResource(R.string.soul_expression_private),
                            fontSize = 11.sp,
                            color = BloomColors.onSurfaceVariant,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = stringResource(R.string.soul_expression_local),
                            fontSize = 11.sp,
                            color = BloomColors.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}
