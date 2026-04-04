package com.bloom.app.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.bloom.app.BloomApp
import com.bloom.app.ui.activities.BreathingExercise
import com.bloom.app.ui.activities.GroundingExercise
import com.bloom.app.ui.screens.AmbientGardenScreen
import com.bloom.app.ui.screens.BodyScreen
import com.bloom.app.ui.screens.ConnectScreen
import com.bloom.app.ui.screens.LoginScreen
import com.bloom.app.ui.screens.MindScreen
import com.bloom.app.ui.screens.SoulScreen
import com.bloom.app.ui.screens.StaffDashboardScreen
import com.bloom.app.ui.screens.WellnessWheelScreen

@Composable
fun BloomNavGraph(
    app: BloomApp,
    navController: NavHostController = rememberNavController()
) {
    val shouldNavigateToGarden by app.sessionManager.shouldNavigateToGarden.collectAsState()

    LaunchedEffect(shouldNavigateToGarden) {
        if (shouldNavigateToGarden) {
            navController.navigate(BloomRoute.AMBIENT) {
                popUpTo(0) { inclusive = true }
            }
            app.sessionManager.clearNavigationFlag()
        }
    }

    val startDest = if (app.supabaseClient.isLoggedIn) BloomRoute.AMBIENT else BloomRoute.LOGIN

    NavHost(
        navController = navController,
        startDestination = startDest
    ) {
        composable(BloomRoute.LOGIN) {
            LoginScreen(
                app = app,
                onLoggedIn = {
                    navController.navigate(BloomRoute.AMBIENT) {
                        popUpTo(BloomRoute.LOGIN) { inclusive = true }
                    }
                },
                onSkip = {
                    navController.navigate(BloomRoute.AMBIENT) {
                        popUpTo(BloomRoute.LOGIN) { inclusive = true }
                    }
                }
            )
        }
        composable(BloomRoute.AMBIENT) {
            AmbientGardenScreen(
                app = app,
                onBegin = { navController.navigate(BloomRoute.WHEEL) },
                onStaffClick = { navController.navigate(BloomRoute.STAFF) }
            )
        }
        composable(BloomRoute.WHEEL) {
            WellnessWheelScreen(
                app = app,
                onQuadrantClick = { navController.navigate(it) },
                onClose = {
                    app.sessionManager.endSession()
                    navController.navigate(BloomRoute.AMBIENT) {
                        popUpTo(BloomRoute.AMBIENT) { inclusive = true }
                    }
                }
            )
        }
        composable(BloomRoute.MIND) {
            MindScreen(
                app = app,
                onBack = { navController.popBackStack() },
                onBreathing = { navController.navigate(BloomRoute.BREATHING) },
                onGrounding = { navController.navigate(BloomRoute.GROUNDING) }
            )
        }
        composable(BloomRoute.BODY) {
            BodyScreen(onBack = { navController.popBackStack() })
        }
        composable(BloomRoute.SOUL) {
            SoulScreen(onBack = { navController.popBackStack() })
        }
        composable(BloomRoute.CONNECT) {
            ConnectScreen(app = app, onBack = { navController.popBackStack() })
        }
        composable(BloomRoute.STAFF) {
            StaffDashboardScreen(app = app, onBack = { navController.popBackStack() })
        }
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
    }
}

object BloomRoute {
    const val LOGIN = "login"
    const val AMBIENT = "ambient"
    const val WHEEL = "wheel"
    const val MIND = "mind"
    const val BODY = "body"
    const val SOUL = "soul"
    const val CONNECT = "connect"
    const val STAFF = "staff"
    const val BREATHING = "breathing"
    const val GROUNDING = "grounding"
}
