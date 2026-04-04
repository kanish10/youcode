"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "en" | "fr" | "es" | "ar" | "pa" | "zh" | "tl" | "fa" | "hi" | "vi" | "ko";

export const LANGUAGES: { code: Lang; label: string; nativeLabel: string; rtl?: boolean }[] = [
  { code: "en", label: "English",   nativeLabel: "English" },
  { code: "fr", label: "French",    nativeLabel: "Français" },
  { code: "es", label: "Spanish",   nativeLabel: "Español" },
  { code: "ar", label: "Arabic",    nativeLabel: "العربية", rtl: true },
  { code: "pa", label: "Punjabi",   nativeLabel: "ਪੰਜਾਬੀ" },
  { code: "zh", label: "Mandarin",  nativeLabel: "中文" },
  { code: "tl", label: "Tagalog",   nativeLabel: "Tagalog" },
  { code: "fa", label: "Farsi",     nativeLabel: "فارسی", rtl: true },
  { code: "hi", label: "Hindi",     nativeLabel: "हिन्दी" },
  { code: "vi", label: "Vietnamese",nativeLabel: "Tiếng Việt" },
  { code: "ko", label: "Korean",    nativeLabel: "한국어" },
];

export type TKey =
  | "nav.garden" | "nav.sanctuary" | "nav.connect" | "nav.resources" | "nav.chat"
  | "welcome.title" | "welcome.subtitle" | "welcome.chooseLanguage"
  | "welcome.enterBloomId" | "welcome.bloomIdHint"
  | "welcome.continueWithId" | "welcome.continueWithout"
  | "home.title" | "home.subtitle"
  | "home.mind" | "home.body" | "home.soul"
  | "home.mindDesc" | "home.bodyDesc" | "home.soulDesc"
  | "home.mindCta" | "home.bodyCta" | "home.soulCta"
  | "home.dailyIntention" | "home.restQuote" | "home.intentionBody"
  | "body.title" | "body.subtitle"
  | "body.filterAll" | "body.filterYoga" | "body.filterStretching"
  | "body.filterBreathing" | "body.filterStrength" | "body.filterDance"
  | "body.seatedLabel" | "body.minLabel" | "body.watchDemo"
  | "body.startPractice" | "body.backToList" | "body.stepsTitle"
  | "body.watchOnYoutube" | "body.videoNote"
  | "chat.title" | "chat.subtitle" | "chat.placeholder"
  | "chat.greeting" | "chat.thinking" | "chat.error" | "chat.clear"
  | "grounding.title" | "grounding.subtitle"
  | "grounding.step1" | "grounding.step1Desc"
  | "grounding.step2" | "grounding.step2Desc"
  | "grounding.step3" | "grounding.step3Desc"
  | "grounding.step4" | "grounding.step4Desc"
  | "grounding.step5" | "grounding.step5Desc"
  | "grounding.final" | "grounding.done" | "grounding.next"
  | "soul.title" | "soul.subtitle" | "soul.affirmationLabel"
  | "soul.doodleTitle" | "soul.doodleSubtitle" | "soul.done" | "soul.timerLabel"
  | "connect.title" | "connect.subtitle" | "connect.badge"
  | "connect.leaveWhisper" | "connect.prompt"
  | "connect.whisperPlaceholder" | "connect.submit" | "connect.explore"
  | "connect.resonances" | "connect.hearts" | "connect.joys"
  | "resources.title" | "resources.subtitle" | "resources.callBC211"
  | "resources.searchPlaceholder"
  | "resources.housing" | "resources.housingDesc" | "resources.housingTag"
  | "resources.food" | "resources.foodDesc" | "resources.foodTag"
  | "resources.mental" | "resources.mentalDesc" | "resources.mentalTag"
  | "resources.safety" | "resources.safetyDesc" | "resources.safetyTag"
  | "resources.nearby" | "resources.viewMap"
  | "garden.title" | "garden.subtitle" | "garden.totalBlooms" | "garden.todayBlooms"
  | "common.back" | "common.done" | "common.next" | "common.loading"
  | "common.guestMode" | "common.loggingFor" | "common.changeId"
  | "common.send" | "common.tryAgain" | "common.close" | "common.skip"
  | "common.or" | "common.gentle" | "common.moderate" | "common.active"
  | "common.seated" | "common.min";

type TranslationMap = Record<TKey, string>;

