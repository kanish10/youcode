package com.bloom.app.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.bloom.app.BloomApp
import com.bloom.app.data.models.ExerciseData
import com.bloom.app.ui.activities.BreathingExercise
import com.bloom.app.ui.activities.GroundingExercise
import com.bloom.app.ui.components.BottomNavBar
import com.bloom.app.ui.components.mainTabRoutes
import com.bloom.app.ui.screens.AmbientGardenScreen
import com.bloom.app.ui.screens.BodyScreen
import com.bloom.app.ui.screens.ChatScreen
import com.bloom.app.ui.screens.ConnectionSpaceScreen
import com.bloom.app.ui.screens.ExerciseDetailScreen
import com.bloom.app.ui.screens.LoginScreen
import com.bloom.app.ui.screens.MindScreen
import com.bloom.app.ui.screens.ResourceHubScreen
import com.bloom.app.ui.screens.SettingsScreen
import com.bloom.app.ui.screens.SoulExpressionScreen
import com.bloom.app.ui.screens.SoulScreen
import com.bloom.app.ui.screens.StaffDashboardScreen
import com.bloom.app.ui.screens.WellnessWheelScreen

@Composable
fun BloomNavGraph(
    app: BloomApp,
    navController: NavHostController = rememberNavController()
) {
    val shouldNavigateToGarden by app.sessionManager.shouldNavigateToGarden.collectAsState()
    val currentBackstack by navController.currentBackStackEntryAsState()
    val currentRoute = currentBackstack?.destination?.route ?: BloomRoute.GARDEN

    LaunchedEffect(shouldNavigateToGarden) {
        if (shouldNavigateToGarden) {
            navController.navigate(BloomRoute.GARDEN) {
                popUpTo(0) { inclusive = true }
            }
            app.sessionManager.clearNavigationFlag()
        }
    }

    val startDest = if (app.supabaseClient.isLoggedIn) BloomRoute.GARDEN else BloomRoute.LOGIN

    // Selected exercise state (passed via nav args workaround)
    var selectedExerciseId by remember { mutableStateOf("") }

    Scaffold(
        bottomBar = {
            if (currentRoute in mainTabRoutes) {
                BottomNavBar(
                    currentRoute = currentRoute,
                    onNavigate = { route ->
                        if (route != currentRoute) {
                            navController.navigate(route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    }
                )
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = startDest,
            modifier = Modifier.padding(innerPadding)
        ) {
            // Auth
            composable(BloomRoute.LOGIN) {
                LoginScreen(
                    app = app,
                    onLoggedIn = {
                        navController.navigate(BloomRoute.GARDEN) {
                            popUpTo(BloomRoute.LOGIN) { inclusive = true }
                        }
                    },
                    onSkip = {
                        navController.navigate(BloomRoute.GARDEN) {
                            popUpTo(BloomRoute.LOGIN) { inclusive = true }
                        }
                    }
                )
            }

            // Main tabs
            composable(BloomRoute.GARDEN) {
                AmbientGardenScreen(
                    app = app,
                    onBegin = { navController.navigate(BloomRoute.SANCTUARY) },
                    onStaffClick = { navController.navigate(BloomRoute.PORTAL) },
                    onSettingsClick = { navController.navigate(BloomRoute.SETTINGS) }
                )
            }
            composable(BloomRoute.SANCTUARY) {
                WellnessWheelScreen(
                    app = app,
                    onQuadrantClick = { navController.navigate(it) },
                    onClose = {
                        app.sessionManager.endSession()
                        navController.navigate(BloomRoute.GARDEN) {
                            popUpTo(BloomRoute.GARDEN) { inclusive = true }
                        }
                    },
                    onChatClick = { navController.navigate(BloomRoute.CHAT) },
                    onSettingsClick = { navController.navigate(BloomRoute.SETTINGS) }
                )
            }
            composable(BloomRoute.CHAT) {
                ChatScreen(app = app, onBack = { navController.popBackStack() })
            }
            composable(BloomRoute.CONNECT) {
                ConnectionSpaceScreen(app = app)
            }
            composable(BloomRoute.RESOURCES) {
                ResourceHubScreen(app = app)
            }
            composable(BloomRoute.PORTAL) {
                StaffDashboardScreen(app = app, onBack = { navController.popBackStack() })
            }

            // Settings
            composable(BloomRoute.SETTINGS) {
                SettingsScreen(
                    app = app,
                    onBack = { navController.popBackStack() }
                )
            }

            // Wellness sub-screens
            composable(BloomRoute.MIND) {
                MindScreen(
                    app = app,
                    onBack = { navController.popBackStack() },
                    onBreathing = { navController.navigate(BloomRoute.BREATHING) },
                    onGrounding = { navController.navigate(BloomRoute.GROUNDING) }
                )
            }
            composable(BloomRoute.BODY) {
                BodyScreen(
                    onBack = { navController.popBackStack() },
                    onExercise = { exercise ->
                        selectedExerciseId = exercise.id
                        navController.navigate(BloomRoute.EXERCISE_DETAIL)
                    }
                )
            }
            composable(BloomRoute.SOUL) {
                SoulScreen(
                    app = app,
                    onBack = { navController.popBackStack() },
                    onCanvas = { navController.navigate(BloomRoute.SOUL_EXPRESSION) },
                    onGratitude = { navController.navigate(BloomRoute.SOUL_EXPRESSION) },
                    onAffirmation = { navController.navigate(BloomRoute.SOUL_EXPRESSION) },
                    onMemory = { navController.navigate(BloomRoute.SOUL_EXPRESSION) }
                )
            }
            composable(BloomRoute.AMBIENT) {
                // Legacy route — redirect to GARDEN
                LaunchedEffect(Unit) {
                    navController.navigate(BloomRoute.GARDEN) {
                        popUpTo(BloomRoute.AMBIENT) { inclusive = true }
                    }
                }
            }

            // Activities
            composable(BloomRoute.BREATHING) {
                BreathingExercise(
                    app = app,
                    onDone = { navController.popBackStack() }
                )
            }
            composable(BloomRoute.GROUNDING) {
                GroundingExercise(
                    app = app,
                    onDone = { navController.popBackStack() }
                )
            }
            composable(BloomRoute.EXERCISE_DETAIL) {
                val exercise = ExerciseData.ALL.find { it.id == selectedExerciseId }
                    ?: ExerciseData.ALL.first()
                ExerciseDetailScreen(
                    app = app,
                    exercise = exercise,
                    onBack = { navController.popBackStack() }
                )
            }
            composable(BloomRoute.SOUL_EXPRESSION) {
                SoulExpressionScreen(
                    app = app,
                    onDone = { navController.popBackStack() }
                )
            }
        }
    }
}

object BloomRoute {
    // Main tabs (have bottom nav)
    const val GARDEN = "garden"
    const val SANCTUARY = "sanctuary"
    const val CHAT = "chat"
    const val CONNECT = "connect"
    const val RESOURCES = "resources"

    // Auth
    const val LOGIN = "login"

    // Legacy alias
    const val AMBIENT = "ambient"

    // Staff
    const val PORTAL = "portal"

    // Settings
    const val SETTINGS = "settings"

    // Wellness quadrants
    const val MIND = "mind"
    const val BODY = "body"
    const val SOUL = "soul"

    // Activities (full-screen, no bottom nav)
    const val BREATHING = "breathing"
    const val GROUNDING = "grounding"
    const val EXERCISE_DETAIL = "exercise_detail"
    const val SOUL_EXPRESSION = "soul_expression"

    // Legacy staff route alias
    const val STAFF = "portal"
    const val WHEEL = "sanctuary"
}
