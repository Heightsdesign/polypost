export type SupportedLang = "en" | "fr" | "es" | "pt";

export const translations: Record<SupportedLang, Record<string, string>> = {
  en: {
    app_name: "Polypost",
    navbar_logo_alt: "Polypost logo",
    navbar_use_cases: "Use cases",
    navbar_pricing: "Pricing",
    navbar_language: "Language",
    navbar_notifications_title: "Notifications",
    navbar_notifications_loading: "Loading…",
    navbar_notifications_empty:
        "No notifications yet. We’ll remind you before scheduled posts and important updates.",
    navbar_login: "Log in",
    navbar_get_started: "Get started",
    navbar_account_fallback: "Account",
    navbar_dashboard: "Dashboard",
    navbar_account: "Account",
    navbar_gallery: "Gallery",
    navbar_support: "Support",
    navbar_logout: "Log out",
    landing_logo_alt: "Polypost full logo",
    landing_tagline: "Social media co-pilot",
    landing_title_main: "All-in-one content assistant",
    landing_title_highlight: "for creators",
    landing_subtitle:
      "Generate smart ideas, write scroll-stopping captions, and plan your best posting times — without spending your whole day juggling platforms.",
    landing_login_cta: "Log in",
    landing_register_cta: "Create an account",
    landing_overview_label: "Today's overview",
    landing_overview_title: "Polypost dashboard",
    landing_overview_badge: "Live preview",
    landing_stats_ideas: "Ideas",
    landing_stats_drafts: "Drafts",
    landing_stats_scheduled: "Scheduled",
    login_title: "Sign In",
    login_username_placeholder: "Username",
    login_password_placeholder: "Password",
    login_button: "Login",
    login_error: "Incorrect username or password.",
    login_forgot_password: "Forgot your password?",
    login_no_account: "No account yet?",
    login_register_link: "Register",
    register_get_started: "Get started",
    register_title: "Create your",
    register_title_highlight: "Polypost account",
    register_subtitle:
      "We’ll use these details to personalise ideas, captions, and posting times. It only takes a minute.",

    register_success_message:
      "🎉 Your account has been created! Please check your inbox to confirm your email before logging in.",
    register_error_message:
      "Could not create your account. Please check your info or try again.",

    register_step_title_1: "Account details",
    register_step_title_2: "Basics",
    register_step_title_3: "Style & audience",
    register_step_title_4: "Extras",

    // If you keep the interpolation version:
    register_step_label: "Step {{step}} of {{total}}",
    register_progress_label: "{{percent}}% complete",

    // If instead you use the non-interpolation variant, use these instead:
    // register_step_prefix: "Step",
    // register_step_of: "of",
    // register_progress_suffix: "complete",

    register_sidebar_title: "Why all these questions?",
    register_sidebar_item_1: "We match ideas to your niche and audience.",
    register_sidebar_item_2: "We tune captions to your preferred tone of voice.",
    register_sidebar_item_3: "We suggest posting times based on your platforms.",
    register_sidebar_item_4: "You can edit everything later anytime.",
    register_step_account_fill_all: "Please fill in all fields to continue.",
    register_step_account_username_label: "Username",
    register_step_account_username_placeholder: "Choose a username",
    register_step_account_email_label: "Email",
    register_step_account_email_placeholder: "you@example.com",
    register_step_account_password_label: "Password",
    register_step_account_password_placeholder: "Create a secure password",
    register_step_account_password_help:
      "Use at least 8 characters, ideally with a mix of letters & numbers.",
    register_step_account_next: "Next →",
    register_language_en: "English",
    register_language_fr: "French",
    register_language_es: "Spanish",
    register_language_pt: "Portuguese",
    register_step_basics_country_city_required:
    "Please select a country and enter your city.",
    register_step_basics_language_label: "Preferred language",
    register_step_basics_platform_label: "Main platform",
    register_step_basics_country_label: "Country",
    register_step_basics_city_label: "City",
    register_step_basics_city_placeholder: "Paris, New York, São Paulo…",
    register_step_basics_city_help:
      "Later we can plug an autocomplete API here.",
    register_step_basics_back: "← Back",
    register_step_basics_next: "Next →",
    // Vibes
    register_step_tone_vibe_label: "Overall vibe",
    register_step_tone_vibe_fun: "Fun",
    register_step_tone_vibe_chill: "Chill",
    register_step_tone_vibe_bold: "Bold",
    register_step_tone_vibe_educational: "Educational",
    register_step_tone_vibe_luxury: "Luxury",
    register_step_tone_vibe_cozy: "Cozy",
    register_step_tone_vibe_high_energy: "High-energy",
    register_step_tone_vibe_mysterious: "Mysterious",
    register_step_tone_vibe_wholesome: "Wholesome",

    // Tones
    register_step_tone_tone_label: "Tone of voice",
    register_step_tone_tone_casual: "Casual",
    register_step_tone_tone_professional: "Professional",
    register_step_tone_tone_playful: "Playful",
    register_step_tone_tone_flirty: "Flirty",
    register_step_tone_tone_inspirational: "Inspirational",
    register_step_tone_tone_sarcastic: "Sarcastic",
    register_step_tone_tone_empathetic: "Empathetic",
    register_step_tone_tone_confident: "Confident",
    register_step_tone_niche_label: "Niche",
    register_step_tone_niche_placeholder:
      "Fitness, comedy, beauty, finance…",
    register_step_tone_target_label: "Target audience",
    register_step_tone_target_placeholder:
      "e.g. Gen Z women, busy parents…",
    register_step_tone_platforms_label: "Main platforms you post on",
    register_step_tone_platforms_hint: "(you can pick several)",
    register_step_tone_content_lang_label: "Main content language",
    register_step_tone_content_lang_help:
      "We'll prioritise this language when generating your captions.",
    register_step_tone_niche_required:
      "Tell us your niche so we can tailor ideas.",
    register_step_tone_back: "← Back",
    register_step_tone_next: "Next →",

    // Brand assistant
    register_step_tone_brand_intro: "Not sure how to fill this section?",
    register_step_tone_brand_optional: "Optional",
    register_step_tone_brand_description:
      "let AI suggest a vibe, tone & niche based on your goals.",
    register_step_tone_brand_button: "Open brand assistant",
    register_step_tone_brand_title: "Brand assistant (optional)",
    register_step_tone_brand_niche_placeholder:
      "Your niche (e.g. fitness, OF, comedy…)",
    register_step_tone_brand_target_placeholder:
      "Target audience (e.g. Gen Z men, OF subs…)",
    register_step_tone_brand_goals_placeholder:
      "Your goals (grow subs, sell content, build long-term brand…)",
    register_step_tone_brand_comfort_placeholder:
      "Comfort level (e.g. shy, flirty, bold, anonymous…)",
    register_step_tone_brand_error:
      "Could not generate brand personas. Try again.",
    register_step_tone_brand_thinking: "Thinking…",
    register_step_tone_brand_generate: "Generate brand personas",
    register_step_tone_brand_pick_persona:
      "Pick the persona that feels most like you. You can still edit everything later.",
    register_step_tone_brand_persona_prefix: "Persona",
    register_step_tone_brand_selected: "Selected ✓",
    register_step_tone_brand_use_persona: "Use this persona",
    register_step_tone_brand_vibe_label: "Vibe:",
    register_step_tone_brand_tone_label: "Tone:",
    register_step_tone_brand_pillars_label: "Content pillars:",
    register_step_tone_brand_bio_label: "Bio idea:",

    // Samples area
    register_step_tone_samples_title: "Sample posts in this style",
    register_step_tone_samples_generating: "Generating…",
    register_step_tone_samples_generate_button: "Generate sample posts",
    register_step_tone_samples_hint:
      "Click “Generate sample posts” to preview how your content might sound.",
    register_step_extras_stage_question: "Where are you in your creator journey?",
    register_step_extras_stage_starter: "Just starting out",
    register_step_extras_stage_growing: "Growing audience",
    register_step_extras_stage_pro: "Full-time creator",

    register_step_extras_marketing_label: "Stay in the loop?",
    register_step_extras_marketing_text:
      "Yes, I'd like occasional tips, feature updates and content ideas by email.",
    register_step_extras_marketing_helper:
      "No spam. You can opt out anytime with one click.",

    register_step_extras_notifications_label: "Enable notifications?",
    register_step_extras_notifications_text:
      "Yes, send me reminders for my scheduled posts & content ideas.",
    register_step_extras_notifications_helper:
      "You can turn this off anytime in account settings.",

    register_step_extras_back: "← Back",
    register_step_extras_submit_creating: "Creating account…",
    register_step_extras_submit: "Create account 🎉",
    confirm_email_title_loading: "Confirming…",
    confirm_email_title_ok: "Email confirmed 🎉",
    confirm_email_title_error: "Confirmation issue",

    confirm_email_message_loading: "Confirming your email…",
    confirm_email_invalid_link: "Invalid confirmation link.",
    confirm_email_success_message: "Email confirmed! You can now log in.",
    confirm_email_expired_link: "This confirmation link is invalid or has expired.",

    confirm_email_go_to_login: "Go to login",
    // Forgot password
    forgot_title: "Forgot Password",
    forgot_subtitle: "Enter your email address, and we’ll send you a reset link.",
    forgot_email_placeholder: "you@example.com",
    forgot_button_loading: "Sending...",
    forgot_button: "Send Reset Link",
    forgot_success_message: "✅ If that email exists, a reset link was sent!",
    forgot_error_message: "⚠️ Something went wrong. Please try again.",
    forgot_back_to_login: "Back to login",

    // Reset password
    reset_title: "Reset Password",
    reset_subtitle: "Enter a new password for your account.",
    reset_password_placeholder: "New password",
    reset_confirm_placeholder: "Confirm password",
    reset_button_loading: "Resetting...",
    reset_button: "Set New Password",
    reset_error_mismatch: "❌ Passwords do not match.",
    reset_error_invalid_link: "Invalid reset link.",
    reset_success_message:
      "✅ Password reset successful! Redirecting to login...",
    reset_error_failed:
      "⚠️ Reset failed. Link may be invalid or expired.",

    },

  fr: {
    app_name: "Polypost",
    navbar_logo_alt: "Logo Polypost",
    navbar_use_cases: "Cas d'utilisation",
    navbar_pricing: "Tarifs",
    navbar_language: "Langue",
    navbar_notifications_title: "Notifications",
    navbar_notifications_loading: "Chargement…",
    navbar_notifications_empty:
        "Aucune notification pour le moment. Nous vous préviendrons avant les publications programmées et pour les mises à jour importantes.",
    navbar_login: "Se connecter",
    navbar_get_started: "Commencer",
    navbar_account_fallback: "Compte",
    navbar_dashboard: "Tableau de bord",
    navbar_account: "Compte",
    navbar_gallery: "Galerie",
    navbar_support: "Support",
    navbar_logout: "Se déconnecter",
    landing_logo_alt: "Logo complet Polypost",
    landing_tagline: "Co-pilote pour les réseaux sociaux",
    landing_title_main: "Assistant tout-en-un pour votre contenu",
    landing_title_highlight: "pour créateurs",
    landing_subtitle:
      "Générez des idées pertinentes, écrivez des légendes qui arrêtent le scroll et planifiez vos meilleurs créneaux de publication — sans passer vos journées à jongler entre les plateformes.",
    landing_login_cta: "Se connecter",
    landing_register_cta: "Créer un compte",
    landing_overview_label: "Vue d'ensemble du jour",
    landing_overview_title: "Tableau de bord Polypost",
    landing_overview_badge: "Aperçu en direct",
    landing_stats_ideas: "Idées",
    landing_stats_drafts: "Brouillons",
    landing_stats_scheduled: "Planifiés",
    login_title: "Connexion",
    login_username_placeholder: "Nom d'utilisateur",
    login_password_placeholder: "Mot de passe",
    login_button: "Se connecter",
    login_error: "Nom d'utilisateur ou mot de passe incorrect.",
    login_forgot_password: "Mot de passe oublié ?",
    login_no_account: "Pas encore de compte ?",
    login_register_link: "Créer un compte",
    register_get_started: "Commencer",
    register_title: "Créez votre",
    register_title_highlight: "compte Polypost",
    register_subtitle:
      "Nous utilisons ces informations pour personnaliser les idées, les légendes et les horaires de publication. Cela ne prend qu’une minute.",

    register_success_message:
      "🎉 Votre compte a été créé ! Merci de vérifier votre boîte mail pour confirmer votre adresse avant de vous connecter.",
    register_error_message:
      "Impossible de créer votre compte. Vérifiez vos informations ou réessayez.",

    register_step_title_1: "Informations du compte",
    register_step_title_2: "Informations de base",
    register_step_title_3: "Style et audience",
    register_step_title_4: "Options supplémentaires",

    register_step_label: "Étape {{step}} sur {{total}}",
    register_progress_label: "{{percent}} % terminé",

    register_sidebar_title: "Pourquoi toutes ces questions ?",
    register_sidebar_item_1:
      "Nous adaptons les idées à votre niche et à votre audience.",
    register_sidebar_item_2:
      "Nous ajustons les légendes à votre ton de voix préféré.",
    register_sidebar_item_3:
      "Nous suggérons des horaires de publication selon vos plateformes.",
    register_sidebar_item_4:
      "Vous pouvez tout modifier plus tard à tout moment.",

    register_step_account_fill_all:
    "Veuillez remplir tous les champs pour continuer.",
    register_step_account_username_label: "Nom d'utilisateur",
    register_step_account_username_placeholder: "Choisissez un nom d'utilisateur",
    register_step_account_email_label: "Email",
    register_step_account_email_placeholder: "vous@exemple.com",
    register_step_account_password_label: "Mot de passe",
    register_step_account_password_placeholder: "Créez un mot de passe sécurisé",
    register_step_account_password_help:
      "Utilisez au moins 8 caractères, idéalement avec un mélange de lettres et de chiffres.",
    register_step_account_next: "Suivant →",
    register_language_en: "Anglais",
    register_language_fr: "Français",
    register_language_es: "Espagnol",
    register_language_pt: "Portugais",
    register_step_basics_country_city_required:
      "Veuillez choisir un pays et renseigner votre ville.",
    register_step_basics_language_label: "Langue préférée",
    register_step_basics_platform_label: "Plateforme principale",
    register_step_basics_country_label: "Pays",
    register_step_basics_city_label: "Ville",
    register_step_basics_city_placeholder: "Paris, New York, São Paulo…",
    register_step_basics_city_help:
      "Plus tard, nous pourrons brancher une API d'autocomplétion ici.",
    register_step_basics_back: "← Retour",
    register_step_basics_next: "Suivant →",
    register_step_tone_vibe_label: "Ambiance générale",
    register_step_tone_vibe_fun: "Amusant",
    register_step_tone_vibe_chill: "Relax",
    register_step_tone_vibe_bold: "Audacieux",
    register_step_tone_vibe_educational: "Éducatif",
    register_step_tone_vibe_luxury: "Luxe",
    register_step_tone_vibe_cozy: "Cocooning",
    register_step_tone_vibe_high_energy: "Très énergique",
    register_step_tone_vibe_mysterious: "Mystérieux",
    register_step_tone_vibe_wholesome: "Bienveillant",

    register_step_tone_tone_label: "Tonalité",
    register_step_tone_tone_casual: "Décontracté",
    register_step_tone_tone_professional: "Professionnel",
    register_step_tone_tone_playful: "Ludique",
    register_step_tone_tone_flirty: "Séduisant",
    register_step_tone_tone_inspirational: "Inspirant",
    register_step_tone_tone_sarcastic: "Sarcastique",
    register_step_tone_tone_empathetic: "Empathique",
    register_step_tone_tone_confident: "Assuré",
    register_step_tone_niche_label: "Niche",
    register_step_tone_niche_placeholder:
      "Fitness, humour, beauté, finance…",
    register_step_tone_target_label: "Audience cible",
    register_step_tone_target_placeholder:
      "ex : femmes Gen Z, parents débordés…",
    register_step_tone_platforms_label: "Principales plateformes où tu postes",
    register_step_tone_platforms_hint: "(tu peux en choisir plusieurs)",
    register_step_tone_content_lang_label: "Langue principale de ton contenu",
    register_step_tone_content_lang_help:
      "Nous prioriserons cette langue pour générer tes légendes.",
    register_step_tone_niche_required:
      "Indique-nous ta niche pour que l’on puisse adapter les idées.",
    register_step_tone_back: "← Retour",
    register_step_tone_next: "Suivant →",

    // Brand assistant
    register_step_tone_brand_intro: "Tu ne sais pas trop quoi mettre ici ?",
    register_step_tone_brand_optional: "Optionnel",
    register_step_tone_brand_description:
      "laisse l’IA te proposer une vibe, un ton et une niche selon tes objectifs.",
    register_step_tone_brand_button: "Ouvrir l’assistant de marque",
    register_step_tone_brand_title: "Assistant de marque (optionnel)",
    register_step_tone_brand_niche_placeholder:
      "Ta niche (ex : fitness, OF, humour…)",
    register_step_tone_brand_target_placeholder:
      "Audience cible (ex : hommes Gen Z, abonnés OF…)",
    register_step_tone_brand_goals_placeholder:
      "Tes objectifs (augmenter les abonnés, vendre du contenu, construire une marque long terme…)",
    register_step_tone_brand_comfort_placeholder:
      "Niveau de confort (ex : timide, flirty, audacieux, anonyme…)",
    register_step_tone_brand_error:
      "Impossible de générer des personas de marque. Réessaie.",
    register_step_tone_brand_thinking: "Réflexion en cours…",
    register_step_tone_brand_generate: "Générer des personas de marque",
    register_step_tone_brand_pick_persona:
      "Choisis le persona qui te ressemble le plus. Tu pourras tout modifier ensuite.",
    register_step_tone_brand_persona_prefix: "Persona",
    register_step_tone_brand_selected: "Sélectionné ✓",
    register_step_tone_brand_use_persona: "Utiliser ce persona",
    register_step_tone_brand_vibe_label: "Vibe :",
    register_step_tone_brand_tone_label: "Ton :",
    register_step_tone_brand_pillars_label: "Piliers de contenu :",
    register_step_tone_brand_bio_label: "Idée de bio :",

    // Sample posts
    register_step_tone_samples_title: "Exemples de posts dans ce style",
    register_step_tone_samples_generating: "Génération…",
    register_step_tone_samples_generate_button: "Générer des exemples de posts",
    register_step_tone_samples_hint:
      "Clique sur « Générer des exemples de posts » pour voir à quoi ton contenu pourrait ressembler.",
    
    register_step_extras_stage_question:
      "Où en es-tu dans ton parcours de créateur·rice ?",
    register_step_extras_stage_starter: "Je débute",
    register_step_extras_stage_growing: "Je fais grandir mon audience",
    register_step_extras_stage_pro: "Créateur·rice à plein temps",

    register_step_extras_marketing_label: "Rester informé·e ?",
    register_step_extras_marketing_text:
      "Oui, je veux recevoir de temps en temps des conseils, nouveautés et idées de contenu par email.",
    register_step_extras_marketing_helper:
      "Pas de spam. Tu peux te désinscrire à tout moment en un clic.",

    register_step_extras_notifications_label: "Activer les notifications ?",
    register_step_extras_notifications_text:
      "Oui, envoyez-moi des rappels pour mes posts programmés et mes idées de contenu.",
    register_step_extras_notifications_helper:
      "Tu pourras désactiver ça à tout moment dans les paramètres du compte.",

    register_step_extras_back: "← Retour",
    register_step_extras_submit_creating: "Création du compte…",
    register_step_extras_submit: "Créer mon compte 🎉",
    confirm_email_title_loading: "Confirmation…",
    confirm_email_title_ok: "Email confirmé 🎉",
    confirm_email_title_error: "Problème de confirmation",

    confirm_email_message_loading: "Nous confirmons votre email…",
    confirm_email_invalid_link: "Lien de confirmation invalide.",
    confirm_email_success_message: "Email confirmé ! Vous pouvez maintenant vous connecter.",
    confirm_email_expired_link: "Ce lien de confirmation est invalide ou expiré.",

    confirm_email_go_to_login: "Aller à la connexion",
    // Forgot password
    forgot_title: "Mot de passe oublié",
    forgot_subtitle:
      "Saisis ton adresse email et nous t’enverrons un lien de réinitialisation.",
    forgot_email_placeholder: "toi@exemple.com",
    forgot_button_loading: "Envoi en cours…",
    forgot_button: "Envoyer le lien",
    forgot_success_message:
      "✅ Si cet email existe, un lien de réinitialisation a été envoyé !",
    forgot_error_message:
      "⚠️ Une erreur s’est produite. Merci de réessayer.",
    forgot_back_to_login: "Retour à la connexion",

    // Reset password
    reset_title: "Réinitialiser le mot de passe",
    reset_subtitle: "Entre un nouveau mot de passe pour ton compte.",
    reset_password_placeholder: "Nouveau mot de passe",
    reset_confirm_placeholder: "Confirme le mot de passe",
    reset_button_loading: "Réinitialisation…",
    reset_button: "Définir le nouveau mot de passe",
    reset_error_mismatch: "❌ Les mots de passe ne correspondent pas.",
    reset_error_invalid_link: "Lien de réinitialisation invalide.",
    reset_success_message:
      "✅ Mot de passe réinitialisé avec succès ! Redirection vers la connexion…",
    reset_error_failed:
      "⚠️ La réinitialisation a échoué. Le lien est peut-être invalide ou expiré.",

    },

  es: {
    app_name: "Polypost",
    navbar_logo_alt: "Logotipo de Polypost",
    navbar_use_cases: "Casos de uso",
    navbar_pricing: "Precios",
    navbar_language: "Idioma",
    navbar_notifications_title: "Notificaciones",
    navbar_notifications_loading: "Cargando…",
    navbar_notifications_empty:
        "Todavía no hay notificaciones. Te avisaremos antes de las publicaciones programadas y de las actualizaciones importantes.",
    navbar_login: "Iniciar sesión",
    navbar_get_started: "Empezar",
    navbar_account_fallback: "Cuenta",
    navbar_dashboard: "Panel",
    navbar_account: "Cuenta",
    navbar_gallery: "Galería",
    navbar_support: "Soporte",
    navbar_logout: "Cerrar sesión",
    landing_logo_alt: "Logotipo completo de Polypost",
    landing_tagline: "Copiloto para redes sociales",
    landing_title_main: "Asistente todo en uno para tu contenido",
    landing_title_highlight: "para creadores",
    landing_subtitle:
      "Genera ideas inteligentes, escribe textos que detienen el scroll y planifica tus mejores horarios de publicación, sin pasarte el día saltando entre plataformas.",
    landing_login_cta: "Iniciar sesión",
    landing_register_cta: "Crear una cuenta",
    landing_overview_label: "Resumen de hoy",
    landing_overview_title: "Panel de Polypost",
    landing_overview_badge: "Vista en tiempo real",
    landing_stats_ideas: "Ideas",
    landing_stats_drafts: "Borradores",
    landing_stats_scheduled: "Programados",
    login_title: "Iniciar sesión",
    login_username_placeholder: "Nombre de usuario",
    login_password_placeholder: "Contraseña",
    login_button: "Entrar",
    login_error: "Usuario o contraseña incorrectos.",
    login_forgot_password: "¿Olvidaste tu contraseña?",
    login_no_account: "¿No tienes una cuenta?",
    login_register_link: "Registrarse",
    register_get_started: "Empezar",
    register_title: "Crea tu",
    register_title_highlight: "cuenta de Polypost",
    register_subtitle:
      "Usamos estos datos para personalizar ideas, textos y horarios de publicación. Solo te llevará un minuto.",

    register_success_message:
      "🎉 Tu cuenta ha sido creada. Revisa tu correo para confirmar tu email antes de iniciar sesión.",
    register_error_message:
      "No se pudo crear tu cuenta. Revisa la información o inténtalo de nuevo.",

    register_step_title_1: "Datos de la cuenta",
    register_step_title_2: "Información básica",
    register_step_title_3: "Estilo y audiencia",
    register_step_title_4: "Extras",

    register_step_label: "Paso {{step}} de {{total}}",
    register_progress_label: "{{percent}} % completado",

    register_sidebar_title: "¿Por qué tantas preguntas?",
    register_sidebar_item_1:
      "Adaptamos las ideas a tu nicho y a tu audiencia.",
    register_sidebar_item_2:
      "Ajustamos los textos a tu tono de voz preferido.",
    register_sidebar_item_3:
      "Sugerimos horarios de publicación según tus plataformas.",
    register_sidebar_item_4:
      "Puedes editar todo más adelante cuando quieras.",

    register_step_account_fill_all:
      "Completa todos los campos para continuar.",
    register_step_account_username_label: "Nombre de usuario",
    register_step_account_username_placeholder: "Elige un nombre de usuario",
    register_step_account_email_label: "Email",
    register_step_account_email_placeholder: "tu@ejemplo.com",
    register_step_account_password_label: "Contraseña",
    register_step_account_password_placeholder: "Crea una contraseña segura",
    register_step_account_password_help:
      "Usa al menos 8 caracteres, idealmente con una mezcla de letras y números.",
    register_step_account_next: "Siguiente →",
    register_language_en: "Inglés",
    register_language_fr: "Francés",
    register_language_es: "Español",
    register_language_pt: "Portugués",
    register_step_basics_country_city_required:
      "Selecciona un país e indica tu ciudad.",
    register_step_basics_language_label: "Idioma preferido",
    register_step_basics_platform_label: "Plataforma principal",
    register_step_basics_country_label: "País",
    register_step_basics_city_label: "Ciudad",
    register_step_basics_city_placeholder: "París, Nueva York, São Paulo…",
    register_step_basics_city_help:
      "Más adelante podremos conectar aquí una API de autocompletado.",
    register_step_basics_back: "← Atrás",
    register_step_basics_next: "Siguiente →",
    register_step_tone_vibe_label: "Vibra general",
    register_step_tone_vibe_fun: "Divertida",
    register_step_tone_vibe_chill: "Tranquila",
    register_step_tone_vibe_bold: "Atrevida",
    register_step_tone_vibe_educational: "Educativa",
    register_step_tone_vibe_luxury: "De lujo",
    register_step_tone_vibe_cozy: "Acogedora",
    register_step_tone_vibe_high_energy: "Muy enérgica",
    register_step_tone_vibe_mysterious: "Misteriosa",
    register_step_tone_vibe_wholesome: "Bonita / sana",

    register_step_tone_tone_label: "Tono de voz",
    register_step_tone_tone_casual: "Casual",
    register_step_tone_tone_professional: "Profesional",
    register_step_tone_tone_playful: "Juguetón",
    register_step_tone_tone_flirty: "Coqueto",
    register_step_tone_tone_inspirational: "Inspirador",
    register_step_tone_tone_sarcastic: "Sarcástico",
    register_step_tone_tone_empathetic: "Empático",
    register_step_tone_tone_confident: "Seguro",
    register_step_tone_niche_label: "Nicho",
    register_step_tone_niche_placeholder:
      "Fitness, comedia, belleza, finanzas…",
    register_step_tone_target_label: "Audiencia objetivo",
    register_step_tone_target_placeholder:
      "ej.: mujeres Gen Z, padres ocupados…",
    register_step_tone_platforms_label: "Plataformas principales donde publicas",
    register_step_tone_platforms_hint: "(puedes elegir varias)",
    register_step_tone_content_lang_label: "Idioma principal de tu contenido",
    register_step_tone_content_lang_help:
      "Daremos prioridad a este idioma al generar tus textos.",
    register_step_tone_niche_required:
      "Cuéntanos tu nicho para que podamos adaptar las ideas.",
    register_step_tone_back: "← Atrás",
    register_step_tone_next: "Siguiente →",

    // Brand assistant
    register_step_tone_brand_intro: "¿No sabes muy bien qué poner aquí?",
    register_step_tone_brand_optional: "Opcional",
    register_step_tone_brand_description:
      "deja que la IA te sugiera una vibra, tono y nicho según tus objetivos.",
    register_step_tone_brand_button: "Abrir asistente de marca",
    register_step_tone_brand_title: "Asistente de marca (opcional)",
    register_step_tone_brand_niche_placeholder:
      "Tu nicho (ej.: fitness, OF, comedia…)",
    register_step_tone_brand_target_placeholder:
      "Audiencia objetivo (ej.: hombres Gen Z, suscriptores de OF…)",
    register_step_tone_brand_goals_placeholder:
      "Tus objetivos (ganar suscriptores, vender contenido, construir una marca a largo plazo…)",
    register_step_tone_brand_comfort_placeholder:
      "Nivel de comodidad (ej.: tímido, coqueto, atrevido, anónimo…)",
    register_step_tone_brand_error:
      "No se pudieron generar personas de marca. Inténtalo de nuevo.",
    register_step_tone_brand_thinking: "Pensando…",
    register_step_tone_brand_generate: "Generar personas de marca",
    register_step_tone_brand_pick_persona:
      "Elige la persona que más se parezca a ti. Luego podrás editar todo.",
    register_step_tone_brand_persona_prefix: "Persona",
    register_step_tone_brand_selected: "Seleccionado ✓",
    register_step_tone_brand_use_persona: "Usar esta persona",
    register_step_tone_brand_vibe_label: "Vibra:",
    register_step_tone_brand_tone_label: "Tono:",
    register_step_tone_brand_pillars_label: "Pilares de contenido:",
    register_step_tone_brand_bio_label: "Idea de bio:",

    // Sample posts
    register_step_tone_samples_title: "Publicaciones de ejemplo con este estilo",
    register_step_tone_samples_generating: "Generando…",
    register_step_tone_samples_generate_button:
      "Generar publicaciones de ejemplo",
    register_step_tone_samples_hint:
      "Haz clic en « Generar publicaciones de ejemplo » para ver cómo podría sonar tu contenido.",

    register_step_extras_stage_question:
      "¿En qué punto estás de tu camino como creador/a?",
    register_step_extras_stage_starter: "Acabo de empezar",
    register_step_extras_stage_growing: "Estoy haciendo crecer mi audiencia",
    register_step_extras_stage_pro: "Soy creador/a a tiempo completo",

    register_step_extras_marketing_label: "¿Quieres estar al día?",
    register_step_extras_marketing_text:
      "Sí, quiero recibir de vez en cuando consejos, novedades y ideas de contenido por email.",
    register_step_extras_marketing_helper:
      "Nada de spam. Puedes darte de baja en cualquier momento con un solo clic.",

    register_step_extras_notifications_label: "¿Activar notificaciones?",
    register_step_extras_notifications_text:
      "Sí, mándame recordatorios de mis publicaciones programadas e ideas de contenido.",
    register_step_extras_notifications_helper:
      "Podrás desactivar esto en cualquier momento en la configuración de la cuenta.",

    register_step_extras_back: "← Atrás",
    register_step_extras_submit_creating: "Creando cuenta…",
    register_step_extras_submit: "Crear cuenta 🎉",
    confirm_email_title_loading: "Confirmando…",
    confirm_email_title_ok: "Email confirmado 🎉",
    confirm_email_title_error: "Problema de confirmación",

    confirm_email_message_loading: "Confirmando tu email…",
    confirm_email_invalid_link: "Enlace de confirmación inválido.",
    confirm_email_success_message: "¡Email confirmado! Ya puedes iniciar sesión.",
    confirm_email_expired_link: "Este enlace de confirmación es inválido o ha expirado.",

    confirm_email_go_to_login: "Ir a iniciar sesión",
    // Forgot password
    forgot_title: "¿Has olvidado tu contraseña?",
    forgot_subtitle:
      "Escribe tu correo electrónico y te enviaremos un enlace para restablecerla.",
    forgot_email_placeholder: "tú@ejemplo.com",
    forgot_button_loading: "Enviando...",
    forgot_button: "Enviar enlace de restablecimiento",
    forgot_success_message:
      "✅ Si ese correo existe, se ha enviado un enlace para restablecer la contraseña.",
    forgot_error_message:
      "⚠️ Algo ha salido mal. Inténtalo de nuevo.",
    forgot_back_to_login: "Volver a iniciar sesión",

    // Reset password
    reset_title: "Restablecer contraseña",
    reset_subtitle: "Introduce una nueva contraseña para tu cuenta.",
    reset_password_placeholder: "Nueva contraseña",
    reset_confirm_placeholder: "Confirmar contraseña",
    reset_button_loading: "Restableciendo...",
    reset_button: "Guardar nueva contraseña",
    reset_error_mismatch: "❌ Las contraseñas no coinciden.",
    reset_error_invalid_link: "Enlace de restablecimiento no válido.",
    reset_success_message:
      "✅ Contraseña restablecida correctamente. Redirigiendo al inicio de sesión...",
    reset_error_failed:
      "⚠️ Error al restablecer la contraseña. El enlace puede ser inválido o haber expirado.",

      },

  pt: {
    app_name: "Polypost",
    navbar_logo_alt: "Logotipo da Polypost",
    navbar_use_cases: "Casos de uso",
    navbar_pricing: "Preços",
    navbar_language: "Idioma",
    navbar_notifications_title: "Notificações",
    navbar_notifications_loading: "Carregando…",
    navbar_notifications_empty:
        "Ainda não há notificações. Vamos avisar antes das publicações agendadas e das atualizações importantes.",
    navbar_login: "Entrar",
    navbar_get_started: "Começar",
    navbar_account_fallback: "Conta",
    navbar_dashboard: "Painel",
    navbar_account: "Conta",
    navbar_gallery: "Galeria",
    navbar_support: "Suporte",
    navbar_logout: "Sair",
    landing_logo_alt: "Logotipo completo da Polypost",
    landing_tagline: "Co-piloto para redes sociais",
    landing_title_main: "Assistente tudo-em-um para o seu conteúdo",
    landing_title_highlight: "para criadores",
    landing_subtitle:
      "Gere ideias inteligentes, escreva legendas que prendem a atenção e planeje os melhores horários de postagem — sem passar o dia todo pulando entre plataformas.",
    landing_login_cta: "Entrar",
    landing_register_cta: "Criar uma conta",
    landing_overview_label: "Visão geral de hoje",
    landing_overview_title: "Painel da Polypost",
    landing_overview_badge: "Pré-visualização em tempo real",
    landing_stats_ideas: "Ideias",
    landing_stats_drafts: "Rascunhos",
    landing_stats_scheduled: "Agendados",
    login_title: "Entrar",
    login_username_placeholder: "Nome de usuário",
    login_password_placeholder: "Senha",
    login_button: "Login",
    login_error: "Nome de usuário ou senha incorretos.",
    login_forgot_password: "Esqueceu sua senha?",
    login_no_account: "Ainda não tem uma conta?",
    login_register_link: "Criar conta",
    register_get_started: "Começar",
    register_title: "Crie sua",
    register_title_highlight: "conta Polypost",
    register_subtitle:
      "Usamos esses dados para personalizar ideias, legendas e horários de postagem. Leva apenas um minuto.",

    register_success_message:
      "🎉 Sua conta foi criada! Verifique seu e-mail para confirmar o endereço antes de fazer login.",
    register_error_message:
      "Não foi possível criar sua conta. Verifique as informações ou tente novamente.",

    register_step_title_1: "Dados da conta",
    register_step_title_2: "Informações básicas",
    register_step_title_3: "Estilo e público",
    register_step_title_4: "Extras",

    register_step_label: "Etapa {{step}} de {{total}}",
    register_progress_label: "{{percent}}% concluído",

    register_sidebar_title: "Por que todas essas perguntas?",
    register_sidebar_item_1:
      "Nós alinhamos as ideias ao seu nicho e público.",
    register_sidebar_item_2:
      "Ajustamos as legendas ao seu tom de voz preferido.",
    register_sidebar_item_3:
      "Sugerimos horários de postagem com base nas suas plataformas.",
    register_sidebar_item_4:
      "Você pode editar tudo depois, a qualquer momento.",
    register_step_account_fill_all:
      "Preencha todos os campos para continuar.",
    register_step_account_username_label: "Nome de usuário",
    register_step_account_username_placeholder: "Escolha um nome de usuário",
    register_step_account_email_label: "Email",
    register_step_account_email_placeholder: "voce@exemplo.com",
    register_step_account_password_label: "Senha",
    register_step_account_password_placeholder: "Crie uma senha segura",
    register_step_account_password_help:
      "Use pelo menos 8 caracteres, de preferência com uma mistura de letras e números.",
    register_step_account_next: "Próximo →",
    register_language_en: "Inglês",
    register_language_fr: "Francês",
    register_language_es: "Espanhol",
    register_language_pt: "Português",
    register_step_basics_country_city_required:
      "Selecione um país e informe a sua cidade.",
    register_step_basics_language_label: "Idioma preferido",
    register_step_basics_platform_label: "Plataforma principal",
    register_step_basics_country_label: "País",
    register_step_basics_city_label: "Cidade",
    register_step_basics_city_placeholder: "Paris, Nova Iorque, São Paulo…",
    register_step_basics_city_help:
      "Depois podemos conectar uma API de autocompletar aqui.",
    register_step_basics_back: "← Voltar",
    register_step_basics_next: "Próximo →",
    register_step_tone_vibe_label: "Clima geral",
    register_step_tone_vibe_fun: "Divertido",
    register_step_tone_vibe_chill: "Tranquilo",
    register_step_tone_vibe_bold: "Ousado",
    register_step_tone_vibe_educational: "Educativo",
    register_step_tone_vibe_luxury: "Luxuoso",
    register_step_tone_vibe_cozy: "Aconchegante",
    register_step_tone_vibe_high_energy: "Muito energético",
    register_step_tone_vibe_mysterious: "Misterioso",
    register_step_tone_vibe_wholesome: "Leve / positivo",

    register_step_tone_tone_label: "Tom de voz",
    register_step_tone_tone_casual: "Casual",
    register_step_tone_tone_professional: "Profissional",
    register_step_tone_tone_playful: "Brincalhão",
    register_step_tone_tone_flirty: "Flertante",
    register_step_tone_tone_inspirational: "Inspirador",
    register_step_tone_tone_sarcastic: "Sarcástico",
    register_step_tone_tone_empathetic: "Empático",
    register_step_tone_tone_confident: "Confiante",
    register_step_tone_niche_label: "Nicho",
    register_step_tone_niche_placeholder:
      "Fitness, comédia, beleza, finanças…",
    register_step_tone_target_label: "Público-alvo",
    register_step_tone_target_placeholder:
      "ex.: mulheres Gen Z, pais ocupados…",
    register_step_tone_platforms_label: "Principais plataformas onde você posta",
    register_step_tone_platforms_hint: "(você pode escolher várias)",
    register_step_tone_content_lang_label: "Idioma principal do seu conteúdo",
    register_step_tone_content_lang_help:
      "Vamos priorizar esse idioma ao gerar suas legendas.",
    register_step_tone_niche_required:
      "Conte qual é o seu nicho para podermos adaptar as ideias.",
    register_step_tone_back: "← Voltar",
    register_step_tone_next: "Próximo →",

    // Brand assistant
    register_step_tone_brand_intro: "Não sabe muito bem o que colocar aqui?",
    register_step_tone_brand_optional: "Opcional",
    register_step_tone_brand_description:
      "deixe a IA sugerir uma vibe, tom e nicho com base nos seus objetivos.",
    register_step_tone_brand_button: "Abrir assistente de marca",
    register_step_tone_brand_title: "Assistente de marca (opcional)",
    register_step_tone_brand_niche_placeholder:
      "Seu nicho (ex.: fitness, OF, comédia…)",
    register_step_tone_brand_target_placeholder:
      "Público-alvo (ex.: homens Gen Z, assinantes de OF…)",
    register_step_tone_brand_goals_placeholder:
      "Seus objetivos (ganhar assinantes, vender conteúdo, construir uma marca de longo prazo…)",
    register_step_tone_brand_comfort_placeholder:
      "Nível de conforto (ex.: tímido, flirty, ousado, anônimo…)",
    register_step_tone_brand_error:
      "Não foi possível gerar personas de marca. Tente novamente.",
    register_step_tone_brand_thinking: "Pensando…",
    register_step_tone_brand_generate: "Gerar personas de marca",
    register_step_tone_brand_pick_persona:
      "Escolha a persona que mais combina com você. Você poderá editar tudo depois.",
    register_step_tone_brand_persona_prefix: "Persona",
    register_step_tone_brand_selected: "Selecionado ✓",
    register_step_tone_brand_use_persona: "Usar esta persona",
    register_step_tone_brand_vibe_label: "Vibe:",
    register_step_tone_brand_tone_label: "Tom:",
    register_step_tone_brand_pillars_label: "Pilares de conteúdo:",
    register_step_tone_brand_bio_label: "Ideia de bio:",

    // Sample posts
    register_step_tone_samples_title: "Posts de exemplo nesse estilo",
    register_step_tone_samples_generating: "Gerando…",
    register_step_tone_samples_generate_button:
      "Gerar posts de exemplo",
    register_step_tone_samples_hint:
      "Clique em « Gerar posts de exemplo » para ver como o seu conteúdo pode soar.",

    register_step_extras_stage_question:
      "Em que fase você está como criador(a)?",
    register_step_extras_stage_starter: "Estou só começando",
    register_step_extras_stage_growing: "Fazendo minha audiência crescer",
    register_step_extras_stage_pro: "Criador(a) em tempo integral",

    register_step_extras_marketing_label: "Quer ficar por dentro?",
    register_step_extras_marketing_text:
      "Sim, quero receber de vez em quando dicas, novidades e ideias de conteúdo por e-mail.",
    register_step_extras_marketing_helper:
      "Nada de spam. Você pode cancelar a qualquer momento com um clique.",

    register_step_extras_notifications_label: "Ativar notificações?",
    register_step_extras_notifications_text:
      "Sim, envie lembretes dos meus posts agendados e ideias de conteúdo.",
    register_step_extras_notifications_helper:
      "Você pode desativar isso a qualquer momento nas configurações da conta.",

    register_step_extras_back: "← Voltar",
    register_step_extras_submit_creating: "Criando conta…",
    register_step_extras_submit: "Criar conta 🎉",
    confirm_email_title_loading: "Confirmando…",
    confirm_email_title_ok: "Email confirmado 🎉",
    confirm_email_title_error: "Problema na confirmação",

    confirm_email_message_loading: "Confirmando seu email…",
    confirm_email_invalid_link: "Link de confirmação inválido.",
    confirm_email_success_message: "Email confirmado! Agora você já pode entrar.",
    confirm_email_expired_link: "Este link de confirmação é inválido ou expirou.",

    confirm_email_go_to_login: "Ir para login",
    // Forgot password
    forgot_title: "Esqueceu a senha?",
    forgot_subtitle:
      "Digite seu e-mail e nós enviaremos um link para redefinir a senha.",
    forgot_email_placeholder: "voce@exemplo.com",
    forgot_button_loading: "Enviando...",
    forgot_button: "Enviar link de redefinição",
    forgot_success_message:
      "✅ Se esse e-mail existir, um link de redefinição foi enviado!",
    forgot_error_message:
      "⚠️ Algo deu errado. Tente novamente.",
    forgot_back_to_login: "Voltar para login",

    // Reset password
    reset_title: "Redefinir senha",
    reset_subtitle: "Digite uma nova senha para a sua conta.",
    reset_password_placeholder: "Nova senha",
    reset_confirm_placeholder: "Confirmar senha",
    reset_button_loading: "Redefinindo...",
    reset_button: "Definir nova senha",
    reset_error_mismatch: "❌ As senhas não coincidem.",
    reset_error_invalid_link: "Link de redefinição inválido.",
    reset_success_message:
      "✅ Senha redefinida com sucesso! Redirecionando para o login...",
    reset_error_failed:
      "⚠️ Falha ao redefinir a senha. O link pode ser inválido ou ter expirado.",


    },
};

export function t(lang: SupportedLang, key: string): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}
