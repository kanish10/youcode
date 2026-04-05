package com.bloom.app.ui.screens

import android.content.Intent
import android.net.Uri
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Work
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bloom.app.BloomApp
import com.bloom.app.R
import com.bloom.app.data.models.Resource
import com.bloom.app.ui.theme.BloomColors
import kotlinx.coroutines.launch

private data class ResourceCategory(
    val key: String,
    val titleRes: Int,
    val descRes: Int,
    val icon: ImageVector,
    val color: Color,
    val bgColor: Color,
    val statusRes: Int
)

@Composable
fun ResourceHubScreen(app: BloomApp) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var searchQuery by remember { mutableStateOf("") }
    var allResources by remember { mutableStateOf<List<Resource>>(emptyList()) }
    var filtered by remember { mutableStateOf<List<Resource>>(emptyList()) }

    LaunchedEffect(Unit) {
        scope.launch {
            allResources = app.resourceRepository.getResources()
            filtered = allResources
        }
    }

    LaunchedEffect(searchQuery) {
        filtered = if (searchQuery.isBlank()) {
            allResources
        } else {
            allResources.filter {
                it.name.contains(searchQuery, ignoreCase = true) ||
                it.category.contains(searchQuery, ignoreCase = true) ||
                it.description.contains(searchQuery, ignoreCase = true)
            }
        }
    }

    val categories = listOf(
        ResourceCategory(
            key = "mental_health",
            titleRes = R.string.res_cat_mental,
            descRes = R.string.res_cat_mental_desc,
            icon = Icons.Default.Psychology,
            color = BloomColors.mindBlue,
            bgColor = BloomColors.mindBlueBg,
            statusRes = R.string.res_status_peer_led
        ),
        ResourceCategory(
            key = "food",
            titleRes = R.string.res_cat_food,
            descRes = R.string.res_cat_food_desc,
            icon = Icons.Default.Restaurant,
            color = Color(0xFF8BC6A3),
            bgColor = BloomColors.bodyGreenBg,
            statusRes = R.string.res_status_market_today
        ),
        ResourceCategory(
            key = "housing",
            titleRes = R.string.res_cat_housing,
            descRes = R.string.res_cat_housing_desc,
            icon = Icons.Default.Home,
            color = BloomColors.bodyGreen,
            bgColor = BloomColors.bodyGreenBg,
            statusRes = R.string.res_status_active_sites
        ),
        ResourceCategory(
            key = "emergency_crisis",
            titleRes = R.string.res_cat_safety,
            descRes = R.string.res_cat_safety_desc,
            icon = Icons.Default.Security,
            color = Color(0xFFE57373),
            bgColor = Color(0xFFFCECEC),
            statusRes = R.string.res_status_24h
        ),
        ResourceCategory(
            key = "counselling",
            titleRes = R.string.res_cat_counselling,
            descRes = R.string.res_cat_counselling_desc,
            icon = Icons.Default.Favorite,
            color = BloomColors.soulPink,
            bgColor = BloomColors.soulPinkBg,
            statusRes = R.string.res_status_available
        ),
        ResourceCategory(
            key = "employment",
            titleRes = R.string.res_cat_employment,
            descRes = R.string.res_cat_employment_desc,
            icon = Icons.Default.Work,
            color = BloomColors.connectAmber,
            bgColor = BloomColors.connectAmberBg,
            statusRes = R.string.res_status_available
        )
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BloomColors.background)
            .statusBarsPadding(),
        contentPadding = PaddingValues(bottom = 24.dp)
    ) {
        // Header
        item {
            Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 20.dp)) {
                Text(
                    text = stringResource(R.string.resource_hub_title),
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Bold,
                    color = BloomColors.textPrimary
                )
                Text(
                    text = stringResource(R.string.resource_hub_tagline),
                    fontSize = 14.sp,
                    color = BloomColors.textSecondary,
                    modifier = Modifier.padding(top = 2.dp)
                )
            }
        }

        // BC211 Call button
        item {
            Box(modifier = Modifier.padding(horizontal = 20.dp)) {
                Button(
                    onClick = {
                        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:211"))
                        context.startActivity(intent)
                    },
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = BloomColors.bodyGreen)
                ) {
                    Icon(
                        Icons.Default.Call,
                        contentDescription = null,
                        modifier = Modifier.size(20.dp),
                        tint = BloomColors.surface
                    )
                    Spacer(Modifier.size(8.dp))
                    Text(
                        stringResource(R.string.call_bc211),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = BloomColors.surface
                    )
                }
            }
        }

        item { Spacer(Modifier.height(12.dp)) }

        // Search bar
        item {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                placeholder = { Text(stringResource(R.string.search_resources), color = BloomColors.textTertiary) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = BloomColors.textTertiary) },
                shape = RoundedCornerShape(14.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = BloomColors.bodyGreen,
                    unfocusedBorderColor = BloomColors.textTertiary.copy(alpha = 0.3f),
                    focusedContainerColor = BloomColors.surface,
                    unfocusedContainerColor = BloomColors.surface
                ),
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                keyboardActions = KeyboardActions(onSearch = {})
            )
        }

        item { Spacer(Modifier.height(16.dp)) }

        // Category cards (only when no search)
        if (searchQuery.isBlank()) {
            item {
                Text(
                    text = stringResource(R.string.res_categories_title),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = BloomColors.textPrimary,
                    modifier = Modifier.padding(horizontal = 20.dp, vertical = 4.dp)
                )
            }
            items(categories) { cat ->
                ResourceCategoryCard(
                    category = cat,
                    onClick = { searchQuery = cat.key }
                )
            }
            item { Spacer(Modifier.height(8.dp)) }
            item {
                Text(
                    text = stringResource(R.string.res_all_resources),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = BloomColors.textPrimary,
                    modifier = Modifier.padding(horizontal = 20.dp, vertical = 4.dp)
                )
            }
        }

        // Resource list
        items(filtered.take(30)) { resource ->
            ResourceCard(resource = resource)
        }

        item { Spacer(Modifier.navigationBarsPadding()) }
    }
}

