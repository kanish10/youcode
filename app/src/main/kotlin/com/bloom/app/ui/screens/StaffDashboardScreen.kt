package com.bloom.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.runtime.collectAsState
import androidx.compose.foundation.border
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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.ui.theme.BloomColors
import com.bloom.app.util.Constants

@Composable
fun StaffDashboardScreen(app: BloomApp, onBack: () -> Unit) {
    var pin by remember { mutableStateOf("") }
    var unlocked by remember { mutableStateOf(false) }
    var pinError by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BloomColors.background)
            .statusBarsPadding()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = stringResource(R.string.back), tint = BloomColors.textPrimary)
            }
            Text(
                text = stringResource(R.string.staff_dashboard),
                fontWeight = FontWeight.Bold,
                fontSize = 20.sp,
                color = BloomColors.textPrimary
            )
        }

        if (!unlocked) {
            PinEntryView(
                pin = pin,
                error = pinError,
                onPinChange = { pin = it; pinError = false },
                onUnlock = {
                    if (pin == Constants.STAFF_PIN) {
                        unlocked = true
                        pinError = false
                    } else {
                        pinError = true
                    }
                }
            )
        } else {
            DashboardContent(app = app)
        }
    }
}

@Composable
private fun PinEntryView(pin: String, error: Boolean, onPinChange: (String) -> Unit, onUnlock: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize().padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(72.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(if (error) Color(0xFFFCECEC) else BloomColors.bodyGreenBg),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                Icons.Default.Lock,
                contentDescription = null,
                tint = if (error) Color(0xFFE57373) else BloomColors.bodyGreen,
                modifier = Modifier.size(36.dp)
            )
        }
        Spacer(Modifier.height(20.dp))
        Text(
            stringResource(R.string.staff_dashboard),
            fontWeight = FontWeight.Bold,
            fontSize = 22.sp,
            color = BloomColors.textPrimary
        )
        Text(
            stringResource(R.string.enter_pin),
            fontSize = 14.sp,
            color = BloomColors.textSecondary,
            modifier = Modifier.padding(top = 4.dp, bottom = 24.dp)
        )
        OutlinedTextField(
            value = pin,
            onValueChange = { if (it.length <= 4) onPinChange(it) },
            label = { Text(stringResource(R.string.enter_pin)) },
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
            isError = error,
            supportingText = if (error) {{ Text(stringResource(R.string.staff_pin_wrong), color = Color(0xFFE57373)) }} else null,
            shape = RoundedCornerShape(14.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = BloomColors.bodyGreen,
                unfocusedBorderColor = BloomColors.textTertiary.copy(alpha = 0.4f)
            ),
            modifier = Modifier.width(200.dp),
            textStyle = androidx.compose.ui.text.TextStyle(
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )
        )
        Spacer(Modifier.height(20.dp))
        Button(
            onClick = onUnlock,
            colors = ButtonDefaults.buttonColors(containerColor = BloomColors.bodyGreen),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier.width(200.dp).height(48.dp)
        ) {
            Text(stringResource(R.string.unlock), fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
private fun DashboardContent(app: BloomApp) {
    val todaySessions by produceState(0) { value = app.statsRepository.getTodaySessionCount() }
    val weeklyStats by produceState(listOf<Int>()) { value = app.statsRepository.getWeeklyStats() }
    val quadrantBreakdown by produceState(mapOf<String, Int>()) {
        value = app.statsRepository.getQuadrantBreakdown().associate { it.quadrant to it.count }
    }
    val languageStats by produceState(mapOf<String, Int>()) { value = app.statsRepository.getLanguageDistribution() }
    val moodStats by produceState(mapOf<String, Int>()) { value = app.statsRepository.getMoodDistribution() }
    val totalFlowers by app.gardenRepository.getFlowerCount().collectAsState(initial = 0)

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // KPI cards
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                KpiCard("🌸", "$totalFlowers", stringResource(R.string.kpi_total_blooms), BloomColors.soulPinkBg, Modifier.weight(1f))
                KpiCard("📅", "$todaySessions", stringResource(R.string.kpi_today_sessions), BloomColors.bodyGreenBg, Modifier.weight(1f))
                KpiCard("🌐", "${languageStats.size}", stringResource(R.string.kpi_languages), BloomColors.mindBlueBg, Modifier.weight(1f))
            }
        }

        // Weekly usage chart
        item {
            DashCard(title = stringResource(R.string.dashboard_weekly_title)) {
                if (weeklyStats.isNotEmpty()) {
                    WeeklyBarChart(data = weeklyStats)
                } else {
                    Text(stringResource(R.string.dashboard_no_data), fontSize = 13.sp, color = BloomColors.textTertiary)
                }
            }
        }

        // Quadrant breakdown
        item {
            DashCard(title = stringResource(R.string.dashboard_quadrants_title)) {
                val quadrants = listOf(
                    Triple("🧠", "Mind", BloomColors.mindBlue),
                    Triple("🏃‍♀️", "Body", BloomColors.bodyGreen),
                    Triple("✨", "Soul", BloomColors.soulPink),
                    Triple("🤝", "Connect", BloomColors.connectAmber)
                )
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    val total = quadrantBreakdown.values.sum().coerceAtLeast(1)
                    quadrants.forEach { (emoji, name, color) ->
                        val count = quadrantBreakdown[name.lowercase()] ?: 0
                        val pct = (count.toFloat() / total * 100).toInt()
                        ProgressRow(emoji = emoji, label = name, count = count, pct = pct, color = color)
                    }
                }
            }
        }

        // Language distribution
        if (languageStats.isNotEmpty()) {
            item {
                DashCard(title = stringResource(R.string.dashboard_languages_title)) {
                    val total = languageStats.values.sum().coerceAtLeast(1)
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        languageStats.entries.sortedByDescending { it.value }.take(6).forEach { (lang, count) ->
                            val pct = (count.toFloat() / total * 100).toInt()
                            ProgressRow(
                                emoji = getLanguageFlag(lang),
                                label = getLanguageDisplayName(lang),
                                count = count,
                                pct = pct,
                                color = BloomColors.bodyGreen
                            )
                        }
                    }
                }
            }
        }

        // Mood distribution
        if (moodStats.isNotEmpty()) {
            item {
                DashCard(title = stringResource(R.string.dashboard_mood_title)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        val moodEmojis = mapOf(
                            "VERY_SAD" to "😔", "ANXIOUS" to "😰",
                            "ANGRY" to "😤", "NEUTRAL" to "😐", "CONTENT" to "😊"
                        )
                        moodStats.entries.sortedByDescending { it.value }.take(5).forEach { (mood, count) ->
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Text(moodEmojis[mood] ?: "😐", fontSize = 22.sp)
                                Text("$count", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = BloomColors.textPrimary)
                            }
                        }
                    }
                }
            }
        }

        // Privacy disclaimer
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(BloomColors.connectAmberBg)
                    .padding(14.dp)
            ) {
                Text(
                    stringResource(R.string.stats_disclaimer),
                    fontSize = 12.sp,
                    color = BloomColors.textSecondary,
                    lineHeight = 17.sp
                )
            }
        }

        item { Spacer(Modifier.navigationBarsPadding()) }
    }
}

