package com.bloom.app.data.models

enum class ExerciseCategory(val displayName: String, val emoji: String) {
    YOGA("Yoga", "🧘"),
    STRETCHING("Stretching", "🤸"),
    BREATHING("Breathing", "🫁"),
    STRENGTH("Strength", "💪"),
    DANCE("Dance", "💃")
}

enum class ExerciseDifficulty(val label: String) {
    GENTLE("Gentle"),
    MODERATE("Moderate"),
    ACTIVE("Active")
}

data class Exercise(
    val id: String,
    val name: String,
    val desc: String,
    val category: ExerciseCategory,
    val difficulty: ExerciseDifficulty,
    val durationMin: Int,
    val isSeated: Boolean,
    val emoji: String,
    val steps: List<String>,
    val youtubeQuery: String
)

object ExerciseData {
    val ALL: List<Exercise> = listOf(
        Exercise(
            id = "chair-yoga",
            name = "Chair Yoga",
            desc = "Gentle seated yoga suitable for all bodies and spaces. No mat needed.",
            category = ExerciseCategory.YOGA,
            difficulty = ExerciseDifficulty.GENTLE,
            durationMin = 15,
            isSeated = true,
            emoji = "🧘",
            youtubeQuery = "chair yoga for beginners seated gentle 15 minutes",
            steps = listOf(
                "Sit tall with feet flat on the floor, hands resting on your thighs.",
                "Breathe in slowly and raise both arms overhead. Exhale and lower them.",
                "Roll your shoulders back gently 5 times, then forward 5 times.",
                "Drop your right ear toward your right shoulder. Hold 3 slow breaths. Repeat left.",
                "Place your left hand on your right knee and gently twist to the right. Hold 3 breaths.",
                "Repeat the twist to the left side.",
                "Extend one leg at a time, pointing and flexing the foot 5 times each.",
                "Close with 3 deep belly breaths, hands on your heart."
            )
        ),
        Exercise(
            id = "morning-yoga",
            name = "Morning Yoga Flow",
            desc = "A gentle wake-up sequence to ease into the day with grace.",
            category = ExerciseCategory.YOGA,
            difficulty = ExerciseDifficulty.GENTLE,
            durationMin = 10,
            isSeated = false,
            emoji = "🌅",
            youtubeQuery = "morning yoga for beginners 10 minutes gentle wake up",
            steps = listOf(
                "Stand tall or sit comfortably. Take 3 deep breaths to arrive in your body.",
                "Slowly roll your neck in a gentle half-circle, side to side.",
                "Reach both arms up, interlace fingers and stretch upward. Hold 5 breaths.",
                "Forward fold gently — let your upper body hang heavy. Bend knees if needed.",
                "Come to a comfortable seat. Twist gently right, then left.",
                "End in stillness: hands on heart, one hand on belly. Feel yourself breathing."
            )
        ),
        Exercise(
            id = "restorative-yoga",
            name = "Restorative Yoga",
            desc = "Deep rest and release. Perfect for difficult days when rest is needed most.",
            category = ExerciseCategory.YOGA,
            difficulty = ExerciseDifficulty.GENTLE,
            durationMin = 20,
            isSeated = true,
            emoji = "🌿",
            youtubeQuery = "restorative yoga 20 minutes for stress relief beginners",
            steps = listOf(
                "Find a comfortable position — seated, lying down, or supported by pillows.",
                "Close your eyes and simply breathe. Notice the breath without changing it.",
                "Gently press your shoulder blades together. Hold, then release.",
                "Tense your hands into fists, then open them wide. Repeat 3 times.",
                "Take a long exhale, making a gentle 'haaa' sound. Let tension leave.",
                "Rest in stillness for as long as feels right. You deserve this pause."
            )
        ),
        Exercise(
            id = "full-body-stretch",
            name = "Full Body Stretch",
            desc = "Release tension from head to toe with this calming stretch sequence.",
            category = ExerciseCategory.STRETCHING,
            difficulty = ExerciseDifficulty.GENTLE,
            durationMin = 10,
            isSeated = false,
            emoji = "🤸",
            youtubeQuery = "full body stretch 10 minutes gentle beginner tension release",
            steps = listOf(
                "Stand or sit. Interlace your fingers and stretch your arms up tall. Hold 5 breaths.",
                "Side stretch: lean gently to the right, then left. Feel the ribs opening.",
                "Bring one arm across your chest, hold with the other arm. Stretch 20 seconds each side.",
                "Reach one arm overhead and bend at the elbow. Gently push the elbow back. Each side.",
                "Seated: extend your legs and reach toward your toes as far as is comfortable.",
                "Gentle ankle circles — 5 times each direction on each foot.",
                "End with a big full-body stretch: arms up, yawn if you'd like!"
            )
        ),
        Exercise(
            id = "neck-shoulder",
            name = "Neck & Shoulder Release",
            desc = "Quick relief for tension held in the neck and shoulders. Seated, 5 minutes.",
            category = ExerciseCategory.STRETCHING,
            difficulty = ExerciseDifficulty.GENTLE,
            durationMin = 5,
            isSeated = true,
            emoji = "💆",
            youtubeQuery = "neck shoulder stretch release seated 5 minutes tension headache",
            steps = listOf(
                "Sit tall. Drop your chin to your chest. Hold 5 breaths.",
                "Slowly look up toward the ceiling. Hold 5 breaths.",
                "Right ear to right shoulder. Left hand lightly rests on your head (no pulling). 5 breaths.",
                "Left ear to left shoulder. 5 breaths.",
                "Roll your shoulders: up, back, down. Repeat 5 times, then reverse.",
                "Squeeze your shoulders up to your ears, hold 3 seconds, then drop them. Repeat 3 times."
            )
        ),
        Exercise(
            id = "hip-opener",
            name = "Hip Opening Sequence",
            desc = "Release deep-held tension in the hips — where we often store stress.",
            category = ExerciseCategory.STRETCHING,
            difficulty = ExerciseDifficulty.MODERATE,
            durationMin = 10,
            isSeated = false,
            emoji = "🏃",
            youtubeQuery = "hip opener stretch for beginners 10 minutes stress relief",
            steps = listOf(
                "Stand with feet wider than hips. Slowly lower into a comfortable squat if possible.",
                "Or: sit in a chair and cross your right ankle over your left knee (figure-4 shape).",
                "Gently press the right knee down. Breathe into the hip for 5-10 breaths.",
                "Switch sides: left ankle over right knee.",
                "Seated: draw your knee toward your opposite shoulder. Hold each side.",
                "Finish with gentle hip circles — imagine stirring a big pot with your hips."
            )
        ),
        Exercise(
            id = "box-breathing",
            name = "Box Breathing",
            desc = "A Navy-proven technique to calm the nervous system in minutes.",
            category = ExerciseCategory.BREATHING,
            difficulty = ExerciseDifficulty.GENTLE,
            durationMin = 5,
            isSeated = true,
            emoji = "⬜",
            youtubeQuery = "box breathing technique guided 5 minutes anxiety calm",
            steps = listOf(
                "Sit comfortably. Exhale completely through your mouth.",
                "Breathe IN through your nose for 4 counts. (1-2-3-4)",
                "HOLD your breath for 4 counts. (1-2-3-4)",
                "Breathe OUT through your mouth for 4 counts. (1-2-3-4)",
                "HOLD empty for 4 counts. (1-2-3-4)",
                "Repeat this box pattern 4–6 times.",
                "Notice how your body feels calmer with each cycle."
            )
        ),
        Exercise(
            id = "478-breathing",
            name = "4-7-8 Breathing",
            desc = "A calming breath pattern to reduce anxiety and support sleep.",
            category = ExerciseCategory.BREATHING,
            difficulty = ExerciseDifficulty.GENTLE,
            durationMin = 5,
            isSeated = true,
            emoji = "🌬️",
            youtubeQuery = "4 7 8 breathing technique guided anxiety sleep calm",
            steps = listOf(
                "Place the tip of your tongue behind your upper front teeth.",
                "Exhale completely through your mouth with a 'whoosh' sound.",
                "Close your mouth. Inhale through your nose for 4 counts.",
                "Hold your breath for 7 counts.",
                "Exhale through your mouth making a 'whoosh' for 8 counts.",
                "That is one full breath. Repeat 3 more times.",
                "Do this twice daily or whenever you feel anxious."
            )
        ),
        Exercise(
            id = "belly-breathing",
            name = "Belly Breathing",
            desc = "Deep diaphragmatic breathing to activate the body's natural calm response.",
            category = ExerciseCategory.BREATHING,
            difficulty = ExerciseDifficulty.GENTLE,
            durationMin = 5,
            isSeated = true,
            emoji = "🫁",
            youtubeQuery = "belly breathing diaphragmatic breathing guided beginner stress",
            steps = listOf(
                "Place one hand on your chest and one hand on your belly.",
                "Breathe in slowly through your nose. Let your belly push your hand out.",
                "Your chest should move very little. All breath goes into your belly.",
                "Breathe out through pursed lips (like you're blowing through a straw).",
                "Feel your belly fall as you exhale completely.",
                "Continue for 5–10 breaths at a comfortable pace.",
                "Notice any tension melting with each exhale."
            )
        ),
        Exercise(
            id = "seated-core",
            name = "Seated Core Strengthening",
            desc = "Build gentle strength in your core without getting on the floor.",
            category = ExerciseCategory.STRENGTH,
            difficulty = ExerciseDifficulty.GENTLE,
            durationMin = 10,
            isSeated = true,
            emoji = "💪",
            youtubeQuery = "seated core exercises beginners chair gentle strengthening",
            steps = listOf(
                "Sit at the edge of your chair, back straight, hands on the armrests.",
                "Tighten your belly muscles gently (like you expect a soft punch).",
                "Slowly lift one knee toward your chest. Lower it. Alternate 10 times each side.",
                "With both feet on the floor, lean slightly back from the hips. Hold 5 seconds. Return.",
                "March in place: alternating knees, keeping your back straight. 20 marches.",
                "Side bends: slide one hand down the side of your leg toward your knee. Alternate 10 times.",
                "End by sitting tall and taking 5 deep breaths."
            )
        ),
        Exercise(
            id = "gentle-sway",
            name = "Gentle Sway",
            desc = "Free, gentle movement to reconnect with your body and lift your spirits.",
            category = ExerciseCategory.DANCE,
            difficulty = ExerciseDifficulty.GENTLE,
            durationMin = 5,
            isSeated = false,
            emoji = "🎵",
            youtubeQuery = "gentle free movement dance mindful body awareness calm",
            steps = listOf(
                "Stand comfortably. Close your eyes if it feels safe.",
                "Begin to sway gently side to side, like a tree in a soft breeze.",
                "Let your arms follow naturally — no right or wrong movement.",
                "If music feels good, turn on something you enjoy. Let it move you.",
                "Notice how your body wants to move. Follow that impulse.",
                "This is your time. Move in whatever way brings you ease."
            )
        ),
        Exercise(
            id = "joy-dance",
            name = "Joy Movement",
            desc = "A playful burst of movement to release stuck energy and invite joy.",
            category = ExerciseCategory.DANCE,
            difficulty = ExerciseDifficulty.MODERATE,
            durationMin = 10,
            isSeated = false,
            emoji = "🎉",
            youtubeQuery = "easy dance workout beginner fun gentle uplifting movement",
            steps = listOf(
                "Put on a song that you love or that makes you feel something.",
                "Start by just bobbing your head. Let the music in.",
                "Let your shoulders join. Soft shoulder rolls to the beat.",
                "Let your hips start to move. Side to side, forward and back.",
                "Wave your arms. Reach up, reach out — no rules.",
                "If you want to jump, spin, or stomp — go for it!",
                "End by slowing down gradually with the music, hands on heart."
            )
        )
    )
}