const en: TranslationMap = {
  "nav.garden": "Garden", "nav.sanctuary": "Sanctuary", "nav.connect": "Connect",
  "nav.resources": "Resources", "nav.chat": "Chat",
  "welcome.title": "Welcome to Bloom",
  "welcome.subtitle": "A gentle space for your wellness journey",
  "welcome.chooseLanguage": "Choose your language",
  "welcome.enterBloomId": "Enter your Bloom ID",
  "welcome.bloomIdHint": "If staff gave you a Bloom ID or name, enter it to save your activities. You can always skip — everything still works.",
  "welcome.continueWithId": "Continue with my ID",
  "welcome.continueWithout": "Continue as guest",
  "home.title": "Sanctuary", "home.subtitle": "Cultivate your inner landscape",
  "home.mind": "Mind", "home.body": "Body", "home.soul": "Soul",
  "home.mindDesc": "Find calm through guided breathing and gentle grounding techniques.",
  "home.bodyDesc": "Move in whatever way feels kind to your body today.",
  "home.soulDesc": "Connect through creative expression, gratitude, and quiet reflection.",
  "home.mindCta": "Explore", "home.bodyCta": "Move", "home.soulCta": "Express",
  "home.dailyIntention": "Daily Intention",
  "home.restQuote": "Rest is not idleness",
  "home.intentionBody": "Today, allow yourself 5 minutes of stillness without judgement.",
  "body.title": "Body Movement",
  "body.subtitle": "You might try a practice that feels right for today",
  "body.filterAll": "All", "body.filterYoga": "Yoga", "body.filterStretching": "Stretching",
  "body.filterBreathing": "Breathing", "body.filterStrength": "Strength", "body.filterDance": "Dance",
  "body.seatedLabel": "Seated", "body.minLabel": "min",
  "body.watchDemo": "Watch Demo", "body.startPractice": "Begin Practice",
  "body.backToList": "Back to exercises", "body.stepsTitle": "Steps",
  "body.watchOnYoutube": "Find a video on YouTube",
  "body.videoNote": "Search opens YouTube in a new tab",
  "chat.title": "Bloom Chat", "chat.subtitle": "Your wellness companion",
  "chat.placeholder": "How are you feeling today?",
  "chat.greeting": "Hello 🌿 I'm here with you. How are you feeling today? I can suggest activities, listen, or just keep you company.",
  "chat.thinking": "Bloom is here with you…", "chat.error": "Something went wrong. Please try again.",
  "chat.clear": "Clear chat",
  "grounding.title": "Quiet Grounding", "grounding.subtitle": "5-4-3-2-1 · Anchor your focus",
  "grounding.step1": "5 things you can see",
  "grounding.step1Desc": "Look around. Notice details — colours, shapes, light.",
  "grounding.step2": "4 things you can touch",
  "grounding.step2Desc": "What textures can your hands or feet feel right now?",
  "grounding.step3": "3 things you can hear",
  "grounding.step3Desc": "Close your eyes briefly. What sounds do you notice?",
  "grounding.step4": "2 things you can smell",
  "grounding.step4Desc": "Take a slow, deep breath. What scents are in the air?",
  "grounding.step5": "1 thing you can taste",
  "grounding.step5Desc": "Notice any taste that is present in your mouth.",
  "grounding.final": "You are here. You are safe. You are present.",
  "grounding.done": "Complete", "grounding.next": "Next",
  "soul.title": "Soul Expression", "soul.subtitle": "A space to honour your journey",
  "soul.affirmationLabel": "Daily Affirmation",
  "soul.doodleTitle": "Digital Doodle",
  "soul.doodleSubtitle": "30 seconds to express your inner quiet",
  "soul.done": "Done ✓", "soul.timerLabel": "Timer",
  "connect.title": "Connection Space",
  "connect.subtitle": "Shared thoughts and whispers from the community",
  "connect.badge": "Anonymous Space",
  "connect.leaveWhisper": "Leave a whisper",
  "connect.prompt": "\"What is on your heart today?\"",
  "connect.whisperPlaceholder": "Share something anonymously…",
  "connect.submit": "Share quietly", "connect.explore": "Explore older whispers",
  "connect.resonances": "Resonances", "connect.hearts": "Hearts", "connect.joys": "Joys",
  "resources.title": "Essential Services",
  "resources.subtitle": "Find immediate support tailored to your needs",
  "resources.callBC211": "Call BC211 · 24/7 Support",
  "resources.searchPlaceholder": "Search for local services…",
  "resources.housing": "Housing & Legal", "resources.housingDesc": "Tenant rights, emergency shelter, and legal aid.",
  "resources.housingTag": "8 Active Sites",
  "resources.food": "Food Security", "resources.foodDesc": "Community kitchens, food hampers, and seasonal markets.",
  "resources.foodTag": "Market Today",
  "resources.mental": "Mental Wellness", "resources.mentalDesc": "Counselling, peer support groups, and crisis intervention.",
  "resources.mentalTag": "Peer Led",
  "resources.safety": "Safety", "resources.safetyDesc": "Emergency safe spaces, reporting tools, and street-watch.",
  "resources.safetyTag": "24h Response",
  "resources.nearby": "Resources Nearby", "resources.viewMap": "View Map",
  "garden.title": "Living Garden", "garden.subtitle": "Every bloom is a moment of wellness",
  "garden.totalBlooms": "Total blooms", "garden.todayBlooms": "Today",
  "common.back": "Back", "common.done": "Done", "common.next": "Next",
  "common.loading": "Loading…", "common.guestMode": "Guest mode",
  "common.loggingFor": "Logging for", "common.changeId": "Change ID",
  "common.send": "Send", "common.tryAgain": "Try again",
  "common.close": "Close", "common.skip": "Skip",
  "common.or": "or", "common.gentle": "Gentle",
  "common.moderate": "Moderate", "common.active": "Active",
  "common.seated": "Seated", "common.min": "min",
};

