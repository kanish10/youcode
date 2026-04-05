package com.bloom.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material.icons.outlined.LocalFlorist
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.data.models.ChatMessage
import com.bloom.app.ui.theme.BloomColors
import kotlinx.coroutines.launch

@Composable
fun ChatScreen(
    app: BloomApp,
    onBack: () -> Unit
) {
    val language by app.languageManager.currentLanguage.collectAsState()
    val messages = remember { mutableStateListOf<ChatMessage>() }
    var inputText by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var isRecording by remember { mutableStateOf(false) }
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    val startRecording: () -> Unit = {
        scope.launch {
            isRecording = true
            val result = app.voiceService.recordAndTranscribe(
                currentLanguage = language,
                durationMs = 8_000
            )
            isRecording = false
            if (result != null && result.text.isNotBlank()) {
                inputText = result.text
            }
        }
    }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) startRecording()
    }

    LaunchedEffect(Unit) {
        messages.add(
            ChatMessage(
                content = app.wellnessAI.getGroqResponse(
                    userMessage = "greeting",
                    language = language,
                    additionalContext = "The user just opened the chat. Greet them warmly and invite them to share how they're feeling or what they'd like to explore today. Keep it to 2 sentences."
                ) ?: "Hi, I'm Bloom. I'm here for you today — what's on your heart?",
                isFromUser = false
            )
        )
    }

    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) {
            listState.animateScrollToItem(messages.lastIndex)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BloomColors.background)
            .imePadding()
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(BloomColors.surface)
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(BloomColors.bodyGreenBg),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Outlined.LocalFlorist,
                        contentDescription = null,
                        tint = BloomColors.sageGreen,
                        modifier = Modifier.size(22.dp)
                    )
                }
                Column {
                    Text(
                        text = stringResource(R.string.chat_bloom_name),
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 16.sp,
                        color = BloomColors.textPrimary
                    )
                    Text(
                        text = stringResource(R.string.chat_bloom_subtitle),
                        fontSize = 12.sp,
                        color = BloomColors.textSecondary
                    )
                }
            }
            IconButton(onClick = onBack) {
                Icon(Icons.Default.Close, contentDescription = stringResource(R.string.close), tint = BloomColors.textSecondary)
            }
        }

        // Messages
        LazyColumn(
            state = listState,
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            reverseLayout = false
        ) {
            item { Box(modifier = Modifier.padding(top = 8.dp)) }
            items(messages) { msg ->
                ChatBubble(message = msg)
            }
            if (isLoading) {
                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.Start
                    ) {
                        Box(
                            modifier = Modifier
                                .background(BloomColors.surface, RoundedCornerShape(16.dp, 16.dp, 16.dp, 4.dp))
                                .padding(12.dp)
                        ) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(18.dp),
                                strokeWidth = 2.dp,
                                color = BloomColors.bodyGreen
                            )
                        }
                    }
                }
            }
            item { Box(modifier = Modifier.padding(bottom = 4.dp)) }
        }

        // Input area
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(BloomColors.surface)
                .navigationBarsPadding()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = inputText,
                onValueChange = { inputText = it },
                modifier = Modifier.weight(1f),
                placeholder = {
                    Text(
                        if (isRecording) stringResource(R.string.chat_recording)
                        else stringResource(R.string.chat_placeholder),
                        color = if (isRecording) BloomColors.bodyGreen else BloomColors.textTertiary
                    )
                },
                shape = RoundedCornerShape(24.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = BloomColors.bodyGreen,
                    unfocusedBorderColor = BloomColors.textTertiary.copy(alpha = 0.4f),
                    focusedContainerColor = BloomColors.background,
                    unfocusedContainerColor = BloomColors.background
                ),
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                keyboardActions = KeyboardActions(onSend = {
                    if (inputText.isNotBlank() && !isLoading) {
                        sendMessage(inputText, messages, app, language, scope) { isLoading = it }
                        inputText = ""
                    }
                }),
                maxLines = 4,
                enabled = !isRecording
            )

            // Voice button
            if (isRecording) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFE53935)),
                    contentAlignment = Alignment.Center
                ) {
                    IconButton(onClick = { app.voiceService.stopRecording() }) {
                        Icon(
                            Icons.Default.Stop,
                            contentDescription = stringResource(R.string.chat_stop_recording),
                            tint = BloomColors.surface,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                }
            } else if (inputText.isBlank() && !isLoading) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(BloomColors.bodyGreen),
                    contentAlignment = Alignment.Center
                ) {
                    IconButton(onClick = {
                        val hasPermission = ContextCompat.checkSelfPermission(
                            context, Manifest.permission.RECORD_AUDIO
                        ) == PackageManager.PERMISSION_GRANTED
                        if (hasPermission) {
                            startRecording()
                        } else {
                            permissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
                        }
                    }) {
                        Icon(
                            Icons.Default.Mic,
                            contentDescription = stringResource(R.string.chat_voice),
                            tint = BloomColors.surface,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                }
            } else {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(if (inputText.isBlank() || isLoading) BloomColors.textTertiary.copy(alpha = 0.3f) else BloomColors.bodyGreen),
                    contentAlignment = Alignment.Center
                ) {
                    IconButton(
                        onClick = {
                            if (inputText.isNotBlank() && !isLoading) {
                                sendMessage(inputText, messages, app, language, scope) { isLoading = it }
                                inputText = ""
                            }
                        },
                        enabled = inputText.isNotBlank() && !isLoading
                    ) {
                        Icon(
                            Icons.AutoMirrored.Filled.Send,
                            contentDescription = stringResource(R.string.chat_send),
                            tint = if (inputText.isBlank() || isLoading) BloomColors.textTertiary else BloomColors.surface,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
        }
    }
}

private fun sendMessage(
    text: String,
    messages: MutableList<ChatMessage>,
    app: BloomApp,
    language: String,
    scope: kotlinx.coroutines.CoroutineScope,
    setLoading: (Boolean) -> Unit
) {
    val userMessage = ChatMessage(content = text.trim(), isFromUser = true)
    messages.add(userMessage)
    setLoading(true)
    scope.launch {
        val response = app.wellnessAI.getGroqResponse(
            userMessage = text.trim(),
            language = language,
            additionalContext = "Keep response warm, concise (2–4 sentences), and trauma-informed. Validate feelings first."
        )
        messages.add(
            ChatMessage(
                content = response ?: app.wellnessAI.getFallback(language),
                isFromUser = false
            )
        )
        setLoading(false)
    }
}

@Composable
private fun ChatBubble(message: ChatMessage) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = if (message.isFromUser) Arrangement.End else Arrangement.Start
    ) {
        if (!message.isFromUser) {
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .clip(CircleShape)
                    .background(BloomColors.bodyGreenBg),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Outlined.LocalFlorist,
                    contentDescription = null,
                    tint = BloomColors.sageGreen,
                    modifier = Modifier.size(16.dp)
                )
            }
        }
        Box(
            modifier = Modifier
                .widthIn(max = 280.dp)
                .padding(horizontal = 4.dp)
                .background(
                    color = if (message.isFromUser) BloomColors.bodyGreen else BloomColors.surface,
                    shape = if (message.isFromUser)
                        RoundedCornerShape(16.dp, 16.dp, 4.dp, 16.dp)
                    else
                        RoundedCornerShape(16.dp, 16.dp, 16.dp, 4.dp)
                )
                .padding(horizontal = 14.dp, vertical = 10.dp)
        ) {
            Text(
                text = message.content,
                color = if (message.isFromUser) BloomColors.surface else BloomColors.textPrimary,
                fontSize = 14.sp,
                lineHeight = 20.sp
            )
        }
    }
}
