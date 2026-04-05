package com.bloom.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.data.models.Whisper
import com.bloom.app.ui.theme.BloomColors
import kotlinx.coroutines.launch

private val seedWhispers = listOf(
    Whisper("1", "Today I found peace in the way the morning light hit the kitchen table. It felt like a small, quiet miracle.", resonanceCount = 12, timeAgo = "2h ago"),
    Whisper("2", "Healing isn't a straight line. Some days I take three steps back, and that has to be okay.", resonanceCount = 28, heartCount = 5, timeAgo = "5h ago"),
    Whisper("3", "To the person who left the note by the garden gate: Thank you. You saved my afternoon.", resonanceCount = 7, timeAgo = "8h ago"),
    Whisper("4", "Missing home today. But building a new one here, brick by brick.", resonanceCount = 15, timeAgo = "Yesterday"),
    Whisper("5", "I finished a book today for the first time in months. Small steps still count.", resonanceCount = 22, heartCount = 9, timeAgo = "Yesterday")
)

@Composable
fun ConnectionSpaceScreen(app: BloomApp) {
    val scope = rememberCoroutineScope()
    val whispers = remember { mutableStateListOf<Whisper>().apply { addAll(seedWhispers) } }
    var showPostDialog by remember { mutableStateOf(false) }
    var newWhisperText by remember { mutableStateOf("") }
    var isPosting by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        scope.launch {
            val remote = app.supabaseClient.fetchGratitudeNotes()
            if (remote.isNotEmpty()) {
                whispers.clear()
                whispers.addAll(remote)
            }
        }
    }

    Scaffold(
        containerColor = BloomColors.background,
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showPostDialog = true },
                containerColor = BloomColors.bodyGreen,
                contentColor = BloomColors.surface,
                shape = CircleShape,
                modifier = Modifier.navigationBarsPadding()
            ) {
                Icon(Icons.Default.Add, contentDescription = stringResource(R.string.connect_post_whisper))
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .statusBarsPadding(),
            contentPadding = PaddingValues(bottom = 80.dp)
        ) {
            // Header
            item {
                Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 20.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = stringResource(R.string.connect_title),
                            fontSize = 26.sp,
                            fontWeight = FontWeight.Bold,
                            color = BloomColors.textPrimary
                        )
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(BloomColors.connectAmberBg)
                                .padding(horizontal = 8.dp, vertical = 3.dp)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Icon(Icons.Outlined.Lock, contentDescription = null, tint = BloomColors.connectAmber, modifier = Modifier.size(12.dp))
                                Text(
                                    text = stringResource(R.string.connect_anonymous),
                                    fontSize = 10.sp,
                                    color = BloomColors.connectAmber,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }
                    Text(
                        text = stringResource(R.string.connect_subtitle),
                        fontSize = 14.sp,
                        color = BloomColors.textSecondary,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
            }

            items(whispers, key = { it.id }) { whisper ->
                WhisperCard(
                    whisper = whisper,
                    onResonate = {
                        val idx = whispers.indexOfFirst { it.id == whisper.id }
                        if (idx >= 0) {
                            whispers[idx] = whisper.copy(resonanceCount = whisper.resonanceCount + 1)
                            scope.launch { app.supabaseClient.reactToGratitudeNote(whisper.id) }
                        }
                    }
                )
            }

            item { Spacer(Modifier.height(24.dp)) }
        }
    }

    if (showPostDialog) {
        AlertDialog(
            onDismissRequest = { if (!isPosting) showPostDialog = false },
            containerColor = BloomColors.surface,
            title = {
                Text(
                    stringResource(R.string.connect_post_title),
                    fontWeight = FontWeight.SemiBold,
                    color = BloomColors.textPrimary
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        stringResource(R.string.connect_post_hint),
                        fontSize = 13.sp,
                        color = BloomColors.textSecondary
                    )
                    OutlinedTextField(
                        value = newWhisperText,
                        onValueChange = { if (it.length <= 280) newWhisperText = it },
                        placeholder = { Text(stringResource(R.string.connect_post_placeholder), color = BloomColors.textTertiary) },
                        minLines = 3,
                        maxLines = 6,
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = BloomColors.connectAmber,
                            unfocusedBorderColor = BloomColors.textTertiary.copy(alpha = 0.3f)
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )
                    Text(
                        "${newWhisperText.length}/280",
                        fontSize = 11.sp,
                        color = BloomColors.textTertiary,
                        modifier = Modifier.align(Alignment.End)
                    )
                }
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        if (newWhisperText.isNotBlank() && !isPosting) {
                            isPosting = true
                            val newWhisper = Whisper(
                                id = System.currentTimeMillis().toString(),
                                content = newWhisperText.trim(),
                                resonanceCount = 0,
                                timeAgo = "just now",
                                isLocal = true
                            )
                            whispers.add(0, newWhisper)
                            scope.launch {
                                app.supabaseClient.postGratitudeNote(newWhisperText.trim())
                                isPosting = false
                                showPostDialog = false
                                newWhisperText = ""
                            }
                        }
                    },
                    enabled = newWhisperText.isNotBlank() && !isPosting
                ) {
                    Text(
                        if (isPosting) stringResource(R.string.connect_posting) else stringResource(R.string.connect_share),
                        color = BloomColors.bodyGreen
                    )
                }
            },
            dismissButton = {
                TextButton(onClick = { showPostDialog = false; newWhisperText = "" }) {
                    Text(stringResource(R.string.back), color = BloomColors.textSecondary)
                }
            }
        )
    }
}

@Composable
private fun WhisperCard(whisper: Whisper, onResonate: () -> Unit) {
    var localResonated by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 5.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(BloomColors.surface)
            .border(1.dp, BloomColors.textTertiary.copy(alpha = 0.12f), RoundedCornerShape(16.dp))
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Text(
            text = "\"${whisper.content}\"",
            fontSize = 14.sp,
            color = BloomColors.textPrimary,
            lineHeight = 21.sp
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(whisper.timeAgo, fontSize = 11.sp, color = BloomColors.textTertiary)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                ReactionButton(
                    emoji = "🌸",
                    count = whisper.resonanceCount + (if (localResonated) 0 else 0),
                    active = localResonated,
                    onClick = {
                        if (!localResonated) {
                            localResonated = true
                            onResonate()
                        }
                    }
                )
                if (whisper.heartCount > 0) {
                    ReactionButton(emoji = "💙", count = whisper.heartCount, active = false, onClick = {})
                }
            }
        }
    }
}

@Composable
private fun ReactionButton(emoji: String, count: Int, active: Boolean, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(if (active) BloomColors.bodyGreenBg else BloomColors.background)
            .border(1.dp, if (active) BloomColors.bodyGreen.copy(alpha = 0.4f) else BloomColors.textTertiary.copy(alpha = 0.2f), RoundedCornerShape(20.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 10.dp, vertical = 5.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Text(emoji, fontSize = 12.sp)
        Text(
            "$count",
            fontSize = 12.sp,
            color = if (active) BloomColors.bodyGreen else BloomColors.textSecondary,
            fontWeight = if (active) FontWeight.SemiBold else FontWeight.Normal
        )
    }
}