const fr: Partial<TranslationMap> = {
  "nav.garden": "Jardin", "nav.sanctuary": "Sanctuaire", "nav.connect": "Connexion",
  "nav.resources": "Ressources", "nav.chat": "Discussion",
  "welcome.title": "Bienvenue à Bloom",
  "welcome.subtitle": "Un espace doux pour votre voyage de bien-être",
  "welcome.chooseLanguage": "Choisissez votre langue",
  "welcome.enterBloomId": "Entrez votre identifiant Bloom",
  "welcome.bloomIdHint": "Si vous avez un identifiant Bloom, entrez-le pour sauvegarder vos activités. Vous pouvez toujours continuer sans.",
  "welcome.continueWithId": "Continuer avec mon ID",
  "welcome.continueWithout": "Continuer en tant qu'invité",
  "home.title": "Sanctuaire", "home.subtitle": "Cultivez votre paysage intérieur",
  "home.mind": "Esprit", "home.body": "Corps", "home.soul": "Âme",
  "home.mindDesc": "Trouvez la sérénité par la respiration guidée et l'ancrage.",
  "home.bodyDesc": "Bougez d'une façon qui honore votre corps aujourd'hui.",
  "home.soulDesc": "Connectez-vous par l'expression, la gratitude et la réflexion.",
  "home.mindCta": "Explorer", "home.bodyCta": "Bouger", "home.soulCta": "Exprimer",
  "home.dailyIntention": "Intention du Jour",
  "home.restQuote": "Le repos n'est pas l'oisiveté",
  "home.intentionBody": "Aujourd'hui, accordez-vous 5 minutes de calme sans jugement.",
  "body.title": "Mouvement Corporel",
  "body.subtitle": "Choisissez une pratique qui vous convient aujourd'hui",
  "body.filterAll": "Tout", "body.filterYoga": "Yoga", "body.filterStretching": "Étirement",
  "body.filterBreathing": "Respiration", "body.filterStrength": "Force", "body.filterDance": "Danse",
  "body.seatedLabel": "Assis", "body.minLabel": "min",
  "body.watchDemo": "Voir la démo", "body.startPractice": "Commencer",
  "body.backToList": "Retour aux exercices", "body.stepsTitle": "Étapes",
  "body.watchOnYoutube": "Trouver une vidéo sur YouTube",
  "body.videoNote": "La recherche ouvre YouTube dans un nouvel onglet",
  "chat.title": "Chat Bloom", "chat.subtitle": "Votre compagnon de bien-être",
  "chat.placeholder": "Comment vous sentez-vous aujourd'hui?",
  "chat.greeting": "Bonjour 🌿 Je suis là avec vous. Comment vous sentez-vous aujourd'hui?",
  "chat.thinking": "Bloom est là avec vous…", "chat.error": "Quelque chose s'est mal passé. Veuillez réessayer.",
  "chat.clear": "Effacer",
  "grounding.title": "Ancrage Calme", "grounding.subtitle": "5-4-3-2-1 · Ancrez votre attention",
  "grounding.step1": "5 choses que vous pouvez voir", "grounding.step1Desc": "Regardez autour. Remarquez les détails.",
  "grounding.step2": "4 choses que vous pouvez toucher", "grounding.step2Desc": "Quelles textures vos mains sentent-elles?",
  "grounding.step3": "3 choses que vous pouvez entendre", "grounding.step3Desc": "Fermez les yeux. Quels sons remarquez-vous?",
  "grounding.step4": "2 choses que vous pouvez sentir", "grounding.step4Desc": "Respirez profondément. Quelles odeurs perçoit-on?",
  "grounding.step5": "1 chose que vous pouvez goûter", "grounding.step5Desc": "Remarquez tout goût présent dans votre bouche.",
  "grounding.final": "Vous êtes ici. Vous êtes en sécurité. Vous êtes présent.",
  "grounding.done": "Terminé", "grounding.next": "Suivant",
  "soul.title": "Expression de l'Âme", "soul.subtitle": "Un espace pour honorer votre voyage",
  "soul.affirmationLabel": "Affirmation du Jour",
  "soul.doodleTitle": "Dessin Numérique", "soul.doodleSubtitle": "30 secondes pour exprimer votre calme intérieur",
  "soul.done": "Terminé ✓", "soul.timerLabel": "Minuterie",
  "connect.title": "Espace de Connexion",
  "connect.subtitle": "Pensées partagées de la communauté",
  "connect.badge": "Espace Anonyme",
  "connect.leaveWhisper": "Laisser un murmure",
  "connect.prompt": "\"Qu'avez-vous sur le cœur aujourd'hui?\"",
  "connect.whisperPlaceholder": "Partagez quelque chose anonymement…",
  "connect.submit": "Partager doucement", "connect.explore": "Explorer les anciens murmures",
  "resources.title": "Services Essentiels",
  "resources.subtitle": "Trouvez un soutien immédiat adapté à vos besoins",
  "resources.callBC211": "Appeler BC211 · Soutien 24/7",
  "resources.searchPlaceholder": "Rechercher des services locaux…",
  "resources.housing": "Logement et Juridique", "resources.housingDesc": "Droits des locataires, refuge et aide juridique.",
  "resources.food": "Sécurité Alimentaire", "resources.foodDesc": "Cuisines communautaires et paniers alimentaires.",
  "resources.mental": "Bien-être Mental", "resources.mentalDesc": "Conseil et groupes de soutien par les pairs.",
  "resources.safety": "Sécurité", "resources.safetyDesc": "Espaces sûrs d'urgence et outils de signalement.",
  "resources.nearby": "Ressources à Proximité", "resources.viewMap": "Voir la carte",
  "garden.title": "Jardin Vivant", "garden.subtitle": "Chaque fleur est un moment de bien-être",
  "garden.totalBlooms": "Total", "garden.todayBlooms": "Aujourd'hui",
  "common.back": "Retour", "common.done": "Terminé", "common.next": "Suivant",
  "common.loading": "Chargement…", "common.guestMode": "Mode invité",
  "common.loggingFor": "Pour", "common.changeId": "Changer d'ID",
  "common.send": "Envoyer", "common.tryAgain": "Réessayer",
  "common.close": "Fermer", "common.skip": "Passer",
  "common.or": "ou", "common.gentle": "Doux", "common.moderate": "Modéré",
  "common.active": "Actif", "common.seated": "Assis", "common.min": "min",
  "connect.resonances": "Résonances", "connect.hearts": "Cœurs", "connect.joys": "Joies",
  "resources.housingTag": "8 Sites Actifs", "resources.foodTag": "Marché Aujourd'hui",
  "resources.mentalTag": "Soutien par pairs", "resources.safetyTag": "Réponse 24h",
};