@Composable
private fun KpiCard(emoji: String, value: String, label: String, bgColor: Color, modifier: Modifier) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(bgColor)
            .padding(14.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Text(emoji, fontSize = 20.sp)
        Text(value, fontWeight = FontWeight.Bold, fontSize = 22.sp, color = BloomColors.textPrimary)
        Text(label, fontSize = 11.sp, color = BloomColors.textSecondary, lineHeight = 14.sp)
    }
}

@Composable
private fun DashCard(title: String, content: @Composable () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(BloomColors.surface)
            .border(1.dp, BloomColors.textTertiary.copy(alpha = 0.12f), RoundedCornerShape(16.dp))
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(title, fontWeight = FontWeight.SemiBold, fontSize = 15.sp, color = BloomColors.textPrimary)
        content()
    }
}

@Composable
private fun WeeklyBarChart(data: List<Int>) {
    val days = listOf("M", "T", "W", "T", "F", "S", "S")
    val maxVal = data.maxOrNull()?.coerceAtLeast(1) ?: 1
    val barColor = BloomColors.bodyGreen

    Row(
        modifier = Modifier.fillMaxWidth().height(80.dp),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalAlignment = Alignment.Bottom
    ) {
        data.zip(days).forEach { (count, day) ->
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Bottom,
                modifier = Modifier.weight(1f)
            ) {
                val fraction = count.toFloat() / maxVal
                Box(
                    modifier = Modifier
                        .fillMaxWidth(0.6f)
                        .height((fraction * 54).dp.coerceAtLeast(4.dp))
                        .clip(RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp))
                        .background(if (fraction == 1f) barColor else barColor.copy(alpha = 0.5f))
                )
                Spacer(Modifier.height(4.dp))
                Text(day, fontSize = 10.sp, color = BloomColors.textTertiary)
            }
        }
    }
}

@Composable
private fun ProgressRow(emoji: String, label: String, count: Int, pct: Int, color: Color) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(emoji, fontSize = 16.sp, modifier = Modifier.width(24.dp))
        Text(label, fontSize = 13.sp, color = BloomColors.textPrimary, modifier = Modifier.width(60.dp))
        Box(
            modifier = Modifier
                .weight(1f)
                .height(8.dp)
                .clip(RoundedCornerShape(4.dp))
                .background(color.copy(alpha = 0.15f))
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth(pct / 100f)
                    .height(8.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .background(color)
            )
        }
        Text("$pct%", fontSize = 11.sp, color = BloomColors.textTertiary, modifier = Modifier.width(30.dp), textAlign = TextAlign.End)
    }
}

private fun getLanguageFlag(code: String) = when (code) {
    "en" -> "🇬🇧"; "zh", "yue" -> "🇨🇳"; "pa" -> "🇮🇳"; "tl" -> "🇵🇭"
    "ko" -> "🇰🇷"; "fa" -> "🇮🇷"; "ar" -> "🇸🇦"; "es" -> "🇪🇸"
    "vi" -> "🇻🇳"; "hi" -> "🇮🇳"; "fr" -> "🇫🇷"; "ja" -> "🇯🇵"
    else -> "🌍"
}

private fun getLanguageDisplayName(code: String) = when (code) {
    "en" -> "English"; "zh" -> "Mandarin"; "yue" -> "Cantonese"; "pa" -> "Punjabi"
    "tl" -> "Tagalog"; "ko" -> "Korean"; "fa" -> "Farsi"; "ar" -> "Arabic"
    "es" -> "Spanish"; "vi" -> "Vietnamese"; "hi" -> "Hindi"; "fr" -> "French"; "ja" -> "Japanese"
    else -> code.uppercase()
}
