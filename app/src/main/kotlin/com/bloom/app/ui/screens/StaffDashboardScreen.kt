package com.bloom.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.util.Constants

@Composable
fun StaffDashboardScreen(
    app: BloomApp,
    onBack: () -> Unit
) {
    var pin by remember { mutableStateOf("") }
    var unlocked by remember { mutableStateOf(false) }

    val todaySessions by produceState(initialValue = 0, unlocked) {
        if (unlocked) value = app.statsRepository.getTodaySessionCount()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        if (!unlocked) {
            Text(stringResource(R.string.staff_dashboard))
            OutlinedTextField(
                value = pin,
                onValueChange = { pin = it.take(4) },
                label = { Text(stringResource(R.string.enter_pin)) },
                visualTransformation = PasswordVisualTransformation()
            )
            Button(onClick = { unlocked = pin == Constants.STAFF_PIN }) { Text(stringResource(R.string.unlock)) }
        } else {
            Text(stringResource(R.string.today_sessions, todaySessions))
            Text(stringResource(R.string.stats_disclaimer))
        }
        Button(onClick = onBack) { Text(stringResource(R.string.back)) }
    }
}
