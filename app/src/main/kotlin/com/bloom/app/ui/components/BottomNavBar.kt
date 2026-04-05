package com.bloom.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.outlined.Chat
import androidx.compose.material.icons.outlined.Group
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.LocalFlorist
import androidx.compose.material.icons.outlined.SelfImprovement
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bloom.app.R
import com.bloom.app.navigation.BloomRoute
import com.bloom.app.ui.theme.BloomColors

data class BottomNavItem(
    val route: String,
    val label: String,
    val icon: ImageVector,
    val activeIcon: ImageVector = icon
)

@Composable
fun BottomNavBar(
    currentRoute: String,
    onNavigate: (String) -> Unit
) {
    val items = listOf(
        BottomNavItem(
            route = BloomRoute.GARDEN,
            label = stringResource(R.string.nav_garden),
            icon = Icons.Outlined.LocalFlorist,
            activeIcon = Icons.Outlined.LocalFlorist
        ),
        BottomNavItem(
            route = BloomRoute.SANCTUARY,
            label = stringResource(R.string.nav_sanctuary),
            icon = Icons.Outlined.SelfImprovement,
            activeIcon = Icons.Outlined.SelfImprovement
        ),
        BottomNavItem(
            route = BloomRoute.CHAT,
            label = stringResource(R.string.nav_chat),
            icon = Icons.Outlined.Chat,
            activeIcon = Icons.Outlined.Chat
        ),
        BottomNavItem(
            route = BloomRoute.CONNECT,
            label = stringResource(R.string.nav_connect),
            icon = Icons.Outlined.Group,
            activeIcon = Icons.Outlined.Group
        ),
        BottomNavItem(
            route = BloomRoute.RESOURCES,
            label = stringResource(R.string.nav_resources),
            icon = Icons.Outlined.Info,
            activeIcon = Icons.Filled.Info
        )
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(elevation = 8.dp, shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp))
    ) {
        // Top border
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(BloomColors.outlineVariant.copy(alpha = 0.3f))
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    BloomColors.creamBg,
                    RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp)
                )
                .navigationBarsPadding()
                .padding(horizontal = 4.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            items.forEach { item ->
                val isActive = currentRoute == item.route

                Column(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .then(
                            if (isActive) {
                                Modifier.background(
                                    BloomColors.sageGreen.copy(alpha = 0.1f),
                                    RoundedCornerShape(12.dp)
                                )
                            } else {
                                Modifier
                            }
                        )
                        .clickable { onNavigate(item.route) }
                        .padding(vertical = 6.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(2.dp)
                ) {
                    Icon(
                        imageVector = if (isActive) item.activeIcon else item.icon,
                        contentDescription = item.label,
                        modifier = Modifier.size(24.dp),
                        tint = if (isActive) BloomColors.sageGreen else BloomColors.inactive
                    )
                    Text(
                        text = item.label,
                        fontSize = 10.sp,
                        fontWeight = if (isActive) FontWeight.SemiBold else FontWeight.Medium,
                        color = if (isActive) BloomColors.sageGreen else BloomColors.inactive
                    )
                }
            }
        }
    }
}

val mainTabRoutes = setOf(
    BloomRoute.GARDEN,
    BloomRoute.SANCTUARY,
    BloomRoute.CHAT,
    BloomRoute.CONNECT,
    BloomRoute.RESOURCES
)