const es: Partial<TranslationMap> = {
  "nav.garden": "Jardín", "nav.sanctuary": "Santuario", "nav.connect": "Conectar",
  "nav.resources": "Recursos", "nav.chat": "Chat",
  "welcome.title": "Bienvenida a Bloom",
  "welcome.subtitle": "Un espacio suave para tu viaje de bienestar",
  "welcome.chooseLanguage": "Elige tu idioma",
  "welcome.enterBloomId": "Ingresa tu ID de Bloom",
  "welcome.bloomIdHint": "Si tienes un ID de Bloom, ingrésalo para guardar tus actividades. Siempre puedes continuar sin él.",
  "welcome.continueWithId": "Continuar con mi ID",
  "welcome.continueWithout": "Continuar como invitada",
  "home.title": "Santuario", "home.subtitle": "Cultiva tu paisaje interior",
  "home.mind": "Mente", "home.body": "Cuerpo", "home.soul": "Alma",
  "home.mindDesc": "Encuentra calma a través de respiración guiada y técnicas de enraizamiento.",
  "home.bodyDesc": "Muévete de la manera que sea amable con tu cuerpo hoy.",
  "home.soulDesc": "Conéctate a través de la expresión creativa y la gratitud.",
  "home.mindCta": "Explorar", "home.bodyCta": "Mover", "home.soulCta": "Expresar",
  "home.dailyIntention": "Intención Diaria",
  "home.restQuote": "El descanso no es ociosidad",
  "home.intentionBody": "Hoy, permítete 5 minutos de quietud sin juicio.",
  "body.title": "Movimiento Corporal",
  "body.subtitle": "Quizás podrías probar una práctica que se sienta bien hoy",
  "body.filterAll": "Todos", "body.filterYoga": "Yoga", "body.filterStretching": "Estiramiento",
  "body.filterBreathing": "Respiración", "body.filterStrength": "Fuerza", "body.filterDance": "Danza",
  "body.seatedLabel": "Sentada", "body.minLabel": "min",
  "body.watchDemo": "Ver Demo", "body.startPractice": "Comenzar",
  "body.backToList": "Volver a ejercicios", "body.stepsTitle": "Pasos",
  "body.watchOnYoutube": "Buscar video en YouTube",
  "body.videoNote": "La búsqueda abre YouTube en una nueva pestaña",
  "chat.title": "Chat Bloom", "chat.subtitle": "Tu compañera de bienestar",
  "chat.placeholder": "¿Cómo te sientes hoy?",
  "chat.greeting": "Hola 🌿 Estoy aquí contigo. ¿Cómo te sientes hoy?",
  "chat.thinking": "Bloom está aquí contigo…", "chat.error": "Algo salió mal. Por favor intenta de nuevo.",
  "chat.clear": "Limpiar chat",
  "grounding.title": "Enraizamiento Tranquilo", "grounding.subtitle": "5-4-3-2-1 · Ancla tu atención",
  "grounding.step1": "5 cosas que puedes ver", "grounding.step1Desc": "Mira alrededor. Nota los detalles.",
  "grounding.step2": "4 cosas que puedes tocar", "grounding.step2Desc": "¿Qué texturas sientes en tus manos?",
  "grounding.step3": "3 cosas que puedes escuchar", "grounding.step3Desc": "Cierra los ojos. ¿Qué sonidos notas?",
  "grounding.step4": "2 cosas que puedes oler", "grounding.step4Desc": "Respira profundo. ¿Qué aromas percibes?",
  "grounding.step5": "1 cosa que puedes saborear", "grounding.step5Desc": "Nota cualquier sabor en tu boca.",
  "grounding.final": "Estás aquí. Estás segura. Estás presente.",
  "grounding.done": "Completar", "grounding.next": "Siguiente",
  "soul.title": "Expresión del Alma", "soul.subtitle": "Un espacio para honrar tu viaje",
  "soul.affirmationLabel": "Afirmación Diaria",
  "soul.doodleTitle": "Dibujo Digital", "soul.doodleSubtitle": "30 segundos para expresar tu calma interior",
  "soul.done": "Listo ✓", "soul.timerLabel": "Temporizador",
  "connect.title": "Espacio de Conexión",
  "connect.subtitle": "Pensamientos compartidos de la comunidad",
  "connect.badge": "Espacio Anónimo",
  "connect.leaveWhisper": "Dejar un susurro",
  "connect.prompt": "\"¿Qué llevas en el corazón hoy?\"",
  "connect.whisperPlaceholder": "Comparte algo anónimamente…",
  "connect.submit": "Compartir suavemente", "connect.explore": "Explorar susurros anteriores",
  "connect.resonances": "Resonancias", "connect.hearts": "Corazones", "connect.joys": "Alegrías",
  "resources.title": "Servicios Esenciales",
  "resources.subtitle": "Encuentra apoyo inmediato para tus necesidades",
  "resources.callBC211": "Llamar BC211 · Apoyo 24/7",
  "resources.searchPlaceholder": "Buscar servicios locales…",
  "resources.housing": "Vivienda y Legal", "resources.housingDesc": "Derechos de inquilinas, refugio y asesoría legal.",
  "resources.housingTag": "8 Sitios Activos",
  "resources.food": "Seguridad Alimentaria", "resources.foodDesc": "Cocinas comunitarias y canastas de alimentos.",
  "resources.foodTag": "Mercado Hoy",
  "resources.mental": "Bienestar Mental", "resources.mentalDesc": "Consejería y grupos de apoyo.",
  "resources.mentalTag": "Apoyo entre pares",
  "resources.safety": "Seguridad", "resources.safetyDesc": "Espacios seguros de emergencia y herramientas.",
  "resources.safetyTag": "Respuesta 24h",
  "resources.nearby": "Recursos Cercanos", "resources.viewMap": "Ver mapa",
  "garden.title": "Jardín Viviente", "garden.subtitle": "Cada flor es un momento de bienestar",
  "garden.totalBlooms": "Total", "garden.todayBlooms": "Hoy",
  "common.back": "Volver", "common.done": "Listo", "common.next": "Siguiente",
  "common.loading": "Cargando…", "common.guestMode": "Modo invitada",
  "common.loggingFor": "Para", "common.changeId": "Cambiar ID",
  "common.send": "Enviar", "common.tryAgain": "Intentar de nuevo",
  "common.close": "Cerrar", "common.skip": "Omitir",
  "common.or": "o", "common.gentle": "Suave", "common.moderate": "Moderado",
  "common.active": "Activo", "common.seated": "Sentada", "common.min": "min",
};

