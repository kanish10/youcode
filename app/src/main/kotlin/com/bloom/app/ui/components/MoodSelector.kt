package com.bloom.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.bloom.app.data.models.Mood
import com.bloom.app.ui.theme.BloomColors

@Composable
fun MoodSelector(
    selected: Mood?,
    onSelect: (Mood) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Mood.values().forEach { mood ->
            Text(
                text = mood.emoji,
                modifier = Modifier
                    .background(
                        color = if (selected == mood) BloomColors.connectAmberBg else BloomColors.surface,
                        shape = RoundedCornerShape(12.dp)
                    )
                    .clickable { onSelect(mood) }
                    .padding(horizontal = 10.dp, vertical = 8.dp),
                fontWeight = if (selected == mood) FontWeight.Bold else FontWeight.Normal
            )
        }
    }
}