@Composable
private fun ResourceCategoryCard(category: ResourceCategory, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 4.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(category.bgColor)
            .clickable(onClick = onClick)
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Box(
            modifier = Modifier
                .size(44.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(category.color.copy(alpha = 0.2f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(category.icon, contentDescription = null, tint = category.color, modifier = Modifier.size(24.dp))
        }
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = stringResource(category.titleRes),
                fontWeight = FontWeight.SemiBold,
                fontSize = 15.sp,
                color = BloomColors.textPrimary
            )
            Text(
                text = stringResource(category.descRes),
                fontSize = 12.sp,
                color = BloomColors.textSecondary,
                lineHeight = 16.sp
            )
        }
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(category.color.copy(alpha = 0.15f))
                .padding(horizontal = 8.dp, vertical = 4.dp)
        ) {
            Text(
                text = stringResource(category.statusRes),
                fontSize = 10.sp,
                fontWeight = FontWeight.Medium,
                color = category.color
            )
        }
    }
}

@Composable
private fun ResourceCard(resource: Resource) {
    val context = LocalContext.current
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 4.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(BloomColors.surface)
            .border(1.dp, BloomColors.textTertiary.copy(alpha = 0.15f), RoundedCornerShape(12.dp))
            .padding(14.dp),
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Text(
                text = resource.name,
                fontWeight = FontWeight.SemiBold,
                fontSize = 14.sp,
                color = BloomColors.textPrimary,
                modifier = Modifier.weight(1f)
            )
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(BloomColors.bodyGreenBg)
                    .padding(horizontal = 6.dp, vertical = 2.dp)
            ) {
                Text(
                    text = resource.category.replace("_", " ").replaceFirstChar { it.uppercase() },
                    fontSize = 10.sp,
                    color = BloomColors.bodyGreen,
                    fontWeight = FontWeight.Medium
                )
            }
        }
        if (resource.description.isNotBlank()) {
            Text(
                text = resource.description,
                fontSize = 12.sp,
                color = BloomColors.textSecondary,
                lineHeight = 16.sp
            )
        }
        if (resource.phone.isNotBlank()) {
            Row(
                modifier = Modifier.clickable {
                    val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${resource.phone}"))
                    context.startActivity(intent)
                },
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Icon(Icons.Default.Call, contentDescription = null, tint = BloomColors.bodyGreen, modifier = Modifier.size(14.dp))
                Text(text = resource.phone, fontSize = 12.sp, color = BloomColors.bodyGreen, fontWeight = FontWeight.Medium)
            }
        }
        if (resource.hours.isNotBlank()) {
            Text(text = resource.hours, fontSize = 11.sp, color = BloomColors.textTertiary)
        }
    }
}