const ar: Partial<TranslationMap> = {
  "nav.garden": "الحديقة", "nav.sanctuary": "الملاذ", "nav.connect": "التواصل",
  "nav.resources": "الموارد", "nav.chat": "الدردشة",
  "welcome.title": "مرحباً في Bloom",
  "welcome.subtitle": "مساحة لطيفة لرحلتك نحو العافية",
  "welcome.chooseLanguage": "اختاري لغتك",
  "welcome.enterBloomId": "أدخلي معرف Bloom الخاص بكِ",
  "welcome.bloomIdHint": "إذا أعطاكِ الموظفون معرفاً، أدخليه لحفظ أنشطتك. يمكنكِ دائماً التخطي.",
  "welcome.continueWithId": "المتابعة بمعرفي",
  "welcome.continueWithout": "المتابعة كضيفة",
  "home.title": "الملاذ", "home.subtitle": "ازرعي مشهدكِ الداخلي",
  "home.mind": "العقل", "home.body": "الجسم", "home.soul": "الروح",
  "home.mindDesc": "اعثري على الهدوء من خلال التنفس الموجه وتقنيات التأريض.",
  "home.bodyDesc": "تحركي بأي طريقة تبدو لطيفة مع جسمكِ اليوم.",
  "home.soulDesc": "تواصلي من خلال التعبير الإبداعي والامتنان.",
  "home.mindCta": "استكشاف", "home.bodyCta": "تحركي", "home.soulCta": "اعبّري",
  "home.dailyIntention": "النية اليومية",
  "home.restQuote": "الراحة ليست كسلاً",
  "home.intentionBody": "اليوم، امنحي نفسكِ 5 دقائق من الهدوء دون حكم.",
  "body.title": "حركة الجسم",
  "body.subtitle": "ربما تجربين ممارسة تبدو مناسبة لكِ اليوم",
  "body.filterAll": "الكل", "body.filterYoga": "يوغا", "body.filterStretching": "إطالة",
  "body.filterBreathing": "تنفس", "body.filterStrength": "قوة", "body.filterDance": "رقص",
  "body.seatedLabel": "جلوس", "body.minLabel": "دقيقة",
  "body.watchDemo": "شاهدي العرض", "body.startPractice": "ابدئي",
  "body.backToList": "العودة للتمارين", "body.stepsTitle": "الخطوات",
  "body.watchOnYoutube": "البحث عن فيديو على يوتيوب",
  "body.videoNote": "يفتح البحث يوتيوب في علامة تبويب جديدة",
  "chat.title": "دردشة Bloom", "chat.subtitle": "رفيقتك في العافية",
  "chat.placeholder": "كيف تشعرين اليوم؟",
  "chat.greeting": "مرحباً 🌿 أنا هنا معكِ. كيف تشعرين اليوم؟",
  "chat.thinking": "Bloom هنا معكِ…", "chat.error": "حدث خطأ. يرجى المحاولة مرة أخرى.",
  "chat.clear": "مسح الدردشة",
  "grounding.title": "التأريض الهادئ", "grounding.subtitle": "5-4-3-2-1 · أرسّخي انتباهكِ",
  "grounding.step1": "٥ أشياء يمكنكِ رؤيتها", "grounding.step1Desc": "انظري حولكِ. لاحظي التفاصيل.",
  "grounding.step2": "٤ أشياء يمكنكِ لمسها", "grounding.step2Desc": "ما الملمس الذي تشعرين به؟",
  "grounding.step3": "٣ أشياء يمكنكِ سماعها", "grounding.step3Desc": "أغمضي عينيكِ. ما الأصوات التي تلاحظينها؟",
  "grounding.step4": "٢ شيء يمكنكِ شمّه", "grounding.step4Desc": "خذي نفساً عميقاً. ما الروائح في الهواء؟",
  "grounding.step5": "١ شيء يمكنكِ تذوقه", "grounding.step5Desc": "لاحظي أي طعم في فمكِ الآن.",
  "grounding.final": "أنتِ هنا. أنتِ بأمان. أنتِ في الحاضر.",
  "grounding.done": "اكتمل", "grounding.next": "التالي",
  "soul.title": "تعبير الروح", "soul.subtitle": "مساحة لتكريم رحلتكِ",
  "soul.affirmationLabel": "التأكيد اليومي",
  "soul.doodleTitle": "رسم رقمي", "soul.doodleSubtitle": "٣٠ ثانية للتعبير عن هدوئكِ الداخلي",
  "soul.done": "تم ✓", "soul.timerLabel": "المؤقت",
  "connect.title": "فضاء التواصل",
  "connect.subtitle": "أفكار مشتركة وهمسات من المجتمع",
  "connect.badge": "فضاء مجهول",
  "connect.leaveWhisper": "اتركي همسة",
  "connect.prompt": "\"ما الذي يشغل قلبكِ اليوم؟\"",
  "connect.whisperPlaceholder": "شاركي شيئاً بشكل مجهول…",
  "connect.submit": "شاركي بهدوء", "connect.explore": "استكشاف الهمسات القديمة",
  "connect.resonances": "رنين", "connect.hearts": "قلوب", "connect.joys": "أفراح",
  "resources.title": "الخدمات الأساسية",
  "resources.subtitle": "اعثري على الدعم الفوري المناسب لاحتياجاتكِ",
  "resources.callBC211": "اتصلي بـ BC211 · دعم ٢٤/٧",
  "resources.searchPlaceholder": "البحث عن الخدمات المحلية…",
  "resources.housing": "السكن والقانوني", "resources.housingDesc": "حقوق المستأجرات والملجأ والمساعدة القانونية.",
  "resources.housingTag": "٨ مواقع نشطة",
  "resources.food": "الأمن الغذائي", "resources.foodDesc": "المطابخ المجتمعية وحقائب الطعام.",
  "resources.foodTag": "سوق اليوم",
  "resources.mental": "العافية النفسية", "resources.mentalDesc": "الإرشاد ومجموعات الدعم.",
  "resources.mentalTag": "دعم الأقران",
  "resources.safety": "السلامة", "resources.safetyDesc": "أماكن آمنة طارئة وأدوات الإبلاغ.",
  "resources.safetyTag": "استجابة ٢٤ ساعة",
  "resources.nearby": "الموارد القريبة", "resources.viewMap": "عرض الخريطة",
  "garden.title": "الحديقة الحية", "garden.subtitle": "كل زهرة هي لحظة عافية",
  "garden.totalBlooms": "إجمالي", "garden.todayBlooms": "اليوم",
  "common.back": "رجوع", "common.done": "تم", "common.next": "التالي",
  "common.loading": "جار التحميل…", "common.guestMode": "وضع الضيفة",
  "common.loggingFor": "لـ", "common.changeId": "تغيير المعرف",
  "common.send": "إرسال", "common.tryAgain": "حاولي مرة أخرى",
  "common.close": "إغلاق", "common.skip": "تخطي",
  "common.or": "أو", "common.gentle": "لطيف", "common.moderate": "متوسط",
  "common.active": "نشيط", "common.seated": "جلوس", "common.min": "د",
};

