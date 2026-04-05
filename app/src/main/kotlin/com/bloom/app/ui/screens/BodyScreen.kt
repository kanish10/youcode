package com.bloom.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.EventSeat
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bloom.app.R
import com.bloom.app.data.models.Exercise
import com.bloom.app.data.models.ExerciseCategory
import com.bloom.app.data.models.ExerciseData
import com.bloom.app.ui.theme.BloomColors

@Composable
fun BodyScreen(
    onBack: () -> Unit,
    onExercise: (Exercise) -> Unit
) {
    var selectedCategory by remember { mutableStateOf<ExerciseCategory?>(null) }

    val displayedExercises = if (selectedCategory == null) {
        ExerciseData.ALL
    } else {
        ExerciseData.ALL.filter { it.category == selectedCategory }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BloomColors.background)
            .statusBarsPadding()
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = stringResource(R.string.back), tint = BloomColors.textPrimary)
            }
            Column {
                Text(
                    text = stringResource(R.string.body),
                    fontWeight = FontWeight.Bold,
                    fontSize = 22.sp,
                    color = BloomColors.textPrimary
                )
                Text(
                    text = stringResource(R.string.body_subtitle),
                    fontSize = 13.sp,
                    color = BloomColors.textSecondary
                )
            }
        }

        // Category filter
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            item {
                FilterChip(
                    label = stringResource(R.string.exercise_filter_all),
                    isSelected = selectedCategory == null,
                    onClick = { selectedCategory = null }
                )
            }
            items(ExerciseCategory.values()) { cat ->
                FilterChip(
                    label = "${cat.emoji} ${cat.displayName}",
                    isSelected = selectedCategory == cat,
                    onClick = { selectedCategory = if (selectedCategory == cat) null else cat }
                )
            }
        }

        // Exercise list
        LazyColumn(
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(displayedExercises, key = { it.id }) { exercise ->
                ExerciseCard(exercise = exercise, onClick = { onExercise(exercise) })
            }
        }
    }
}

@Composable
private fun FilterChip(label: String, isSelected: Boolean, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(if (isSelected) BloomColors.bodyGreen else BloomColors.surface)
            .border(
                width = 1.dp,
                color = if (isSelected) BloomColors.bodyGreen else BloomColors.textTertiary.copy(alpha = 0.3f),
                shape = RoundedCornerShape(20.dp)
            )
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 8.dp)
    ) {
        Text(
            text = label,
            fontSize = 13.sp,
            color = if (isSelected) BloomColors.surface else BloomColors.textSecondary,
            fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
        )
    }
}

@Composable
private fun ExerciseCard(exercise: Exercise, onClick: () -> Unit) {
    val bgColor = when (exercise.category) {
        ExerciseCategory.YOGA, ExerciseCategory.BREATHING -> BloomColors.mindBlueBg
        ExerciseCategory.STRETCHING, ExerciseCategory.STRENGTH -> BloomColors.bodyGreenBg
        ExerciseCategory.DANCE -> BloomColors.soulPinkBg
    }
    val accentColor = when (exercise.category) {
        ExerciseCategory.YOGA, ExerciseCategory.BREATHING -> BloomColors.mindBlue
        ExerciseCategory.STRETCHING, ExerciseCategory.STRENGTH -> BloomColors.bodyGreen
        ExerciseCategory.DANCE -> BloomColors.soulPink
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(bgColor)
            .clickable(onClick = onClick)
            .padding(14.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Box(
            modifier = Modifier
                .size(52.dp)
                .clip(RoundedCornerShape(14.dp))
                .background(accentColor.copy(alpha = 0.2f)),
            contentAlignment = Alignment.Center
        ) {
            Text(exercise.emoji, fontSize = 24.sp)
        }
        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(3.dp)) {
            Text(exercise.name, fontWeight = FontWeight.SemiBold, fontSize = 15.sp, color = BloomColors.textPrimary)
            Text(exercise.desc, fontSize = 12.sp, color = BloomColors.textSecondary, lineHeight = 16.sp, maxLines = 2)
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                MiniTag("${exercise.durationMin} min", accentColor)
                MiniTag(exercise.difficulty.label, accentColor)
                if (exercise.isSeated) {
                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(accentColor.copy(alpha = 0.1f))
                            .padding(horizontal = 5.dp, vertical = 2.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(2.dp)
                    ) {
                        Icon(Icons.Default.EventSeat, contentDescription = null, tint = accentColor, modifier = Modifier.size(10.dp))
                        Text(stringResource(R.string.exercise_seated), fontSize = 9.sp, color = accentColor)
                    }
                }
            }
        }
    }
}

@Composable
private fun MiniTag(text: String, color: Color) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(color.copy(alpha = 0.1f))
            .padding(horizontal = 6.dp, vertical = 2.dp)
    ) {
        Text(text, fontSize = 10.sp, color = color, fontWeight = FontWeight.Medium)
    }
}