const pa: Partial<TranslationMap> = {
  "nav.garden": "ਬਾਗ਼", "nav.sanctuary": "ਅਸਥਾਨ", "nav.connect": "ਜੁੜੋ",
  "nav.resources": "ਸਰੋਤ", "nav.chat": "ਗੱਲਬਾਤ",
  "welcome.title": "Bloom ਵਿੱਚ ਸੁਆਗਤ ਹੈ",
  "welcome.subtitle": "ਤੁਹਾਡੀ ਤੰਦਰੁਸਤੀ ਯਾਤਰਾ ਲਈ ਇੱਕ ਕੋਮਲ ਜਗ੍ਹਾ",
  "welcome.chooseLanguage": "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
  "welcome.enterBloomId": "ਆਪਣਾ Bloom ID ਦਾਖਲ ਕਰੋ",
  "welcome.bloomIdHint": "ਜੇਕਰ ਸਟਾਫ਼ ਨੇ ਤੁਹਾਨੂੰ ID ਦਿੱਤਾ ਹੈ, ਇਸਨੂੰ ਦਾਖਲ ਕਰੋ। ਤੁਸੀਂ ਹਮੇਸ਼ਾ ਛੱਡ ਸਕਦੇ ਹੋ।",
  "welcome.continueWithId": "ਮੇਰੀ ID ਨਾਲ ਜਾਰੀ ਰੱਖੋ",
  "welcome.continueWithout": "ਮਹਿਮਾਨ ਵਜੋਂ ਜਾਰੀ ਰੱਖੋ",
  "home.title": "ਅਸਥਾਨ", "home.subtitle": "ਆਪਣੇ ਅੰਦਰੂਨੀ ਲੈਂਡਸਕੇਪ ਨੂੰ ਕਾਸ਼ਤ ਕਰੋ",
  "home.mind": "ਮਨ", "home.body": "ਸਰੀਰ", "home.soul": "ਆਤਮਾ",
  "home.mindDesc": "ਸੇਧਤ ਸਾਹ ਅਤੇ ਗਰਾਊਂਡਿੰਗ ਤਕਨੀਕਾਂ ਰਾਹੀਂ ਸ਼ਾਂਤੀ ਲੱਭੋ।",
  "home.bodyDesc": "ਅੱਜ ਆਪਣੇ ਸਰੀਰ ਲਈ ਕੋਮਲ ਅੰਦੋਲਨ ਕਰੋ।",
  "home.soulDesc": "ਰਚਨਾਤਮਕ ਪ੍ਰਗਟਾਵੇ ਅਤੇ ਕ੍ਰਿਤੱਗਤਾ ਨਾਲ ਜੁੜੋ।",
  "home.mindCta": "ਖੋਜੋ", "home.bodyCta": "ਚੱਲੋ", "home.soulCta": "ਪ੍ਰਗਟ ਕਰੋ",
  "home.dailyIntention": "ਰੋਜ਼ਾਨਾ ਇਰਾਦਾ",
  "home.restQuote": "ਆਰਾਮ ਆਲਸ ਨਹੀਂ ਹੈ",
  "home.intentionBody": "ਅੱਜ, ਆਪਣੇ ਆਪ ਨੂੰ 5 ਮਿੰਟ ਦੀ ਸ਼ਾਂਤੀ ਦਿਓ।",
  "body.title": "ਸਰੀਰਕ ਅੰਦੋਲਨ",
  "body.subtitle": "ਅੱਜ ਆਪਣੇ ਲਈ ਸਹੀ ਅਭਿਆਸ ਚੁਣੋ",
  "body.filterAll": "ਸਾਰੇ", "body.filterYoga": "ਯੋਗਾ", "body.filterStretching": "ਖਿੱਚਣਾ",
  "body.filterBreathing": "ਸਾਹ", "body.filterStrength": "ਤਾਕਤ", "body.filterDance": "ਨਾਚ",
  "body.seatedLabel": "ਬੈਠ ਕੇ", "body.minLabel": "ਮਿੰਟ",
  "body.watchDemo": "ਡੈਮੋ ਦੇਖੋ", "body.startPractice": "ਸ਼ੁਰੂ ਕਰੋ",
  "body.backToList": "ਅਭਿਆਸਾਂ 'ਤੇ ਵਾਪਸ", "body.stepsTitle": "ਕਦਮ",
  "body.watchOnYoutube": "YouTube 'ਤੇ ਵੀਡੀਓ ਲੱਭੋ",
  "body.videoNote": "ਖੋਜ YouTube ਵਿੱਚ ਖੁੱਲ੍ਹੇਗੀ",
  "chat.title": "Bloom ਗੱਲਬਾਤ", "chat.subtitle": "ਤੁਹਾਡੀ ਤੰਦਰੁਸਤੀ ਸਾਥੀ",
  "chat.placeholder": "ਅੱਜ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?",
  "chat.greeting": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ 🌿 ਮੈਂ ਤੁਹਾਡੇ ਨਾਲ ਹਾਂ। ਅੱਜ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?",
  "chat.thinking": "Bloom ਤੁਹਾਡੇ ਨਾਲ ਹੈ…", "chat.error": "ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  "chat.clear": "ਗੱਲਬਾਤ ਸਾਫ਼ ਕਰੋ",
  "grounding.title": "ਸ਼ਾਂਤ ਗਰਾਊਂਡਿੰਗ", "grounding.subtitle": "5-4-3-2-1 · ਧਿਆਨ ਕੇਂਦਰਿਤ ਕਰੋ",
  "grounding.step1": "5 ਚੀਜ਼ਾਂ ਜੋ ਤੁਸੀਂ ਦੇਖ ਸਕਦੇ ਹੋ", "grounding.step1Desc": "ਆਲੇ ਦੁਆਲੇ ਦੇਖੋ।",
  "grounding.step2": "4 ਚੀਜ਼ਾਂ ਜੋ ਤੁਸੀਂ ਛੂਹ ਸਕਦੇ ਹੋ", "grounding.step2Desc": "ਕਿਹੜੀਆਂ ਬਣਾਵਟਾਂ ਮਹਿਸੂਸ ਕਰਦੇ ਹੋ?",
  "grounding.step3": "3 ਚੀਜ਼ਾਂ ਜੋ ਤੁਸੀਂ ਸੁਣ ਸਕਦੇ ਹੋ", "grounding.step3Desc": "ਅੱਖਾਂ ਬੰਦ ਕਰੋ। ਕਿਹੜੀਆਂ ਆਵਾਜ਼ਾਂ?",
  "grounding.step4": "2 ਚੀਜ਼ਾਂ ਜੋ ਤੁਸੀਂ ਸੁੰਘ ਸਕਦੇ ਹੋ", "grounding.step4Desc": "ਡੂੰਘਾ ਸਾਹ ਲਓ।",
  "grounding.step5": "1 ਚੀਜ਼ ਜੋ ਤੁਸੀਂ ਚੱਖ ਸਕਦੇ ਹੋ", "grounding.step5Desc": "ਮੂੰਹ ਵਿੱਚ ਸੁਆਦ ਦੇਖੋ।",
  "grounding.final": "ਤੁਸੀਂ ਇੱਥੇ ਹੋ। ਤੁਸੀਂ ਸੁਰੱਖਿਅਤ ਹੋ। ਤੁਸੀਂ ਮੌਜੂਦ ਹੋ।",
  "grounding.done": "ਪੂਰਾ ਕਰੋ", "grounding.next": "ਅਗਲਾ",
  "soul.title": "ਆਤਮਾ ਪ੍ਰਗਟਾਵਾ", "soul.subtitle": "ਆਪਣੀ ਯਾਤਰਾ ਦਾ ਸਨਮਾਨ ਕਰਨ ਲਈ ਇੱਕ ਥਾਂ",
  "soul.affirmationLabel": "ਰੋਜ਼ਾਨਾ ਪੁਸ਼ਟੀ",
  "soul.doodleTitle": "ਡਿਜੀਟਲ ਡੂਡਲ", "soul.doodleSubtitle": "30 ਸਕਿੰਟ ਆਪਣੀ ਸ਼ਾਂਤੀ ਪ੍ਰਗਟ ਕਰੋ",
  "soul.done": "ਹੋ ਗਿਆ ✓", "soul.timerLabel": "ਟਾਈਮਰ",
  "connect.title": "ਕਨੈਕਸ਼ਨ ਸਪੇਸ",
  "connect.subtitle": "ਭਾਈਚਾਰੇ ਤੋਂ ਸਾਂਝੇ ਵਿਚਾਰ",
  "connect.badge": "ਗੁਮਨਾਮ ਸਪੇਸ",
  "connect.leaveWhisper": "ਕੁਝ ਕਹੋ",
  "connect.prompt": "\"ਅੱਜ ਤੁਹਾਡੇ ਦਿਲ ਵਿੱਚ ਕੀ ਹੈ?\"",
  "connect.whisperPlaceholder": "ਕੁਝ ਗੁਮਨਾਮ ਸਾਂਝਾ ਕਰੋ…",
  "connect.submit": "ਸ਼ਾਂਤੀ ਨਾਲ ਸਾਂਝਾ ਕਰੋ", "connect.explore": "ਪੁਰਾਣੇ ਸੁਨੇਹੇ ਦੇਖੋ",
  "connect.resonances": "ਗੂੰਜ", "connect.hearts": "ਦਿਲ", "connect.joys": "ਖੁਸ਼ੀਆਂ",
  "resources.title": "ਜ਼ਰੂਰੀ ਸੇਵਾਵਾਂ",
  "resources.subtitle": "ਆਪਣੀਆਂ ਜ਼ਰੂਰਤਾਂ ਲਈ ਤੁਰੰਤ ਸਹਾਇਤਾ ਲੱਭੋ",
  "resources.callBC211": "BC211 ਕਾਲ ਕਰੋ · 24/7 ਸਹਾਇਤਾ",
  "resources.searchPlaceholder": "ਸਥਾਨਕ ਸੇਵਾਵਾਂ ਖੋਜੋ…",
  "resources.housing": "ਰਿਹਾਇਸ਼ ਅਤੇ ਕਾਨੂੰਨੀ", "resources.housingDesc": "ਕਿਰਾਏਦਾਰਾਂ ਦੇ ਅਧਿਕਾਰ ਅਤੇ ਕਾਨੂੰਨੀ ਸਹਾਇਤਾ।",
  "resources.housingTag": "8 ਸਰਗਰਮ ਸਾਈਟਾਂ",
  "resources.food": "ਭੋਜਨ ਸੁਰੱਖਿਆ", "resources.foodDesc": "ਕਮਿਊਨਿਟੀ ਰਸੋਈਆਂ ਅਤੇ ਭੋਜਨ ਟੋਕਰੀਆਂ।",
  "resources.foodTag": "ਅੱਜ ਬਾਜ਼ਾਰ",
  "resources.mental": "ਮਾਨਸਿਕ ਤੰਦਰੁਸਤੀ", "resources.mentalDesc": "ਕਾਉਂਸਲਿੰਗ ਅਤੇ ਪੀਅਰ ਸਪੋਰਟ।",
  "resources.mentalTag": "ਪੀਅਰ ਲੀਡ",
  "resources.safety": "ਸੁਰੱਖਿਆ", "resources.safetyDesc": "ਐਮਰਜੈਂਸੀ ਸੁਰੱਖਿਅਤ ਥਾਵਾਂ ਅਤੇ ਰਿਪੋਰਟਿੰਗ।",
  "resources.safetyTag": "24h ਜਵਾਬ",
  "resources.nearby": "ਨੇੜੇ ਦੇ ਸਰੋਤ", "resources.viewMap": "ਨਕਸ਼ਾ ਦੇਖੋ",
  "garden.title": "ਜਿਉਂਦੀ ਬਗੀਚੀ", "garden.subtitle": "ਹਰ ਫੁੱਲ ਤੰਦਰੁਸਤੀ ਦਾ ਪਲ ਹੈ",
  "garden.totalBlooms": "ਕੁੱਲ", "garden.todayBlooms": "ਅੱਜ",
  "common.back": "ਵਾਪਸ", "common.done": "ਹੋ ਗਿਆ", "common.next": "ਅਗਲਾ",
  "common.loading": "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…", "common.guestMode": "ਮਹਿਮਾਨ ਮੋਡ",
  "common.loggingFor": "ਲਈ", "common.changeId": "ID ਬਦਲੋ",
  "common.send": "ਭੇਜੋ", "common.tryAgain": "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
  "common.close": "ਬੰਦ ਕਰੋ", "common.skip": "ਛੱਡੋ",
  "common.or": "ਜਾਂ", "common.gentle": "ਕੋਮਲ", "common.moderate": "ਮੱਧਮ",
  "common.active": "ਸਰਗਰਮ", "common.seated": "ਬੈਠ ਕੇ", "common.min": "ਮਿੰਟ",
};

const TRANSLATIONS: Record<Lang, TranslationMap> = {
  en,
  fr: { ...en, ...fr } as TranslationMap,
  es: { ...en, ...es } as TranslationMap,
  ar: { ...en, ...ar } as TranslationMap,
  pa: { ...en, ...pa } as TranslationMap,
  zh: en, tl: en, fa: en, hi: en, vi: en, ko: en,
};

// ─── Context ───────────────────────────────────────────────────────────────
interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
  rtl: boolean;
  bloomId: string;
  setBloomId: (id: string) => void;
}

const LanguageContext = createContext<LangCtx>({
  lang: "en", setLang: () => {}, t: (k) => k,
  rtl: false, bloomId: "", setBloomId: () => {},
});

const LANG_KEY = "bloom_lang";
const ID_KEY = "bloom_kiosk_identifier";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [bloomId, setBloomIdState] = useState("");

  useEffect(() => {
    const saved = (localStorage.getItem(LANG_KEY) as Lang) || "en";
    setLangState(saved);
    const id = sessionStorage.getItem(ID_KEY) || "";
    setBloomIdState(id);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
    const isRtl = LANGUAGES.find((x) => x.code === l)?.rtl ?? false;
    document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", l);
  };

  const setBloomId = (id: string) => {
    setBloomIdState(id);
    if (id.trim()) sessionStorage.setItem(ID_KEY, id.trim());
    else sessionStorage.removeItem(ID_KEY);
  };

  const t = (key: TKey): string => TRANSLATIONS[lang]?.[key] ?? en[key] ?? key;
  const rtl = LANGUAGES.find((x) => x.code === lang)?.rtl ?? false;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, rtl, bloomId, setBloomId }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
