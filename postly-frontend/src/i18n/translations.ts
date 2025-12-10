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

        // Use cases page
    usecases_header_label: "Use cases",
    usecases_title_main: "Make Polypost",
    usecases_title_highlight: "work for your style",
    usecases_subtitle:
      "Pick a preset that matches your platform, language and vibe. We’ll copy its settings directly into your creator profile (vibe, tone, niche, audience…) so ideas and captions feel on-brand from day one.",

    usecases_brand_title: "Define your creator brand (AI-powered)",
    usecases_brand_subtitle:
      "Not sure about your vibe, tone or niche? Fill this in and Polypost will suggest brand personas with recommended style, bio and content pillars.",

    usecases_brand_niche_placeholder:
      "Your niche (fitness, modelling, gamer, OF, beauty...)",
    usecases_brand_target_placeholder: "Who do you want to attract?",
    usecases_brand_goals_placeholder:
      "Your goals (grow fast, build fans, increase OF income...)",
    usecases_brand_comfort_placeholder:
      "Comfort level (playful, serious, explicit, introverted...)",

    usecases_brand_error:
      "⚠️ Could not generate brand personas. Please try again.",
    usecases_brand_button_thinking: "Thinking…",
    usecases_brand_button_generate: "Generate brand personas",
    usecases_brand_pick_persona:
      "Pick the persona that resonates most with your creator identity:",
    usecases_brand_button_applied: "Applied ✓",
    usecases_brand_button_use_persona: "Use this persona",

    usecases_bio_no_base:
      "No base bio to refine for this persona.",
    usecases_bio_refine_error: "⚠️ Could not refine bio.",
    usecases_bio_copied_toast: "📋 Bio copied to clipboard",

    usecases_bio_short_label: "Short bio",
    usecases_bio_long_label: "Long bio",
    usecases_bio_cta_label: "CTA-optimized",
    usecases_bio_fun_label: "Fun / playful",
    usecases_bio_refine_button: "Refine bio",

    usecases_toast_persona_applied:
      "🎉 Brand persona applied to your profile!",
    usecases_toast_persona_apply_error:
      "⚠️ Could not apply persona. Please try again.",

    usecases_how_title: "How creators use Polypost",
    usecases_how_step1:
      "1. Pick a preset that matches your main platform (e.g. OF, IG Reels, TikTok trends…).",
    usecases_how_step2:
      "2. We copy the settings (vibe, tone, niche, target audience, language) into your profile.",
    usecases_how_step3:
      "3. Generate ideas & captions from the Dashboard — they’ll be aligned with the preset.",
    usecases_how_step4:
      "4. Tweak anytime from your Account page if you change style or target.",

    usecases_presets_title: "Preset library",
    usecases_presets_subtitle:
      "We’re adding curated setups for typical creator profiles: OF, Instagram models, cosplay, fitness, gaming and more.",
    usecases_presets_note:
      "After applying a preset, go to your Dashboard and start generating — no extra setup needed.",

    usecases_loading_presets: "Loading presets…",
    usecases_empty_presets:
      "No presets yet. We’re still seeding the library — check back soon!",
    usecases_list_title: "Available presets",
    usecases_list_hint:
      "Click Apply preset to update your creator profile instantly.",
    usecases_apply_button: "Apply preset",
        // Dashboard
    dashboard_header_title: "Dashboard",
    dashboard_header_subtitle:
      "Generate content ideas, captions and schedule posts – all in one place.",
    dashboard_header_button_use_cases: "Use cases & templates",
    dashboard_header_button_gallery: "Open gallery",

    dashboard_quick_title: "Create something new",
    dashboard_quick_subtitle:
      "Generate ideas, captions or upload media to start drafting your next post.",

    dashboard_card_ideas_title: "Idea generator",
    dashboard_card_ideas_text: "Get hooks, angles and ideas tailored to your niche.",
    dashboard_card_ideas_button: "Open ideas",

    dashboard_card_upload_title: "Upload & Caption",
    dashboard_card_upload_text:
      "Upload an image or video and get a caption instantly.",
    dashboard_card_upload_button: "Open upload",

    dashboard_card_scheduler_title: "Smart scheduler",
    dashboard_card_scheduler_text:
      "See best times to post and plan your content calendar.",
    dashboard_card_scheduler_button: "Open scheduler",

    dashboard_stats_title: "Quick snapshot",
    dashboard_stats_ideas_label: "Ideas generated",
    dashboard_stats_drafts_label: "Drafts saved",
    dashboard_stats_scheduled_label: "Scheduled posts",

    dashboard_recent_title: "Recent drafts",
    dashboard_recent_link_all: "View all drafts →",
    dashboard_recent_empty: "No drafts yet. Generate ideas or upload to start.",
    dashboard_recent_untitled: "Untitled",
    dashboard_recent_type_media: "Media draft",
    dashboard_recent_type_idea: "Idea draft",
    dashboard_recent_open_button: "Open",

    dashboard_modal_ideas_title: "Idea generator",
    dashboard_modal_ideas_intro:
      "We’ll generate hooks and ideas for Instagram. Later you’ll be able to tweak your niche & platform.",
    dashboard_modal_ideas_button_generate: "Generate 5 ideas",
    dashboard_modal_ideas_button_generating: "Generating...",
    dashboard_modal_ideas_empty: "No ideas yet. Click the button above.",
    dashboard_modal_ideas_fallback_title: "Idea",
    dashboard_modal_ideas_caption_start_label: "Caption start:",
    dashboard_modal_ideas_twist_label: "Twist:",
    dashboard_modal_ideas_save_button: "Save draft",
    dashboard_modal_ideas_save_saving: "Saving...",
    dashboard_modal_ideas_plan_button: "Generate action plan",
    dashboard_modal_ideas_plan_generating: "Generating plan…",
    dashboard_modal_ideas_plan_ready: "✓ Action plan ready",
    dashboard_modal_ideas_plan_loading:
      "We’re breaking this idea into concrete steps…",
    dashboard_actionplan_title: "Action plan",

    dashboard_modal_upload_title: "Upload & Caption",
    dashboard_modal_upload_button: "Upload",

    dashboard_upload_status_uploading: "Uploading...",
    dashboard_upload_status_uploaded: "Uploaded ✅ — you can generate a caption now.",
    dashboard_upload_status_failed: "Upload failed.",
    dashboard_upload_status_need_upload: "Upload first.",
    dashboard_upload_caption_button: "Generate caption",
    dashboard_upload_status_caption_generating: "Generating caption...",
    dashboard_upload_status_caption_ready: "Caption generated ✅",
    dashboard_upload_status_caption_failed: "Caption generation failed.",
    dashboard_upload_status_need_caption: "Generate a caption first.",
    dashboard_upload_status_need_title:
      "Please add a title before saving this draft.",
    dashboard_upload_status_saved: "Media draft saved ✅",
    dashboard_upload_status_save_failed: "Failed to save draft.",

    dashboard_upload_caption_label: "Caption",
    dashboard_upload_draft_title_label: "Draft title",
    dashboard_upload_draft_title_placeholder:
      "e.g. Gym selfie before/after, Beach reel, Q&A story",
    dashboard_upload_save_button: "Save as draft",
    dashboard_upload_save_saving: "Saving...",

        // Scheduler
    scheduler_title: "Scheduler",
    scheduler_subtitle:
      "Click a day to add a reminder, or generate a posting plan.",

    scheduler_ai_button_generate: "Generate cross-platform posting plan",
    scheduler_ai_button_generating: "Generating cross-platform plan…",
    scheduler_ai_toast_prefix: "🎯 New posting plan added for: ",
    scheduler_ai_toast_generic: "🎯 New posting plan added to your calendar!",
    scheduler_ai_toast_error: "⚠️ Could not generate a posting plan.",

    scheduler_modal_title: "Reminders",
    scheduler_modal_existing_label: "Existing reminders",
    scheduler_modal_time_label: "Time",
    scheduler_modal_platform_label: "Platform",
    scheduler_modal_attach_label: "Attach a draft (optional)",
    scheduler_modal_no_draft_option: "No draft",
    scheduler_modal_note_label: "Note (optional)",
    scheduler_modal_note_placeholder: "e.g. Post Reel teaser here",
    scheduler_modal_notify_label: "Send me an email reminder.",
    scheduler_modal_close_button: "Close",
    scheduler_modal_save_button: "Add reminder",
    scheduler_modal_save_saving: "Saving…",
    scheduler_modal_delete_button: "Delete",

    scheduler_alert_delete_failed:
      "Could not delete reminder. Please try again.",
    scheduler_alert_save_failed:
      "Could not save reminder. Please try again.",
    scheduler_alert_suggestions_failed:
      "Could not load posting suggestions.",

    scheduler_suggestions_title: "Recommended posting times",
    scheduler_suggestions_platform_label: "Platform",
    scheduler_suggestions_button_generate: "Generate times",
    scheduler_suggestions_button_generating: "Generating…",
    scheduler_suggestions_click_hint:
      "Click a time to turn it into a reminder:",
    scheduler_suggestions_loading: "Loading suggestions…",
        // Reviews
    reviews_title: "What creators say",
    reviews_subtitle:
      "Help us improve Postly and see what others think.",
    reviews_loading: "Loading reviews…",
    reviews_empty:
      "No reviews yet. Be the first to share your feedback!",
    reviews_username_anonymous: "anonymous",
    reviews_summary_review_singular: "review",
    reviews_summary_review_plural: "reviews",

    reviews_success: "Thanks for your feedback! 💜",
    reviews_error:
      "Could not send your review. Please try again.",

    reviews_rating_label: "Your rating:",
    reviews_title_placeholder:
      "Optional title (e.g. 'Super useful for IG')",
    reviews_comment_placeholder:
      "Share how Postly helps (or what we could improve)…",
    reviews_button_submit: "Submit review",
    reviews_button_sending: "Sending…",
        // Account page
    account_title: "Account settings",
    account_subtitle: "Manage your creator profile, plan, and connections.",

    account_profile_title: "Profile",
    account_profile_subtitle:
      "Update your picture and basic info. We use this to personalise your experience.",
    account_profile_choose_file: "Choose file",
    account_profile_save_picture: "Save picture",
    account_profile_uploading: "Uploading...",
    account_profile_username_label: "Username:",
    account_profile_email_label: "Email:",

    account_billing_title: "Plan & billing",
    account_billing_loading: "Loading plan...",
    account_billing_current_plan_label: "Current plan:",
    account_billing_plan_pro_label: "Pro ($12/mo)",
    account_billing_plan_free_label: "Free",
    account_billing_upgrade_button: "Upgrade to Pro",
    account_billing_upgrade_redirecting: "Redirecting...",
    account_billing_view_pricing_link: "View all plans & pricing →",
    account_billing_on_pro_label: "You’re on Pro ✅",
    account_billing_stripe_note: "Payments are handled securely by Stripe.",
    account_billing_checkout_error:
      "Could not start checkout (did you set STRIPE_SECRET_KEY?).",

    account_prefs_title: "Creator preferences",
    account_prefs_subtitle:
      "These guide AI idea and caption generation across the app.",
    account_prefs_loading: "Loading...",
    account_prefs_saved: "Saved ✅",

    account_error_load_prefs: "Could not load preferences.",
    account_error_save_prefs: "Could not save preferences.",
    account_error_save_notifications:
      "Could not save notification preferences.",
    account_error_avatar: "Could not upload avatar.",

    account_prefs_vibe_label: "Vibe",
    account_prefs_vibe_placeholder: "fun, edgy, classy...",
    account_prefs_tone_label: "Tone",
    account_prefs_tone_placeholder: "casual, professional...",
    account_prefs_niche_label: "Niche",
    account_prefs_niche_placeholder: "fitness, beauty, gaming...",
    account_prefs_target_label: "Target audience",
    account_prefs_target_placeholder:
      "young women, OF subs, IG followers...",
    account_prefs_default_platform_label: "Default platform",
    account_prefs_active_platforms_label: "Active platforms",
    account_prefs_timezone_label: "Timezone",
    account_prefs_timezone_placeholder: "Europe/Paris",
    account_prefs_save_button: "Save preferences",
    account_prefs_save_saving: "Saving...",

    account_notifications_title: "Notifications",
    account_notifications_subtitle:
      "Choose what you want to receive from Postly.",
    account_notifications_content_label:
      "Content reminders (email / future push)",
    account_notifications_marketing_label:
      "Newsletter & product updates",
    account_notifications_save_button: "Save notification preferences",

    account_connected_title: "Connected accounts",
    account_connected_ig_coming: "Coming soon...",
    account_connected_ig_connect_button: "Connect",
    account_connect_ig_error: "IG connect not implemented yet.",

    account_security_title: "Security",
    account_security_subtitle:
      "Change your password. You’ll stay logged in on this device.",
    account_security_current_pw_label: "Current password",
    account_security_new_pw_label: "New password",
    account_security_change_pw_button: "Change password",

    account_pw_change_success: "Password updated ✅",
    account_pw_change_error_generic:
      "Could not change password. Please try again.",

    account_logout_button: "Logout",
        // Gallery
    gallery_title: "My content gallery",
    gallery_subtitle:
      "All your saved ideas and media drafts created in Postly. Pin your favorites, archive what's done.",
    gallery_back_to_dashboard: "← Back to dashboard",

    gallery_filter_all: "All drafts",
    gallery_filter_pinned: "Pinned",
    gallery_filter_idea: "Ideas",
    gallery_filter_media: "Media drafts",

    gallery_loading: "Loading drafts...",
    gallery_empty_text:
      "No drafts yet. Go to the dashboard to generate ideas or upload media",
    gallery_empty_link_label: "dashboard",

    gallery_card_untitled: "Untitled draft",
    gallery_badge_pinned: "Pinned",
    gallery_badge_media: "Media draft",
    gallery_badge_idea: "Idea draft",
    gallery_card_idea_fallback: "Idea details",
    gallery_card_media_fallback:
      "Media draft with caption. Open to view / regenerate.",
    gallery_card_saved_prefix: "Saved",

    gallery_button_view_details: "View details",
    gallery_button_archive: "Archive",
    gallery_button_pin: "Pin",
    gallery_button_unpin: "Unpin",

    gallery_archive_confirm:
      "Archive this draft? It will disappear from this view.",

    gallery_modal_title_fallback: "Draft details",
    gallery_modal_subtitle_media:
      "Media draft – view image and regenerate caption.",
    gallery_modal_subtitle_idea:
      "Idea draft – tweak the content and save it.",

    gallery_modal_caption_label: "Caption",
    gallery_modal_caption_regenerate: "Regenerate",
    gallery_modal_caption_regenerating: "Regenerating...",
    gallery_modal_caption_placeholder:
      "Caption will appear here after generating.",
    gallery_modal_caption_generated_prefix: "New caption generated at",
    gallery_modal_caption_generated_suffix:
      "(not yet linked to this draft on the backend).",

    gallery_idea_title_label: "Title",
    gallery_idea_title_placeholder: "Idea title",
    gallery_idea_description_label: "Description",
    gallery_idea_description_placeholder: "Describe the content idea",
    gallery_idea_hook_label: "Hook used",
    gallery_idea_hook_placeholder: "Hook or angle used",
    gallery_idea_caption_starter_label: "Caption starter",
    gallery_idea_caption_starter_placeholder: "Suggested opening line",
    gallery_idea_twist_label: "Personal twist",
    gallery_idea_twist_placeholder:
      "How you want to personalize this idea",

    gallery_idea_save_button: "Save changes",
    gallery_idea_save_saving: "Saving...",

    gallery_action_plan_title: "Action plan",
        // Support
    support_eyebrow: "Need help?",
    support_title_prefix: "Contact",
    support_title_accent: "support",
    support_subtitle:
      "Found a bug, billing issue or have an idea? Send us a message and we’ll usually reply within 1–2 business days.",
    support_success:
      "✅ Thanks! Your message has been sent. We’ll get back to you by email.",
    support_error: "Could not send your message. Please try again.",

    support_label_email: "Email",
    support_label_subject: "Subject",
    support_label_category: "Category",
    support_label_message: "Message",
    support_placeholder_email: "you@example.com",
    support_placeholder_subject: "Short summary of your issue",
    support_placeholder_message:
      "Tell us what’s going on, steps to reproduce, links, etc.",
    support_button_sending: "Sending...",
    support_button_send: "Send message",

    support_category_bug: "Bug / something broke",
    support_category_billing: "Billing & subscriptions",
    support_category_idea: "Feature request / idea",
    support_category_other: "Other",

    support_sidebar_title: "What to include",
    support_sidebar_item_platforms:
      "Which platform(s) you’re using (IG, TikTok, OF…)",
    support_sidebar_item_action:
      "What you were trying to do when the issue happened",
    support_sidebar_item_errors:
      "Any error messages or screenshots",
    support_sidebar_billing_note:
      "For billing questions, please mention the email used on Stripe.",

    // Upload
    upload_title: "Upload",
    upload_subtitle:
      "Upload a media file and generate a caption using your Postly settings.",
    upload_button_upload: "Upload",
    upload_button_generate: "Generate caption",
    upload_caption_title: "Caption",

    upload_status_uploading: "Uploading...",
    upload_status_uploaded: "Uploaded. You can generate a caption now.",
    upload_status_failed: "Upload failed.",
    upload_status_upload_first: "Upload something first.",
    upload_status_generating: "Generating caption...",
    upload_status_caption_ok: "Caption generated ✅",
    upload_status_caption_failed: "Caption generation failed.",
    // Pricing
    pricing_header_badge: "Pricing",
    pricing_header_title: "Choose the plan that fits your creator journey",
    pricing_header_subtitle:
      "Start free, then upgrade when you're ready. Cancel anytime. All paid plans include higher limits for ideas, captions and scheduling.",

    pricing_plan_free_name: "Free",
    pricing_plan_free_description: "Perfect if you're just trying Postly out.",
    pricing_plan_free_price: "$0",
    pricing_plan_free_period: "Forever",
    pricing_plan_free_feature_ideas: "Up to 15 AI ideas per month",
    pricing_plan_free_feature_captions: "Up to 10 AI captions per month",
    pricing_plan_free_feature_platforms: "1 main platform",
    pricing_plan_free_feature_scheduler: "Basic manual scheduling & reminders",
    pricing_plan_free_feature_storage: "Up to 20 drafts & 300 MB of uploads",
    pricing_plan_free_cta: "Get started for free",

    pricing_plan_monthly_name: "Pro – Monthly",
    pricing_plan_monthly_description:
      "Flexible month-to-month access for active creators.",
    pricing_plan_monthly_price: "$12",
    pricing_plan_monthly_period: "/month",
    pricing_plan_monthly_highlight: "Most popular",
    pricing_plan_monthly_feature_ideas: "Up to 150 AI ideas per month",
    pricing_plan_monthly_feature_captions: "Up to 100 AI captions per month",
    pricing_plan_monthly_feature_platforms: "Multi-platform support",
    pricing_plan_monthly_feature_scheduler:
      "Smart scheduler & cross-platform posting plan",
    pricing_plan_monthly_feature_storage:
      "Up to 300 drafts & 10 GB of uploads",

    pricing_plan_quarterly_name: "Pro – Quarterly",
    pricing_plan_quarterly_description: "Save when you pay every 3 months.",
    pricing_plan_quarterly_price: "$30",
    pricing_plan_quarterly_period: "Every 3 months (~$10/month)",
    pricing_plan_quarterly_highlight: "Save ~17%",
    pricing_plan_quarterly_feature_ideas: "Up to 450 AI ideas per 3 months",
    pricing_plan_quarterly_feature_captions:
      "Up to 300 AI captions per 3 months",
    pricing_plan_quarterly_feature_platforms: "Multi-platform support",
    pricing_plan_quarterly_feature_scheduler:
      "Smart scheduler & cross-platform posting plan",
    pricing_plan_quarterly_feature_storage:
      "Up to 300 drafts & 10 GB of uploads",

    pricing_plan_yearly_name: "Pro – Yearly",
    pricing_plan_yearly_description: "Best value for serious creators.",
    pricing_plan_yearly_price: "$99",
    pricing_plan_yearly_period: "/year (~$8.25/month)",
    pricing_plan_yearly_highlight: "Save ~31%",
    pricing_plan_yearly_feature_ideas: "Up to 1,800 AI ideas per year",
    pricing_plan_yearly_feature_captions: "Up to 1,200 AI captions per year",
    pricing_plan_yearly_feature_platforms: "Multi-platform support",
    pricing_plan_yearly_feature_scheduler:
      "Smart scheduler & cross-platform posting plan",
    pricing_plan_yearly_feature_storage:
      "Up to 300 drafts & 10 GB of uploads",

    pricing_error_not_configured:
      "This plan is not configured yet. Please try again later.",
    pricing_error_login_required: "Please log in to upgrade your plan.",
    pricing_error_checkout_generic:
      "Could not start checkout. Please try again.",
    pricing_error_checkout_stripe:
      "Stripe checkout could not be started.",

    pricing_footer_note:
      "Payments are handled securely by Stripe. You can cancel your subscription at any time.",
    pricing_plan_paid_cta: "Choose plan",
    pricing_plan_paid_cta_loading: "Redirecting…",

    account_billing_on_pro_cancel_scheduled: "Your Pro subscription will not renew. It will end on",
    account_billing_on_pro_cancel_scheduled_no_date: "Your Pro subscription will not renew at the end of the current billing period.",
    account_billing_cancel_button: "Cancel subscription",
    account_billing_cancel_confirm: "Are you sure you want to cancel your Pro subscription? You will keep access until the end of the current billing period.",
    account_billing_cancel_confirm_button: "Yes, cancel Pro",
    account_billing_cancel_keep_pro_button: "Keep Pro",
    account_billing_cancel_loading: "Cancelling…",
    account_billing_cancel_error: "We could not cancel your subscription. Please try again or contact support."

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
        // Page "Cas d'utilisation"
    usecases_header_label: "Cas d'utilisation",
    usecases_title_main: "Faire en sorte que Polypost",
    usecases_title_highlight: "colle à ton style",
    usecases_subtitle:
      "Choisis un preset qui correspond à ta plateforme, ta langue et ta vibe. On copie ses réglages dans ton profil créateur (vibe, ton, niche, audience…) pour que les idées et les légendes soient dans le bon style dès le premier jour.",

    usecases_brand_title:
      "Définis ta marque de créateur·rice (avec l’IA)",
    usecases_brand_subtitle:
      "Tu n’es pas sûr·e de ta vibe, de ton ton ou de ta niche ? Remplis ce formulaire et Polypost te proposera des personas de marque avec style, bio et piliers de contenu recommandés.",

    usecases_brand_niche_placeholder:
      "Ta niche (fitness, modèle, gamer, OF, beauté...)",
    usecases_brand_target_placeholder:
      "Qui veux-tu attirer ?",
    usecases_brand_goals_placeholder:
      "Tes objectifs (croître vite, fidéliser, augmenter tes revenus OF...)",
    usecases_brand_comfort_placeholder:
      "Niveau de confort (joueur, sérieux, explicite, introverti...)",

    usecases_brand_error:
      "⚠️ Impossible de générer des personas de marque. Réessaie.",
    usecases_brand_button_thinking: "Réflexion en cours…",
    usecases_brand_button_generate: "Générer des personas de marque",
    usecases_brand_pick_persona:
      "Choisis le persona qui correspond le plus à ton identité de créateur·rice :",
    usecases_brand_button_applied: "Appliqué ✓",
    usecases_brand_button_use_persona: "Utiliser ce persona",

    usecases_bio_no_base:
      "Aucune bio de base à affiner pour ce persona.",
    usecases_bio_refine_error: "⚠️ Impossible d’affiner la bio.",
    usecases_bio_copied_toast: "📋 Bio copiée dans le presse-papiers",

    usecases_bio_short_label: "Bio courte",
    usecases_bio_long_label: "Bio longue",
    usecases_bio_cta_label: "Bio orientée CTA",
    usecases_bio_fun_label: "Bio fun / playful",
    usecases_bio_refine_button: "Affiner la bio",

    usecases_toast_persona_applied:
      "🎉 Persona de marque appliqué à ton profil !",
    usecases_toast_persona_apply_error:
      "⚠️ Impossible d’appliquer le persona. Réessaie.",

    usecases_how_title: "Comment les créateurs utilisent Polypost",
    usecases_how_step1:
      "1. Choisis un preset qui correspond à ta plateforme principale (OF, Reels IG, tendances TikTok…).",
    usecases_how_step2:
      "2. On copie les réglages (vibe, ton, niche, audience cible, langue) dans ton profil.",
    usecases_how_step3:
      "3. Génére des idées et des légendes depuis le Tableau de bord — elles seront alignées avec le preset.",
    usecases_how_step4:
      "4. Tu peux tout ajuster à tout moment dans ta page Compte si tu changes de style ou de cible.",

    usecases_presets_title: "Bibliothèque de presets",
    usecases_presets_subtitle:
      "On ajoute des configurations prêtes à l’emploi pour les profils typiques : OF, modèles Instagram, cosplay, fitness, gaming et plus encore.",
    usecases_presets_note:
      "Après avoir appliqué un preset, va sur ton Tableau de bord et commence à générer — aucun réglage supplémentaire nécessaire.",

    usecases_loading_presets: "Chargement des presets…",
    usecases_empty_presets:
      "Pas encore de presets. On est en train de remplir la bibliothèque — reviens bientôt !",
    usecases_list_title: "Presets disponibles",
    usecases_list_hint:
      "Clique sur « Appliquer le preset » pour mettre à jour ton profil créateur instantanément.",
    usecases_apply_button: "Appliquer le preset",
        // Dashboard
    dashboard_header_title: "Tableau de bord",
    dashboard_header_subtitle:
      "Génère des idées, des légendes et programme tes posts – tout au même endroit.",
    dashboard_header_button_use_cases: "Cas d’utilisation & modèles",
    dashboard_header_button_gallery: "Ouvrir la galerie",

    dashboard_quick_title: "Créer quelque chose de nouveau",
    dashboard_quick_subtitle:
      "Génère des idées, des légendes ou importe un média pour commencer un brouillon.",

    dashboard_card_ideas_title: "Générateur d’idées",
    dashboard_card_ideas_text:
      "Obtiens des hooks, angles et idées adaptés à ta niche.",
    dashboard_card_ideas_button: "Ouvrir les idées",

    dashboard_card_upload_title: "Upload & Légende",
    dashboard_card_upload_text:
      "Importe une image ou une vidéo et reçois une légende instantanément.",
    dashboard_card_upload_button: "Ouvrir l’upload",

    dashboard_card_scheduler_title: "Planificateur intelligent",
    dashboard_card_scheduler_text:
      "Vois les meilleurs moments pour publier et planifie ton calendrier.",
    dashboard_card_scheduler_button: "Ouvrir le planning",

    dashboard_stats_title: "Vue rapide",
    dashboard_stats_ideas_label: "Idées générées",
    dashboard_stats_drafts_label: "Brouillons enregistrés",
    dashboard_stats_scheduled_label: "Posts programmés",

    dashboard_recent_title: "Brouillons récents",
    dashboard_recent_link_all: "Voir tous les brouillons →",
    dashboard_recent_empty:
      "Pas encore de brouillons. Génère des idées ou importe un média pour commencer.",
    dashboard_recent_untitled: "Sans titre",
    dashboard_recent_type_media: "Brouillon média",
    dashboard_recent_type_idea: "Brouillon d’idée",
    dashboard_recent_open_button: "Ouvrir",

    dashboard_modal_ideas_title: "Générateur d’idées",
    dashboard_modal_ideas_intro:
      "On génère des hooks et idées pour Instagram. Plus tard tu pourras ajuster ta niche et ta plateforme.",
    dashboard_modal_ideas_button_generate: "Générer 5 idées",
    dashboard_modal_ideas_button_generating: "Génération…",
    dashboard_modal_ideas_empty:
      "Aucune idée pour l’instant. Clique sur le bouton ci-dessus.",
    dashboard_modal_ideas_fallback_title: "Idée",
    dashboard_modal_ideas_caption_start_label: "Début de légende :",
    dashboard_modal_ideas_twist_label: "Twist :",
    dashboard_modal_ideas_save_button: "Enregistrer le brouillon",
    dashboard_modal_ideas_save_saving: "Enregistrement…",
    dashboard_modal_ideas_plan_button: "Générer un plan d’action",
    dashboard_modal_ideas_plan_generating: "Génération du plan…",
    dashboard_modal_ideas_plan_ready: "✓ Plan d’action prêt",
    dashboard_modal_ideas_plan_loading:
      "On découpe cette idée en étapes concrètes…",
    dashboard_actionplan_title: "Plan d’action",

    dashboard_modal_upload_title: "Upload & Légende",
    dashboard_modal_upload_button: "Uploader",

    dashboard_upload_status_uploading: "Upload en cours...",
    dashboard_upload_status_uploaded:
      "Upload terminé ✅ — tu peux générer une légende.",
    dashboard_upload_status_failed: "Échec de l’upload.",
    dashboard_upload_status_need_upload: "Commence par uploader un fichier.",
    dashboard_upload_caption_button: "Générer une légende",
    dashboard_upload_status_caption_generating: "Génération de la légende...",
    dashboard_upload_status_caption_ready: "Légende générée ✅",
    dashboard_upload_status_caption_failed:
      "Échec de la génération de légende.",
    dashboard_upload_status_need_caption:
      "Génère une légende avant d’enregistrer ce brouillon.",
    dashboard_upload_status_need_title:
      "Ajoute un titre avant d’enregistrer ce brouillon.",
    dashboard_upload_status_saved: "Brouillon média enregistré ✅",
    dashboard_upload_status_save_failed:
      "Échec lors de l’enregistrement du brouillon.",

    dashboard_upload_caption_label: "Légende",
    dashboard_upload_draft_title_label: "Titre du brouillon",
    dashboard_upload_draft_title_placeholder:
      "ex : Selfie à la salle, Reels plage, Story Q&R",
    dashboard_upload_save_button: "Enregistrer comme brouillon",
    dashboard_upload_save_saving: "Enregistrement…",
        // Scheduler
    scheduler_title: "Planning",
    scheduler_subtitle:
      "Clique sur un jour pour ajouter un rappel ou générer un plan de publication.",

    scheduler_ai_button_generate:
      "Générer un plan multi-plateformes",
    scheduler_ai_button_generating:
      "Génération du plan multi-plateformes…",
    scheduler_ai_toast_prefix:
      "🎯 Nouveau plan de publication ajouté pour : ",
    scheduler_ai_toast_generic:
      "🎯 Nouveau plan de publication ajouté à ton calendrier !",
    scheduler_ai_toast_error:
      "⚠️ Impossible de générer un plan de publication.",

    scheduler_modal_title: "Rappels",
    scheduler_modal_existing_label: "Rappels existants",
    scheduler_modal_time_label: "Heure",
    scheduler_modal_platform_label: "Plateforme",
    scheduler_modal_attach_label: "Associer un brouillon (optionnel)",
    scheduler_modal_no_draft_option: "Aucun brouillon",
    scheduler_modal_note_label: "Note (optionnel)",
    scheduler_modal_note_placeholder:
      "ex : Poster le teaser du Reel ici",
    scheduler_modal_notify_label:
      "M’envoyer un rappel par email.",
    scheduler_modal_close_button: "Fermer",
    scheduler_modal_save_button: "Ajouter le rappel",
    scheduler_modal_save_saving: "Enregistrement…",
    scheduler_modal_delete_button: "Supprimer",

    scheduler_alert_delete_failed:
      "Impossible de supprimer le rappel. Réessaie.",
    scheduler_alert_save_failed:
      "Impossible d’enregistrer le rappel. Réessaie.",
    scheduler_alert_suggestions_failed:
      "Impossible de charger les suggestions d’horaires.",

    scheduler_suggestions_title: "Horaires recommandés",
    scheduler_suggestions_platform_label: "Plateforme",
    scheduler_suggestions_button_generate: "Générer des horaires",
    scheduler_suggestions_button_generating: "Génération…",
    scheduler_suggestions_click_hint:
      "Clique sur un horaire pour le transformer en rappel :",
    scheduler_suggestions_loading: "Chargement des suggestions…",
    // Reviews
    reviews_title: "Ce que disent les créateurs",
    reviews_subtitle:
      "Aide-nous à améliorer Postly et découvre l’avis des autres.",
    reviews_loading: "Chargement des avis…",
    reviews_empty:
      "Pas encore d’avis. Sois le premier à partager ton retour !",
    reviews_username_anonymous: "anonyme",
    reviews_summary_review_singular: "avis",
    reviews_summary_review_plural: "avis",

    reviews_success: "Merci pour ton feedback ! 💜",
    reviews_error:
      "Impossible d’envoyer ton avis. Réessaie.",

    reviews_rating_label: "Ta note :",
    reviews_title_placeholder:
      "Titre optionnel (ex. « Super utile pour IG »)",
    reviews_comment_placeholder:
      "Explique comment Postly t’aide (ou ce qu’on pourrait améliorer)…",
    reviews_button_submit: "Envoyer mon avis",
    reviews_button_sending: "Envoi en cours…",
        // Account page
    account_title: "Paramètres du compte",
    account_subtitle:
      "Gère ton profil de créateur·rice, ton abonnement et tes connexions.",

    account_profile_title: "Profil",
    account_profile_subtitle:
      "Mets à jour ta photo et tes infos de base. On s’en sert pour personnaliser ton expérience.",
    account_profile_choose_file: "Choisir un fichier",
    account_profile_save_picture: "Enregistrer la photo",
    account_profile_uploading: "Envoi en cours...",
    account_profile_username_label: "Nom d’utilisateur :",
    account_profile_email_label: "Email :",


    account_billing_title: "Abonnement & facturation",
    account_billing_loading: "Chargement de l’abonnement...",
    account_billing_current_plan_label: "Abonnement actuel :",
    account_billing_plan_pro_label: "Pro (12 $ / mois)",
    account_billing_plan_free_label: "Gratuit",
    account_billing_upgrade_button: "Passer en Pro",
    account_billing_upgrade_redirecting: "Redirection...",
    account_billing_view_pricing_link:
      "Voir tous les plans & tarifs →",
    account_billing_on_pro_label: "Tu es en Pro ✅",
    account_billing_stripe_note:
      "Les paiements sont gérés de façon sécurisée par Stripe.",
    account_billing_checkout_error:
      "Impossible de lancer le paiement (STRIPE_SECRET_KEY est-il configuré ?).",

    account_prefs_title: "Préférences créateur·rice",
    account_prefs_subtitle:
      "Elles guident la génération d’idées et de légendes dans l’app.",
    account_prefs_loading: "Chargement...",
    account_prefs_saved: "Enregistré ✅",

    account_error_load_prefs:
      "Impossible de charger les préférences.",
    account_error_save_prefs:
      "Impossible d’enregistrer les préférences.",
    account_error_save_notifications:
      "Impossible d’enregistrer les préférences de notifications.",
    account_error_avatar:
      "Impossible de téléverser l’avatar.",

    account_prefs_vibe_label: "Ambiance",
    account_prefs_vibe_placeholder: "fun, edgy, chic...",
    account_prefs_tone_label: "Tonalité",
    account_prefs_tone_placeholder: "décontracté, professionnel...",
    account_prefs_niche_label: "Niche",
    account_prefs_niche_placeholder: "fitness, beauté, gaming...",
    account_prefs_target_label: "Audience cible",
    account_prefs_target_placeholder:
      "jeunes femmes, abonnés OF, followers IG...",
    account_prefs_default_platform_label: "Plateforme par défaut",
    account_prefs_active_platforms_label: "Plateformes actives",
    account_prefs_timezone_label: "Fuseau horaire",
    account_prefs_timezone_placeholder: "Europe/Paris",
    account_prefs_save_button: "Enregistrer les préférences",
    account_prefs_save_saving: "Enregistrement...",

    account_notifications_title: "Notifications",
    account_notifications_subtitle:
      "Choisis ce que tu veux recevoir de Postly.",
    account_notifications_content_label:
      "Rappels de contenu (email / push plus tard)",
    account_notifications_marketing_label:
      "Newsletter & nouveautés produit",
    account_notifications_save_button:
      "Enregistrer les préférences de notifications",

    account_connected_title: "Comptes connectés",
    account_connected_ig_coming: "Bientôt disponible...",
    account_connected_ig_connect_button: "Connecter",
    account_connect_ig_error:
      "La connexion IG n’est pas encore disponible.",

    account_security_title: "Sécurité",
    account_security_subtitle:
      "Change ton mot de passe. Tu resteras connecté·e sur cet appareil.",
    account_security_current_pw_label: "Mot de passe actuel",
    account_security_new_pw_label: "Nouveau mot de passe",
    account_security_change_pw_button: "Changer le mot de passe",

    account_pw_change_success: "Mot de passe mis à jour ✅",
    account_pw_change_error_generic:
      "Impossible de changer le mot de passe. Réessaie.",

    account_logout_button: "Se déconnecter",
        // Gallery
    gallery_title: "Ma galerie de contenu",
    gallery_subtitle:
      "Toutes tes idées et brouillons média créés dans Postly. Épingle tes favoris, archive ce qui est fait.",
    gallery_back_to_dashboard: "← Retour au tableau de bord",

    gallery_filter_all: "Tous les brouillons",
    gallery_filter_pinned: "Épinglés",
    gallery_filter_idea: "Idées",
    gallery_filter_media: "Brouillons média",

    gallery_loading: "Chargement des brouillons...",
    gallery_empty_text:
      "Aucun brouillon pour le moment. Va sur le tableau de bord pour générer des idées ou téléverser des médias sur le",
    gallery_empty_link_label: "tableau de bord",

    gallery_card_untitled: "Brouillon sans titre",
    gallery_badge_pinned: "Épinglé",
    gallery_badge_media: "Brouillon média",
    gallery_badge_idea: "Brouillon d’idée",
    gallery_card_idea_fallback: "Détails de l’idée",
    gallery_card_media_fallback:
      "Brouillon média avec légende. Ouvre pour voir / régénérer.",
    gallery_card_saved_prefix: "Enregistré le",

    gallery_button_view_details: "Voir les détails",
    gallery_button_archive: "Archiver",
    gallery_button_pin: "Épingler",
    gallery_button_unpin: "Désépingler",

    gallery_archive_confirm:
      "Archiver ce brouillon ? Il disparaîtra de cette vue.",

    gallery_modal_title_fallback: "Détails du brouillon",
    gallery_modal_subtitle_media:
      "Brouillon média – vois l’image et régénère la légende.",
    gallery_modal_subtitle_idea:
      "Brouillon d’idée – ajuste le contenu et enregistre-le.",

    gallery_modal_caption_label: "Légende",
    gallery_modal_caption_regenerate: "Régénérer",
    gallery_modal_caption_regenerating: "Régénération...",
    gallery_modal_caption_placeholder:
      "La légende apparaîtra ici après génération.",
    gallery_modal_caption_generated_prefix: "Nouvelle légende générée le",
    gallery_modal_caption_generated_suffix:
      "(pas encore liée à ce brouillon côté serveur).",

    gallery_idea_title_label: "Titre",
    gallery_idea_title_placeholder: "Titre de l’idée",
    gallery_idea_description_label: "Description",
    gallery_idea_description_placeholder:
      "Décris l’idée de contenu",
    gallery_idea_hook_label: "Hook utilisé",
    gallery_idea_hook_placeholder: "Hook ou angle utilisé",
    gallery_idea_caption_starter_label: "Accroche de légende",
    gallery_idea_caption_starter_placeholder:
      "Phrase d’ouverture suggérée",
    gallery_idea_twist_label: "Twist personnel",
    gallery_idea_twist_placeholder:
      "Comment tu veux personnaliser cette idée",

    gallery_idea_save_button: "Enregistrer les modifications",
    gallery_idea_save_saving: "Enregistrement...",

    gallery_action_plan_title: "Plan d’action",
        // Support
    support_eyebrow: "Besoin d’aide ?",
    support_title_prefix: "Contacter le",
    support_title_accent: "support",
    support_subtitle:
      "Un bug, un souci de facturation ou une idée ? Envoie-nous un message, on répond généralement sous 1 à 2 jours ouvrés.",
    support_success:
      "✅ Merci ! Ton message a bien été envoyé. On te répondra par email.",
    support_error:
      "Impossible d’envoyer ton message. Merci de réessayer.",

    support_label_email: "Email",
    support_label_subject: "Sujet",
    support_label_category: "Catégorie",
    support_label_message: "Message",
    support_placeholder_email: "toi@example.com",
    support_placeholder_subject:
      "Court résumé de ton problème",
    support_placeholder_message:
      "Explique-nous ce qu’il se passe, les étapes pour reproduire, liens, etc.",
    support_button_sending: "Envoi en cours...",
    support_button_send: "Envoyer le message",

    support_category_bug: "Bug / quelque chose a cassé",
    support_category_billing: "Facturation & abonnements",
    support_category_idea: "Suggestion / nouvelle idée",
    support_category_other: "Autre",

    support_sidebar_title: "À inclure",
    support_sidebar_item_platforms:
      "Sur quelle(s) plateforme(s) tu es (IG, TikTok, OF…)",
    support_sidebar_item_action:
      "Ce que tu essayais de faire quand le problème est arrivé",
    support_sidebar_item_errors:
      "Les messages d’erreur ou captures d’écran",
    support_sidebar_billing_note:
      "Pour la facturation, indique l’email utilisé sur Stripe.",

    // Upload
    upload_title: "Upload",
    upload_subtitle:
      "Téléverse un média et génère une légende avec tes préférences Postly.",
    upload_button_upload: "Téléverser",
    upload_button_generate: "Générer une légende",
    upload_caption_title: "Légende",

    upload_status_uploading: "Téléversement en cours...",
    upload_status_uploaded:
      "Fichier téléversé. Tu peux maintenant générer une légende.",
    upload_status_failed: "Échec du téléversement.",
    upload_status_upload_first:
      "Téléverse quelque chose d’abord.",
    upload_status_generating: "Génération de la légende...",
    upload_status_caption_ok: "Légende générée ✅",
    upload_status_caption_failed:
      "Échec de la génération de la légende.",
        // Pricing
    pricing_header_badge: "Tarifs",
    pricing_header_title:
      "Choisissez la formule adaptée à votre parcours de créateur·rice",
    pricing_header_subtitle:
      "Commence gratuitement, puis passe à l’offre Pro quand tu es prêt·e. Résiliation à tout moment. Tous les forfaits payants incluent des limites plus élevées pour les idées, légendes et le planning.",

    pricing_plan_free_name: "Gratuit",
    pricing_plan_free_description:
      "Parfait pour découvrir Postly sans pression.",
    pricing_plan_free_price: "0 $",
    pricing_plan_free_period: "Pour toujours",
    pricing_plan_free_feature_ideas: "Jusqu’à 15 idées IA par mois",
    pricing_plan_free_feature_captions: "Jusqu’à 10 légendes IA par mois",
    pricing_plan_free_feature_platforms: "1 plateforme principale",
    pricing_plan_free_feature_scheduler:
      "Planning manuel de base et rappels",
    pricing_plan_free_feature_storage:
      "Jusqu’à 20 brouillons et 300 Mo d’uploads",
    pricing_plan_free_cta: "Commencer gratuitement",

    pricing_plan_monthly_name: "Pro – Mensuel",
    pricing_plan_monthly_description:
      "Accès flexible au mois pour les créateurs actifs.",
    pricing_plan_monthly_price: "12 $",
    pricing_plan_monthly_period: "/mois",
    pricing_plan_monthly_highlight: "Le plus populaire",
    pricing_plan_monthly_feature_ideas:
      "Jusqu’à 150 idées IA par mois",
    pricing_plan_monthly_feature_captions:
      "Jusqu’à 100 légendes IA par mois",
    pricing_plan_monthly_feature_platforms: "Multi-plateformes",
    pricing_plan_monthly_feature_scheduler:
      "Planificateur intelligent & plan de publication multi-plateformes",
    pricing_plan_monthly_feature_storage:
      "Jusqu’à 300 brouillons et 10 Go d’uploads",

    pricing_plan_quarterly_name: "Pro – Trimestriel",
    pricing_plan_quarterly_description:
      "Économise en payant tous les 3 mois.",
    pricing_plan_quarterly_price: "30 $",
    pricing_plan_quarterly_period: "Tous les 3 mois (~10 $/mois)",
    pricing_plan_quarterly_highlight: "Économise ~17 %",
    pricing_plan_quarterly_feature_ideas:
      "Jusqu’à 450 idées IA par 3 mois",
    pricing_plan_quarterly_feature_captions:
      "Jusqu’à 300 légendes IA par 3 mois",
    pricing_plan_quarterly_feature_platforms: "Multi-plateformes",
    pricing_plan_quarterly_feature_scheduler:
      "Planificateur intelligent & plan de publication multi-plateformes",
    pricing_plan_quarterly_feature_storage:
      "Jusqu’à 300 brouillons et 10 Go d’uploads",

    pricing_plan_yearly_name: "Pro – Annuel",
    pricing_plan_yearly_description:
      "Meilleur rapport qualité-prix pour les créateurs sérieux.",
    pricing_plan_yearly_price: "99 $",
    pricing_plan_yearly_period: "/an (~8,25 $/mois)",
    pricing_plan_yearly_highlight: "Économise ~31 %",
    pricing_plan_yearly_feature_ideas:
      "Jusqu’à 1 800 idées IA par an",
    pricing_plan_yearly_feature_captions:
      "Jusqu’à 1 200 légendes IA par an",
    pricing_plan_yearly_feature_platforms: "Multi-plateformes",
    pricing_plan_yearly_feature_scheduler:
      "Planificateur intelligent & plan de publication multi-plateformes",
    pricing_plan_yearly_feature_storage:
      "Jusqu’à 300 brouillons et 10 Go d’uploads",

    pricing_error_not_configured:
      "Cette formule n’est pas encore configurée. Réessaie plus tard.",
    pricing_error_login_required:
      "Connecte-toi pour pouvoir mettre ton abonnement à niveau.",
    pricing_error_checkout_generic:
      "Impossible de démarrer le paiement. Réessaie.",
    pricing_error_checkout_stripe:
      "Le paiement Stripe n’a pas pu être démarré.",

    pricing_footer_note:
      "Les paiements sont gérés de façon sécurisée par Stripe. Tu peux annuler ton abonnement à tout moment.",

    pricing_plan_paid_cta: "Choisir cette offre",
    pricing_plan_paid_cta_loading: "Redirection…",
    
    account_billing_on_pro_cancel_scheduled: "Votre abonnement Pro ne sera pas renouvelé. Il prendra fin le",
    account_billing_on_pro_cancel_scheduled_no_date: "Votre abonnement Pro ne sera pas renouvelé à la fin de la période de facturation en cours.",
    account_billing_cancel_button: "Annuler l’abonnement",
    account_billing_cancel_confirm: "Êtes-vous sûr de vouloir annuler votre abonnement Pro ? Vous conserverez l’accès jusqu’à la fin de la période de facturation actuelle.",
    account_billing_cancel_confirm_button: "Oui, annuler Pro",
    account_billing_cancel_keep_pro_button: "Garder Pro",
    account_billing_cancel_loading: "Annulation…",
    account_billing_cancel_error: "Nous n’avons pas pu annuler votre abonnement. Veuillez réessayer ou contacter le support."



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
        // Página "Casos de uso"
    usecases_header_label: "Casos de uso",
    usecases_title_main: "Haz que Polypost",
    usecases_title_highlight: "trabaje con tu estilo",
    usecases_subtitle:
      "Elige un preset que encaje con tu plataforma, idioma y vibra. Copiaremos su configuración a tu perfil de creador (vibra, tono, nicho, audiencia…) para que las ideas y los textos suenen a tu marca desde el primer día.",

    usecases_brand_title:
      "Define tu marca como creador/a (con IA)",
    usecases_brand_subtitle:
      "¿No tienes claro tu tono, vibra o nicho? Rellena esto y Polypost te sugerirá personas de marca con estilo, bio y pilares de contenido recomendados.",

    usecases_brand_niche_placeholder:
      "Tu nicho (fitness, modelo, gamer, OF, belleza...)",
    usecases_brand_target_placeholder:
      "¿A quién quieres atraer?",
    usecases_brand_goals_placeholder:
      "Tus objetivos (crecer rápido, construir fans, aumentar ingresos en OF...)",
    usecases_brand_comfort_placeholder:
      "Nivel de comodidad (juguetón, serio, explícito, introvertido...)",

    usecases_brand_error:
      "⚠️ No se pudieron generar personas de marca. Inténtalo de nuevo.",
    usecases_brand_button_thinking: "Pensando…",
    usecases_brand_button_generate: "Generar personas de marca",
    usecases_brand_pick_persona:
      "Elige la persona que más encaje con tu identidad como creador/a:",
    usecases_brand_button_applied: "Aplicado ✓",
    usecases_brand_button_use_persona: "Usar esta persona",

    usecases_bio_no_base:
      "No hay una bio base para refinar en esta persona.",
    usecases_bio_refine_error: "⚠️ No se pudo refinar la bio.",
    usecases_bio_copied_toast: "📋 Bio copiada al portapapeles",

    usecases_bio_short_label: "Bio corta",
    usecases_bio_long_label: "Bio larga",
    usecases_bio_cta_label: "Bio enfocada en CTA",
    usecases_bio_fun_label: "Bio divertida / juguetona",
    usecases_bio_refine_button: "Refinar bio",

    usecases_toast_persona_applied:
      "🎉 Persona de marca aplicada a tu perfil.",
    usecases_toast_persona_apply_error:
      "⚠️ No se pudo aplicar la persona. Inténtalo de nuevo.",

    usecases_how_title: "Cómo usan Polypost los creadores",
    usecases_how_step1:
      "1. Elige un preset que encaje con tu plataforma principal (OF, Reels de IG, tendencias de TikTok…).",
    usecases_how_step2:
      "2. Copiamos la configuración (vibra, tono, nicho, audiencia objetivo, idioma) a tu perfil.",
    usecases_how_step3:
      "3. Genera ideas y textos desde el Panel — estarán alineados con el preset.",
    usecases_how_step4:
      "4. Ajusta lo que quieras en la página de Cuenta si cambias de estilo o de público objetivo.",

    usecases_presets_title: "Biblioteca de presets",
    usecases_presets_subtitle:
      "Vamos añadiendo configuraciones curadas para perfiles típicos: OF, modelos de Instagram, cosplay, fitness, gaming y más.",
    usecases_presets_note:
      "Después de aplicar un preset, ve a tu Panel y empieza a generar — sin configuración extra.",

    usecases_loading_presets: "Cargando presets…",
    usecases_empty_presets:
      "Aún no hay presets. Estamos rellenando la biblioteca — vuelve pronto.",
    usecases_list_title: "Presets disponibles",
    usecases_list_hint:
      "Haz clic en « Aplicar preset » para actualizar tu perfil de creador al instante.",
    usecases_apply_button: "Aplicar preset",
        // Dashboard
    dashboard_header_title: "Panel",
    dashboard_header_subtitle:
      "Genera ideas, textos y programa tus publicaciones, todo en un solo lugar.",
    dashboard_header_button_use_cases: "Casos de uso y plantillas",
    dashboard_header_button_gallery: "Abrir galería",

    dashboard_quick_title: "Crear algo nuevo",
    dashboard_quick_subtitle:
      "Genera ideas, textos o sube un medio para empezar un borrador.",

    dashboard_card_ideas_title: "Generador de ideas",
    dashboard_card_ideas_text:
      "Consigue hooks, ángulos e ideas adaptadas a tu nicho.",
    dashboard_card_ideas_button: "Abrir ideas",

    dashboard_card_upload_title: "Subir & Texto",
    dashboard_card_upload_text:
      "Sube una imagen o vídeo y obtén un texto al instante.",
    dashboard_card_upload_button: "Abrir subida",

    dashboard_card_scheduler_title: "Planificador inteligente",
    dashboard_card_scheduler_text:
      "Ve los mejores horarios para publicar y planifica tu calendario.",
    dashboard_card_scheduler_button: "Abrir planificador",

    dashboard_stats_title: "Resumen rápido",
    dashboard_stats_ideas_label: "Ideas generadas",
    dashboard_stats_drafts_label: "Borradores guardados",
    dashboard_stats_scheduled_label: "Publicaciones programadas",

    dashboard_recent_title: "Borradores recientes",
    dashboard_recent_link_all: "Ver todos los borradores →",
    dashboard_recent_empty:
      "Todavía no tienes borradores. Genera ideas o sube un medio para empezar.",
    dashboard_recent_untitled: "Sin título",
    dashboard_recent_type_media: "Borrador con medio",
    dashboard_recent_type_idea: "Borrador de idea",
    dashboard_recent_open_button: "Abrir",

    dashboard_modal_ideas_title: "Generador de ideas",
    dashboard_modal_ideas_intro:
      "Vamos a generar hooks e ideas para Instagram. Más adelante podrás ajustar tu nicho y plataforma.",
    dashboard_modal_ideas_button_generate: "Generar 5 ideas",
    dashboard_modal_ideas_button_generating: "Generando...",
    dashboard_modal_ideas_empty:
      "Todavía no hay ideas. Haz clic en el botón de arriba.",
    dashboard_modal_ideas_fallback_title: "Idea",
    dashboard_modal_ideas_caption_start_label: "Inicio de texto:",
    dashboard_modal_ideas_twist_label: "Giro personal:",
    dashboard_modal_ideas_save_button: "Guardar borrador",
    dashboard_modal_ideas_save_saving: "Guardando...",
    dashboard_modal_ideas_plan_button: "Generar plan de acción",
    dashboard_modal_ideas_plan_generating: "Generando plan…",
    dashboard_modal_ideas_plan_ready: "✓ Plan de acción listo",
    dashboard_modal_ideas_plan_loading:
      "Estamos dividiendo esta idea en pasos concretos…",
    dashboard_actionplan_title: "Plan de acción",

    dashboard_modal_upload_title: "Subir & Texto",
    dashboard_modal_upload_button: "Subir",

    dashboard_upload_status_uploading: "Subiendo...",
    dashboard_upload_status_uploaded:
      "Subida completada ✅ — ahora puedes generar un texto.",
    dashboard_upload_status_failed: "Error al subir el archivo.",
    dashboard_upload_status_need_upload: "Primero sube un archivo.",
    dashboard_upload_caption_button: "Generar texto",
    dashboard_upload_status_caption_generating: "Generando texto...",
    dashboard_upload_status_caption_ready: "Texto generado ✅",
    dashboard_upload_status_caption_failed:
      "Error al generar el texto.",
    dashboard_upload_status_need_caption:
      "Genera un texto antes de guardar este borrador.",
    dashboard_upload_status_need_title:
      "Añade un título antes de guardar este borrador.",
    dashboard_upload_status_saved: "Borrador con medio guardado ✅",
    dashboard_upload_status_save_failed:
      "Error al guardar el borrador.",

    dashboard_upload_caption_label: "Texto",
    dashboard_upload_draft_title_label: "Título del borrador",
    dashboard_upload_draft_title_placeholder:
      "ej.: Selfie en el gym, Reel en la playa, Story de preguntas",
    dashboard_upload_save_button: "Guardar como borrador",
    dashboard_upload_save_saving: "Guardando...",
        // Scheduler
    scheduler_title: "Planificador",
    scheduler_subtitle:
      "Haz clic en un día para añadir un recordatorio o generar un plan de publicaciones.",

    scheduler_ai_button_generate:
      "Generar plan multiplataforma",
    scheduler_ai_button_generating:
      "Generando plan multiplataforma…",
    scheduler_ai_toast_prefix:
      "🎯 Nuevo plan de publicación añadido para: ",
    scheduler_ai_toast_generic:
      "🎯 Nuevo plan de publicación añadido a tu calendario.",
    scheduler_ai_toast_error:
      "⚠️ No se pudo generar el plan de publicación.",

    scheduler_modal_title: "Recordatorios",
    scheduler_modal_existing_label: "Recordatorios existentes",
    scheduler_modal_time_label: "Hora",
    scheduler_modal_platform_label: "Plataforma",
    scheduler_modal_attach_label: "Vincular un borrador (opcional)",
    scheduler_modal_no_draft_option: "Sin borrador",
    scheduler_modal_note_label: "Nota (opcional)",
    scheduler_modal_note_placeholder:
      "ej.: Publicar teaser del Reel aquí",
    scheduler_modal_notify_label:
      "Enviarme un recordatorio por email.",
    scheduler_modal_close_button: "Cerrar",
    scheduler_modal_save_button: "Añadir recordatorio",
    scheduler_modal_save_saving: "Guardando…",
    scheduler_modal_delete_button: "Eliminar",

    scheduler_alert_delete_failed:
      "No se pudo eliminar el recordatorio. Inténtalo de nuevo.",
    scheduler_alert_save_failed:
      "No se pudo guardar el recordatorio. Inténtalo de nuevo.",
    scheduler_alert_suggestions_failed:
      "No se pudieron cargar las sugerencias de horario.",

    scheduler_suggestions_title: "Horarios recomendados",
    scheduler_suggestions_platform_label: "Plataforma",
    scheduler_suggestions_button_generate: "Generar horarios",
    scheduler_suggestions_button_generating: "Generando…",
    scheduler_suggestions_click_hint:
      "Haz clic en un horario para convertirlo en recordatorio:",
    scheduler_suggestions_loading: "Cargando sugerencias…",
    // Reviews
    reviews_title: "Lo que dicen los creadores",
    reviews_subtitle:
      "Ayúdanos a mejorar Postly y mira lo que opinan los demás.",
    reviews_loading: "Cargando reseñas…",
    reviews_empty:
      "Todavía no hay reseñas. ¡Sé la primera persona en comentar!",
    reviews_username_anonymous: "anónimo",
    reviews_summary_review_singular: "reseña",
    reviews_summary_review_plural: "reseñas",

    reviews_success: "¡Gracias por tu opinión! 💜",
    reviews_error:
      "No se pudo enviar tu reseña. Inténtalo de nuevo.",

    reviews_rating_label: "Tu valoración:",
    reviews_title_placeholder:
      "Título opcional (ej. « Súper útil para IG »)",
    reviews_comment_placeholder:
      "Cuenta cómo te ayuda Postly (o qué podríamos mejorar)…",
    reviews_button_submit: "Enviar reseña",
    reviews_button_sending: "Enviando…",
        // Account page
    account_title: "Configuración de la cuenta",
    account_subtitle:
      "Gestiona tu perfil de creador, tu plan y tus conexiones.",

    account_profile_title: "Perfil",
    account_profile_subtitle:
      "Actualiza tu foto y tus datos básicos. Los usamos para personalizar tu experiencia.",
    account_profile_choose_file: "Elegir archivo",
    account_profile_save_picture: "Guardar foto",
    account_profile_uploading: "Subiendo...",
    account_profile_username_label: "Usuario:",
    account_profile_email_label: "Email:",

    account_billing_title: "Plan y facturación",
    account_billing_loading: "Cargando plan...",
    account_billing_current_plan_label: "Plan actual:",
    account_billing_plan_pro_label: "Pro (12 $/mes)",
    account_billing_plan_free_label: "Gratis",
    account_billing_upgrade_button: "Subir a Pro",
    account_billing_upgrade_redirecting: "Redirigiendo...",
    account_billing_view_pricing_link:
      "Ver todos los planes y precios →",
    account_billing_on_pro_label: "Estás en Pro ✅",
    account_billing_stripe_note:
      "Los pagos se gestionan de forma segura con Stripe.",
    account_billing_checkout_error:
      "No se pudo iniciar el pago (¿configuraste STRIPE_SECRET_KEY?).",

    account_prefs_title: "Preferencias de creador",
    account_prefs_subtitle:
      "Guían la generación de ideas y textos en toda la app.",
    account_prefs_loading: "Cargando...",
    account_prefs_saved: "Guardado ✅",

    account_error_load_prefs:
      "No se pudieron cargar las preferencias.",
    account_error_save_prefs:
      "No se pudieron guardar las preferencias.",
    account_error_save_notifications:
      "No se pudieron guardar las preferencias de notificación.",
    account_error_avatar:
      "No se pudo subir el avatar.",

    account_prefs_vibe_label: "Vibra",
    account_prefs_vibe_placeholder: "divertida, edgy, elegante...",
    account_prefs_tone_label: "Tono",
    account_prefs_tone_placeholder: "casual, profesional...",
    account_prefs_niche_label: "Nicho",
    account_prefs_niche_placeholder: "fitness, belleza, gaming...",
    account_prefs_target_label: "Audiencia objetivo",
    account_prefs_target_placeholder:
      "mujeres jóvenes, subs de OF, seguidores de IG...",
    account_prefs_default_platform_label: "Plataforma por defecto",
    account_prefs_active_platforms_label: "Plataformas activas",
    account_prefs_timezone_label: "Zona horaria",
    account_prefs_timezone_placeholder: "Europe/Paris",
    account_prefs_save_button: "Guardar preferencias",
    account_prefs_save_saving: "Guardando...",

    account_notifications_title: "Notificaciones",
    account_notifications_subtitle:
      "Elige qué quieres recibir de Postly.",
    account_notifications_content_label:
      "Recordatorios de contenido (email / futuros push)",
    account_notifications_marketing_label:
      "Newsletter y novedades del producto",
    account_notifications_save_button:
      "Guardar preferencias de notificación",

    account_connected_title: "Cuentas conectadas",
    account_connected_ig_coming: "Próximamente...",
    account_connected_ig_connect_button: "Conectar",
    account_connect_ig_error:
      "La conexión con IG todavía no está disponible.",

    account_security_title: "Seguridad",
    account_security_subtitle:
      "Cambia tu contraseña. Seguirás conectado en este dispositivo.",
    account_security_current_pw_label: "Contraseña actual",
    account_security_new_pw_label: "Nueva contraseña",
    account_security_change_pw_button: "Cambiar contraseña",

    account_pw_change_success: "Contraseña actualizada ✅",
    account_pw_change_error_generic:
      "No se pudo cambiar la contraseña. Inténtalo de nuevo.",

    account_logout_button: "Cerrar sesión",
    // Gallery
    gallery_title: "Mi galería de contenido",
    gallery_subtitle:
      "Todas tus ideas y borradores de medios creados en Postly. Fija tus favoritos, archiva lo que ya esté hecho.",
    gallery_back_to_dashboard: "← Volver al panel",

    gallery_filter_all: "Todos los borradores",
    gallery_filter_pinned: "Fijados",
    gallery_filter_idea: "Ideas",
    gallery_filter_media: "Borradores de medios",

    gallery_loading: "Cargando borradores...",
    gallery_empty_text:
      "Todavía no tienes borradores. Ve al panel para generar ideas o subir contenido en el",
    gallery_empty_link_label: "panel",

    gallery_card_untitled: "Borrador sin título",
    gallery_badge_pinned: "Fijado",
    gallery_badge_media: "Borrador de medios",
    gallery_badge_idea: "Borrador de idea",
    gallery_card_idea_fallback: "Detalles de la idea",
    gallery_card_media_fallback:
      "Borrador con leyenda. Ábrelo para ver / regenerar.",
    gallery_card_saved_prefix: "Guardado el",

    gallery_button_view_details: "Ver detalles",
    gallery_button_archive: "Archivar",
    gallery_button_pin: "Fijar",
    gallery_button_unpin: "Quitar fijado",

    gallery_archive_confirm:
      "¿Archivar este borrador? Desaparecerá de esta vista.",

    gallery_modal_title_fallback: "Detalles del borrador",
    gallery_modal_subtitle_media:
      "Borrador de medios – mira la imagen y regenera la leyenda.",
    gallery_modal_subtitle_idea:
      "Borrador de idea – ajusta el contenido y guárdalo.",

    gallery_modal_caption_label: "Leyenda",
    gallery_modal_caption_regenerate: "Regenerar",
    gallery_modal_caption_regenerating: "Regenerando...",
    gallery_modal_caption_placeholder:
      "La leyenda aparecerá aquí después de generarse.",
    gallery_modal_caption_generated_prefix:
      "Nueva leyenda generada el",
    gallery_modal_caption_generated_suffix:
      "(todavía no vinculada a este borrador en el servidor).",

    gallery_idea_title_label: "Título",
    gallery_idea_title_placeholder: "Título de la idea",
    gallery_idea_description_label: "Descripción",
    gallery_idea_description_placeholder:
      "Describe la idea de contenido",
    gallery_idea_hook_label: "Gancho usado",
    gallery_idea_hook_placeholder: "Gancho o ángulo usado",
    gallery_idea_caption_starter_label: "Inicio de la leyenda",
    gallery_idea_caption_starter_placeholder:
      "Frase de apertura sugerida",
    gallery_idea_twist_label: "Toque personal",
    gallery_idea_twist_placeholder:
      "Cómo quieres personalizar esta idea",

    gallery_idea_save_button: "Guardar cambios",
    gallery_idea_save_saving: "Guardando...",

    gallery_action_plan_title: "Plan de acción",
        // Support
    support_eyebrow: "¿Necesitas ayuda?",
    support_title_prefix: "Contactar con",
    support_title_accent: "soporte",
    support_subtitle:
      "¿Has encontrado un bug, un problema de pago o tienes una idea? Envíanos un mensaje y solemos responder en 1–2 días laborables.",
    support_success:
      "✅ ¡Gracias! Tu mensaje ha sido enviado. Te responderemos por email.",
    support_error:
      "No se pudo enviar tu mensaje. Inténtalo de nuevo, por favor.",

    support_label_email: "Email",
    support_label_subject: "Asunto",
    support_label_category: "Categoría",
    support_label_message: "Mensaje",
    support_placeholder_email: "tú@example.com",
    support_placeholder_subject:
      "Breve resumen de tu problema",
    support_placeholder_message:
      "Cuéntanos qué pasa, pasos para reproducirlo, enlaces, etc.",
    support_button_sending: "Enviando...",
    support_button_send: "Enviar mensaje",

    support_category_bug: "Bug / algo se rompió",
    support_category_billing: "Pagos y suscripciones",
    support_category_idea: "Sugerencia / nueva función",
    support_category_other: "Otro",

    support_sidebar_title: "Qué incluir",
    support_sidebar_item_platforms:
      "En qué plataforma(s) lo usas (IG, TikTok, OF…)",
    support_sidebar_item_action:
      "Qué estabas intentando hacer cuando ocurrió el problema",
    support_sidebar_item_errors:
      "Mensajes de error o capturas de pantalla",
    support_sidebar_billing_note:
      "Para dudas de facturación, menciona el email usado en Stripe.",

    // Upload
    upload_title: "Subir archivo",
    upload_subtitle:
      "Sube un contenido y genera una leyenda usando tu configuración de Postly.",
    upload_button_upload: "Subir",
    upload_button_generate: "Generar leyenda",
    upload_caption_title: "Leyenda",

    upload_status_uploading: "Subiendo...",
    upload_status_uploaded:
      "Archivo subido. Ahora puedes generar una leyenda.",
    upload_status_failed: "La subida ha fallado.",
    upload_status_upload_first:
      "Primero sube algún archivo.",
    upload_status_generating: "Generando leyenda...",
    upload_status_caption_ok: "Leyenda generada ✅",
    upload_status_caption_failed:
      "No se pudo generar la leyenda.",
        // Pricing
    pricing_header_badge: "Precios",
    pricing_header_title:
      "Elige el plan que encaja con tu camino como creador/a",
    pricing_header_subtitle:
      "Empieza gratis y pasa al plan Pro cuando estés listo/a. Cancela en cualquier momento. Todos los planes de pago incluyen límites más altos para ideas, textos y planificación.",

    pricing_plan_free_name: "Gratis",
    pricing_plan_free_description:
      "Perfecto para probar Postly sin compromiso.",
    pricing_plan_free_price: "0 $",
    pricing_plan_free_period: "Para siempre",
    pricing_plan_free_feature_ideas:
      "Hasta 15 ideas IA al mes",
    pricing_plan_free_feature_captions:
      "Hasta 10 textos IA al mes",
    pricing_plan_free_feature_platforms: "1 plataforma principal",
    pricing_plan_free_feature_scheduler:
      "Planificación manual básica y recordatorios",
    pricing_plan_free_feature_storage:
      "Hasta 20 borradores y 300 MB de archivos subidos",
    pricing_plan_free_cta: "Empieza gratis",

    pricing_plan_monthly_name: "Pro – Mensual",
    pricing_plan_monthly_description:
      "Acceso mes a mes para creadores activos.",
    pricing_plan_monthly_price: "12 $",
    pricing_plan_monthly_period: "/mes",
    pricing_plan_monthly_highlight: "El más popular",
    pricing_plan_monthly_feature_ideas:
      "Hasta 150 ideas IA al mes",
    pricing_plan_monthly_feature_captions:
      "Hasta 100 textos IA al mes",
    pricing_plan_monthly_feature_platforms: "Soporte multi-plataforma",
    pricing_plan_monthly_feature_scheduler:
      "Calendario inteligente y plan de publicación multi-plataforma",
    pricing_plan_monthly_feature_storage:
      "Hasta 300 borradores y 10 GB de archivos subidos",

    pricing_plan_quarterly_name: "Pro – Trimestral",
    pricing_plan_quarterly_description:
      "Ahorra pagando cada 3 meses.",
    pricing_plan_quarterly_price: "30 $",
    pricing_plan_quarterly_period: "Cada 3 meses (~10 $/mes)",
    pricing_plan_quarterly_highlight: "Ahorra ~17 %",
    pricing_plan_quarterly_feature_ideas:
      "Hasta 450 ideas IA por 3 meses",
    pricing_plan_quarterly_feature_captions:
      "Hasta 300 textos IA por 3 meses",
    pricing_plan_quarterly_feature_platforms: "Soporte multi-plataforma",
    pricing_plan_quarterly_feature_scheduler:
      "Calendario inteligente y plan de publicación multi-plataforma",
    pricing_plan_quarterly_feature_storage:
      "Hasta 300 borradores y 10 GB de archivos subidos",

    pricing_plan_yearly_name: "Pro – Anual",
    pricing_plan_yearly_description:
      "La mejor opción para creadores serios.",
    pricing_plan_yearly_price: "99 $",
    pricing_plan_yearly_period: "/año (~8,25 $/mes)",
    pricing_plan_yearly_highlight: "Ahorra ~31 %",
    pricing_plan_yearly_feature_ideas:
      "Hasta 1.800 ideas IA al año",
    pricing_plan_yearly_feature_captions:
      "Hasta 1.200 textos IA al año",
    pricing_plan_yearly_feature_platforms: "Soporte multi-plataforma",
    pricing_plan_yearly_feature_scheduler:
      "Calendario inteligente y plan de publicación multi-plataforma",
    pricing_plan_yearly_feature_storage:
      "Hasta 300 borradores y 10 GB de archivos subidos",

    pricing_error_not_configured:
      "Este plan todavía no está configurado. Inténtalo de nuevo más tarde.",
    pricing_error_login_required:
      "Inicia sesión para poder mejorar tu plan.",
    pricing_error_checkout_generic:
      "No se pudo iniciar el pago. Inténtalo de nuevo.",
    pricing_error_checkout_stripe:
      "No se pudo iniciar el proceso de pago con Stripe.",

    pricing_footer_note:
      "Los pagos se procesan de forma segura con Stripe. Puedes cancelar tu suscripción en cualquier momento.",

    pricing_plan_paid_cta: "Tarif wählen",
    pricing_plan_paid_cta_loading: "Weiterleiten…",

    account_billing_on_pro_cancel_scheduled: "Tu suscripción Pro no se renovará. Finalizará el",
    account_billing_on_pro_cancel_scheduled_no_date: "Tu suscripción Pro no se renovará al final del periodo de facturación actual.",
    account_billing_cancel_button: "Cancelar suscripción",
    account_billing_cancel_confirm: "¿Estás seguro de que deseas cancelar tu suscripción Pro? Mantendrás el acceso hasta el final del periodo de facturación actual.",
    account_billing_cancel_confirm_button: "Sí, cancelar Pro",
    account_billing_cancel_keep_pro_button: "Mantener Pro",
    account_billing_cancel_loading: "Cancelando…",
    account_billing_cancel_error: "No pudimos cancelar tu suscripción. Inténtalo nuevamente o contacta al soporte."
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
        // Página "Casos de uso"
    usecases_header_label: "Casos de uso",
    usecases_title_main: "Faça o Polypost",
    usecases_title_highlight: "combinar com o seu estilo",
    usecases_subtitle:
      "Escolha um preset que combine com a sua plataforma, idioma e vibe. Copiamos essas configurações para o seu perfil de criador (vibe, tom, nicho, público…) para que as ideias e legendas já venham com a sua cara desde o primeiro dia.",

    usecases_brand_title:
      "Defina sua marca como criador(a) (com IA)",
    usecases_brand_subtitle:
      "Não tem certeza da sua vibe, tom ou nicho? Preencha este formulário e o Polypost vai sugerir personas de marca com estilo, bio e pilares de conteúdo recomendados.",

    usecases_brand_niche_placeholder:
      "Seu nicho (fitness, modelo, gamer, OF, beleza...)",
    usecases_brand_target_placeholder:
      "Quem você quer atrair?",
    usecases_brand_goals_placeholder:
      "Seus objetivos (crescer rápido, criar fãs, aumentar renda no OF...)",
    usecases_brand_comfort_placeholder:
      "Nível de conforto (brincalhão, sério, explícito, introvertido...)",

    usecases_brand_error:
      "⚠️ Não foi possível gerar personas de marca. Tente novamente.",
    usecases_brand_button_thinking: "Pensando…",
    usecases_brand_button_generate: "Gerar personas de marca",
    usecases_brand_pick_persona:
      "Escolha a persona que mais combina com a sua identidade de criador(a):",
    usecases_brand_button_applied: "Aplicado ✓",
    usecases_brand_button_use_persona: "Usar esta persona",

    usecases_bio_no_base:
      "Não há uma bio base para refinar para esta persona.",
    usecases_bio_refine_error: "⚠️ Não foi possível refinar a bio.",
    usecases_bio_copied_toast: "📋 Bio copiada para a área de transferência",

    usecases_bio_short_label: "Bio curta",
    usecases_bio_long_label: "Bio longa",
    usecases_bio_cta_label: "Bio focada em CTA",
    usecases_bio_fun_label: "Bio divertida / leve",
    usecases_bio_refine_button: "Ajustar bio",

    usecases_toast_persona_applied:
      "🎉 Persona de marca aplicada ao seu perfil!",
    usecases_toast_persona_apply_error:
      "⚠️ Não foi possível aplicar a persona. Tente novamente.",

    usecases_how_title: "Como os criadores usam o Polypost",
    usecases_how_step1:
      "1. Escolha um preset que combine com a sua plataforma principal (OF, Reels do IG, tendências do TikTok…).",
    usecases_how_step2:
      "2. Copiamos as configurações (vibe, tom, nicho, público-alvo, idioma) para o seu perfil.",
    usecases_how_step3:
      "3. Gere ideias e legendas pelo Painel — tudo alinhado com o preset.",
    usecases_how_step4:
      "4. Ajuste quando quiser na página Conta se mudar de estilo ou de público.",

    usecases_presets_title: "Biblioteca de presets",
    usecases_presets_subtitle:
      "Estamos adicionando setups prontos para perfis típicos: OF, modelos do Instagram, cosplay, fitness, gaming e mais.",
    usecases_presets_note:
      "Depois de aplicar um preset, vá ao Painel e comece a gerar — sem configuração extra.",

    usecases_loading_presets: "Carregando presets…",
    usecases_empty_presets:
      "Ainda não há presets. Estamos preenchendo a biblioteca — volte em breve.",
    usecases_list_title: "Presets disponíveis",
    usecases_list_hint:
      "Clique em « Aplicar preset » para atualizar seu perfil de criador na hora.",
    usecases_apply_button: "Aplicar preset",
        // Dashboard
    dashboard_header_title: "Painel",
    dashboard_header_subtitle:
      "Gere ideias, legendas e agende seus posts – tudo em um só lugar.",
    dashboard_header_button_use_cases: "Casos de uso e modelos",
    dashboard_header_button_gallery: "Abrir galeria",

    dashboard_quick_title: "Criar algo novo",
    dashboard_quick_subtitle:
      "Gere ideias, legendas ou envie um media para começar um rascunho.",

    dashboard_card_ideas_title: "Gerador de ideias",
    dashboard_card_ideas_text:
      "Receba hooks, ângulos e ideias adaptadas ao seu nicho.",
    dashboard_card_ideas_button: "Abrir ideias",

    dashboard_card_upload_title: "Upload & Legenda",
    dashboard_card_upload_text:
      "Envie uma imagem ou vídeo e receba uma legenda na hora.",
    dashboard_card_upload_button: "Abrir upload",

    dashboard_card_scheduler_title: "Agendador inteligente",
    dashboard_card_scheduler_text:
      "Veja os melhores horários para postar e planeje seu calendário.",
    dashboard_card_scheduler_button: "Abrir agendador",

    dashboard_stats_title: "Visão rápida",
    dashboard_stats_ideas_label: "Ideias geradas",
    dashboard_stats_drafts_label: "Rascunhos salvos",
    dashboard_stats_scheduled_label: "Posts agendados",

    dashboard_recent_title: "Rascunhos recentes",
    dashboard_recent_link_all: "Ver todos os rascunhos →",
    dashboard_recent_empty:
      "Ainda não há rascunhos. Gere ideias ou envie um media para começar.",
    dashboard_recent_untitled: "Sem título",
    dashboard_recent_type_media: "Rascunho de media",
    dashboard_recent_type_idea: "Rascunho de ideia",
    dashboard_recent_open_button: "Abrir",

    dashboard_modal_ideas_title: "Gerador de ideias",
    dashboard_modal_ideas_intro:
      "Vamos gerar hooks e ideias para Instagram. Depois você poderá ajustar seu nicho e plataforma.",
    dashboard_modal_ideas_button_generate: "Gerar 5 ideias",
    dashboard_modal_ideas_button_generating: "Gerando...",
    dashboard_modal_ideas_empty:
      "Ainda não há ideias. Clique no botão acima.",
    dashboard_modal_ideas_fallback_title: "Ideia",
    dashboard_modal_ideas_caption_start_label: "Início da legenda:",
    dashboard_modal_ideas_twist_label: "Twist pessoal:",
    dashboard_modal_ideas_save_button: "Salvar rascunho",
    dashboard_modal_ideas_save_saving: "Salvando...",
    dashboard_modal_ideas_plan_button: "Gerar plano de ação",
    dashboard_modal_ideas_plan_generating: "Gerando plano…",
    dashboard_modal_ideas_plan_ready: "✓ Plano de ação pronto",
    dashboard_modal_ideas_plan_loading:
      "Estamos transformando esta ideia em passos concretos…",
    dashboard_actionplan_title: "Plano de ação",

    dashboard_modal_upload_title: "Upload & Legenda",
    dashboard_modal_upload_button: "Enviar",

    dashboard_upload_status_uploading: "Enviando...",
    dashboard_upload_status_uploaded:
      "Upload concluído ✅ — agora você pode gerar uma legenda.",
    dashboard_upload_status_failed: "Falha no upload.",
    dashboard_upload_status_need_upload: "Envie um arquivo primeiro.",
    dashboard_upload_caption_button: "Gerar legenda",
    dashboard_upload_status_caption_generating: "Gerando legenda...",
    dashboard_upload_status_caption_ready: "Legenda gerada ✅",
    dashboard_upload_status_caption_failed:
      "Falha ao gerar a legenda.",
    dashboard_upload_status_need_caption:
      "Gere uma legenda antes de salvar este rascunho.",
    dashboard_upload_status_need_title:
      "Adicione um título antes de salvar este rascunho.",
    dashboard_upload_status_saved: "Rascunho de media salvo ✅",
    dashboard_upload_status_save_failed:
      "Falha ao salvar o rascunho.",

    dashboard_upload_caption_label: "Legenda",
    dashboard_upload_draft_title_label: "Título do rascunho",
    dashboard_upload_draft_title_placeholder:
      "ex.: Selfie na academia, Reels na praia, Story de perguntas",
    dashboard_upload_save_button: "Salvar como rascunho",
    dashboard_upload_save_saving: "Salvando...",
        // Scheduler
    scheduler_title: "Agendador",
    scheduler_subtitle:
      "Clique em um dia para adicionar um lembrete ou gerar um plano de postagem.",

    scheduler_ai_button_generate:
      "Gerar plano multi-plataforma",
    scheduler_ai_button_generating:
      "Gerando plano multi-plataforma…",
    scheduler_ai_toast_prefix:
      "🎯 Novo plano de postagem adicionado para: ",
    scheduler_ai_toast_generic:
      "🎯 Novo plano de postagem adicionado ao seu calendário!",
    scheduler_ai_toast_error:
      "⚠️ Não foi possível gerar o plano de postagem.",

    scheduler_modal_title: "Lembretes",
    scheduler_modal_existing_label: "Lembretes existentes",
    scheduler_modal_time_label: "Horário",
    scheduler_modal_platform_label: "Plataforma",
    scheduler_modal_attach_label: "Anexar um rascunho (opcional)",
    scheduler_modal_no_draft_option: "Sem rascunho",
    scheduler_modal_note_label: "Nota (opcional)",
    scheduler_modal_note_placeholder:
      "ex.: Postar teaser do Reel aqui",
    scheduler_modal_notify_label:
      "Enviar lembrete por e-mail.",
    scheduler_modal_close_button: "Fechar",
    scheduler_modal_save_button: "Adicionar lembrete",
    scheduler_modal_save_saving: "Salvando…",
    scheduler_modal_delete_button: "Excluir",

    scheduler_alert_delete_failed:
      "Não foi possível excluir o lembrete. Tente novamente.",
    scheduler_alert_save_failed:
      "Não foi possível salvar o lembrete. Tente novamente.",
    scheduler_alert_suggestions_failed:
      "Não foi possível carregar as sugestões de horários.",

    scheduler_suggestions_title: "Horários recomendados",
    scheduler_suggestions_platform_label: "Plataforma",
    scheduler_suggestions_button_generate: "Gerar horários",
    scheduler_suggestions_button_generating: "Gerando…",
    scheduler_suggestions_click_hint:
      "Clique em um horário para transformá-lo em lembrete:",
    scheduler_suggestions_loading: "Carregando sugestões…",
        // Reviews
    reviews_title: "O que os criadores dizem",
    reviews_subtitle:
      "Ajude-nos a melhorar o Postly e veja o que os outros acham.",
    reviews_loading: "Carregando avaliações…",
    reviews_empty:
      "Ainda não há avaliações. Seja o primeiro a deixar sua opinião!",
    reviews_username_anonymous: "anônimo",
    reviews_summary_review_singular: "avaliação",
    reviews_summary_review_plural: "avaliações",

    reviews_success: "Obrigado pelo seu feedback! 💜",
    reviews_error:
      "Não foi possível enviar sua avaliação. Tente novamente.",

    reviews_rating_label: "Sua nota:",
    reviews_title_placeholder:
      "Título opcional (ex.: « Muito útil para IG »)",
    reviews_comment_placeholder:
      "Conte como o Postly ajuda você (ou o que poderíamos melhorar)…",
    reviews_button_submit: "Enviar avaliação",
    reviews_button_sending: "Enviando…",
        // Account page
    account_title: "Configurações da conta",
    account_subtitle:
      "Gerencie seu perfil de criador(a), plano e conexões.",

    account_profile_title: "Perfil",
    account_profile_subtitle:
      "Atualize sua foto e informações básicas. Usamos isso para personalizar sua experiência.",
    account_profile_choose_file: "Escolher arquivo",
    account_profile_save_picture: "Salvar foto",
    account_profile_uploading: "Enviando...",
    account_profile_username_label: "Nome de usuário:",
    account_profile_email_label: "Email:",

    account_billing_title: "Plano e cobrança",
    account_billing_loading: "Carregando plano...",
    account_billing_current_plan_label: "Plano atual:",
    account_billing_plan_pro_label: "Pro (12 US$/mês)",
    account_billing_plan_free_label: "Gratuito",
    account_billing_upgrade_button: "Migrar para Pro",
    account_billing_upgrade_redirecting: "Redirecionando...",
    account_billing_view_pricing_link:
      "Ver todos os planos e preços →",
    account_billing_on_pro_label: "Você está no Pro ✅",
    account_billing_stripe_note:
      "Os pagamentos são processados com segurança pela Stripe.",
    account_billing_checkout_error:
      "Não foi possível iniciar o checkout (STRIPE_SECRET_KEY está configurada?).",

    account_prefs_title: "Preferências de criador(a)",
    account_prefs_subtitle:
      "Elas orientam a geração de ideias e legendas em todo o app.",
    account_prefs_loading: "Carregando...",
    account_prefs_saved: "Salvo ✅",

    account_error_load_prefs:
      "Não foi possível carregar as preferências.",
    account_error_save_prefs:
      "Não foi possível salvar as preferências.",
    account_error_save_notifications:
      "Não foi possível salvar as preferências de notificação.",
    account_error_avatar:
      "Não foi possível enviar o avatar.",

    account_prefs_vibe_label: "Vibe",
    account_prefs_vibe_placeholder: "divertida, edgy, chique...",
    account_prefs_tone_label: "Tom",
    account_prefs_tone_placeholder: "casual, profissional...",
    account_prefs_niche_label: "Nicho",
    account_prefs_niche_placeholder: "fitness, beleza, games...",
    account_prefs_target_label: "Público-alvo",
    account_prefs_target_placeholder:
      "mulheres jovens, assinantes de OF, seguidores do IG...",
    account_prefs_default_platform_label: "Plataforma padrão",
    account_prefs_active_platforms_label: "Plataformas ativas",
    account_prefs_timezone_label: "Fuso horário",
    account_prefs_timezone_placeholder: "Europe/Paris",
    account_prefs_save_button: "Salvar preferências",
    account_prefs_save_saving: "Salvando...",

    account_notifications_title: "Notificações",
    account_notifications_subtitle:
      "Escolha o que você quer receber do Postly.",
    account_notifications_content_label:
      "Lembretes de conteúdo (email / futuros push)",
    account_notifications_marketing_label:
      "Newsletter e novidades do produto",
    account_notifications_save_button:
      "Salvar preferências de notificação",

    account_connected_title: "Contas conectadas",
    account_connected_ig_coming: "Em breve...",
    account_connected_ig_connect_button: "Conectar",
    account_connect_ig_error:
      "A conexão com o IG ainda não está disponível.",

    account_security_title: "Segurança",
    account_security_subtitle:
      "Altere sua senha. Você continuará conectado neste dispositivo.",
    account_security_current_pw_label: "Senha atual",
    account_security_new_pw_label: "Nova senha",
    account_security_change_pw_button: "Alterar senha",

    account_pw_change_success: "Senha atualizada ✅",
    account_pw_change_error_generic:
      "Não foi possível alterar a senha. Tente novamente.",

    account_logout_button: "Sair",
        // Gallery
    gallery_title: "Minha galeria de conteúdo",
    gallery_subtitle:
      "Todas as suas ideias e rascunhos de mídia criados no Postly. Fixe seus favoritos e arquive o que já foi feito.",
    gallery_back_to_dashboard: "← Voltar para o painel",

    gallery_filter_all: "Todos os rascunhos",
    gallery_filter_pinned: "Fixados",
    gallery_filter_idea: "Ideias",
    gallery_filter_media: "Rascunhos de mídia",

    gallery_loading: "Carregando rascunhos...",
    gallery_empty_text:
      "Ainda não há rascunhos. Vá para o painel para gerar ideias ou enviar mídia no",
    gallery_empty_link_label: "painel",

    gallery_card_untitled: "Rascunho sem título",
    gallery_badge_pinned: "Fixado",
    gallery_badge_media: "Rascunho de mídia",
    gallery_badge_idea: "Rascunho de ideia",
    gallery_card_idea_fallback: "Detalhes da ideia",
    gallery_card_media_fallback:
      "Rascunho com legenda. Abra para ver / regenerar.",
    gallery_card_saved_prefix: "Salvo em",

    gallery_button_view_details: "Ver detalhes",
    gallery_button_archive: "Arquivar",
    gallery_button_pin: "Fixar",
    gallery_button_unpin: "Desafixar",

    gallery_archive_confirm:
      "Arquivar este rascunho? Ele sumirá desta lista.",

    gallery_modal_title_fallback: "Detalhes do rascunho",
    gallery_modal_subtitle_media:
      "Rascunho de mídia – veja a imagem e regenere a legenda.",
    gallery_modal_subtitle_idea:
      "Rascunho de ideia – ajuste o conteúdo e salve.",

    gallery_modal_caption_label: "Legenda",
    gallery_modal_caption_regenerate: "Regenerar",
    gallery_modal_caption_regenerating: "Regenerando...",
    gallery_modal_caption_placeholder:
      "A legenda aparecerá aqui depois de gerada.",
    gallery_modal_caption_generated_prefix:
      "Nova legenda gerada em",
    gallery_modal_caption_generated_suffix:
      "(ainda não vinculada a este rascunho no servidor).",

    gallery_idea_title_label: "Título",
    gallery_idea_title_placeholder: "Título da ideia",
    gallery_idea_description_label: "Descrição",
    gallery_idea_description_placeholder:
      "Descreva a ideia de conteúdo",
    gallery_idea_hook_label: "Gancho usado",
    gallery_idea_hook_placeholder: "Gancho ou ângulo usado",
    gallery_idea_caption_starter_label: "Início da legenda",
    gallery_idea_caption_starter_placeholder:
      "Frase de abertura sugerida",
    gallery_idea_twist_label: "Toque pessoal",
    gallery_idea_twist_placeholder:
      "Como você quer personalizar essa ideia",

    gallery_idea_save_button: "Salvar alterações",
    gallery_idea_save_saving: "Salvando...",

    gallery_action_plan_title: "Plano de ação",
        // Support
    support_eyebrow: "Precisa de ajuda?",
    support_title_prefix: "Contactar o",
    support_title_accent: "suporte",
    support_subtitle:
      "Encontrou um bug, problema de cobrança ou tem uma ideia? Envie uma mensagem e normalmente respondemos em 1–2 dias úteis.",
    support_success:
      "✅ Obrigado! Sua mensagem foi enviada. Vamos responder por email.",
    support_error:
      "Não foi possível enviar sua mensagem. Tente novamente.",

    support_label_email: "Email",
    support_label_subject: "Assunto",
    support_label_category: "Categoria",
    support_label_message: "Mensagem",
    support_placeholder_email: "voce@example.com",
    support_placeholder_subject:
      "Resumo curto do problema",
    support_placeholder_message:
      "Conte o que está acontecendo, passos para reproduzir, links, etc.",
    support_button_sending: "Enviando...",
    support_button_send: "Enviar mensagem",

    support_category_bug: "Bug / algo quebrou",
    support_category_billing: "Cobrança & assinaturas",
    support_category_idea: "Sugestão / nova função",
    support_category_other: "Outro",

    support_sidebar_title: "O que incluir",
    support_sidebar_item_platforms:
      "Em qual(is) plataforma(s) você usa (IG, TikTok, OF…)",
    support_sidebar_item_action:
      "O que você estava fazendo quando o problema aconteceu",
    support_sidebar_item_errors:
      "Quaisquer mensagens de erro ou screenshots",
    support_sidebar_billing_note:
      "Para dúvidas de cobrança, informe o email usado no Stripe.",

    // Upload
    upload_title: "Upload",
    upload_subtitle:
      "Envie um arquivo de mídia e gere uma legenda usando suas configurações do Postly.",
    upload_button_upload: "Enviar arquivo",
    upload_button_generate: "Gerar legenda",
    upload_caption_title: "Legenda",

    upload_status_uploading: "Enviando arquivo...",
    upload_status_uploaded:
      "Arquivo enviado. Agora você pode gerar uma legenda.",
    upload_status_failed: "Falha no upload.",
    upload_status_upload_first:
      "Envie um arquivo primeiro.",
    upload_status_generating: "Gerando legenda...",
    upload_status_caption_ok: "Legenda gerada ✅",
    upload_status_caption_failed:
      "Falha ao gerar a legenda.",
        // Pricing
    pricing_header_badge: "Planos",
    pricing_header_title:
      "Escolha o plano que combina com a sua jornada de criador(a)",
    pricing_header_subtitle:
      "Comece grátis e faça upgrade para o Pro quando estiver pronto(a). Cancele a qualquer momento. Todos os planos pagos incluem limites maiores para ideias, legendas e agendamentos.",

    pricing_plan_free_name: "Gratuito",
    pricing_plan_free_description:
      "Perfeito para testar o Postly sem compromisso.",
    pricing_plan_free_price: "US$ 0",
    pricing_plan_free_period: "Para sempre",
    pricing_plan_free_feature_ideas:
      "Até 15 ideias com IA por mês",
    pricing_plan_free_feature_captions:
      "Até 10 legendas com IA por mês",
    pricing_plan_free_feature_platforms: "1 plataforma principal",
    pricing_plan_free_feature_scheduler:
      "Agendamento manual básico e lembretes",
    pricing_plan_free_feature_storage:
      "Até 20 rascunhos e 300 MB em uploads",
    pricing_plan_free_cta: "Começar grátis",

    pricing_plan_monthly_name: "Pro – Mensal",
    pricing_plan_monthly_description:
      "Acesso mês a mês para criadores ativos.",
    pricing_plan_monthly_price: "US$ 12",
    pricing_plan_monthly_period: "/mês",
    pricing_plan_monthly_highlight: "Mais usado",
    pricing_plan_monthly_feature_ideas:
      "Até 150 ideias com IA por mês",
    pricing_plan_monthly_feature_captions:
      "Até 100 legendas com IA por mês",
    pricing_plan_monthly_feature_platforms: "Suporte multi-plataforma",
    pricing_plan_monthly_feature_scheduler:
      "Agendador inteligente e plano de postagem multi-plataforma",
    pricing_plan_monthly_feature_storage:
      "Até 300 rascunhos e 10 GB em uploads",

    pricing_plan_quarterly_name: "Pro – Trimestral",
    pricing_plan_quarterly_description:
      "Economize pagando a cada 3 meses.",
    pricing_plan_quarterly_price: "US$ 30",
    pricing_plan_quarterly_period: "A cada 3 meses (~US$ 10/mês)",
    pricing_plan_quarterly_highlight: "Economize ~17 %",
    pricing_plan_quarterly_feature_ideas:
      "Até 450 ideias com IA a cada 3 meses",
    pricing_plan_quarterly_feature_captions:
      "Até 300 legendas com IA a cada 3 meses",
    pricing_plan_quarterly_feature_platforms: "Suporte multi-plataforma",
    pricing_plan_quarterly_feature_scheduler:
      "Agendador inteligente e plano de postagem multi-plataforma",
    pricing_plan_quarterly_feature_storage:
      "Até 300 rascunhos e 10 GB em uploads",

    pricing_plan_yearly_name: "Pro – Anual",
    pricing_plan_yearly_description:
      "Melhor custo-benefício para criadores sérios.",
    pricing_plan_yearly_price: "US$ 99",
    pricing_plan_yearly_period: "/ano (~US$ 8,25/mês)",
    pricing_plan_yearly_highlight: "Economize ~31 %",
    pricing_plan_yearly_feature_ideas:
      "Até 1.800 ideias com IA por ano",
    pricing_plan_yearly_feature_captions:
      "Até 1.200 legendas com IA por ano",
    pricing_plan_yearly_feature_platforms: "Suporte multi-plataforma",
    pricing_plan_yearly_feature_scheduler:
      "Agendador inteligente e plano de postagem multi-plataforma",
    pricing_plan_yearly_feature_storage:
      "Até 300 rascunhos e 10 GB em uploads",

    pricing_error_not_configured:
      "Este plano ainda não está configurado. Tente novamente mais tarde.",
    pricing_error_login_required:
      "Entre na sua conta para fazer upgrade do plano.",
    pricing_error_checkout_generic:
      "Não foi possível iniciar o pagamento. Tente novamente.",
    pricing_error_checkout_stripe:
      "Não foi possível iniciar o pagamento com a Stripe.",

    pricing_footer_note:
      "Os pagamentos são processados com segurança pela Stripe. Você pode cancelar a assinatura a qualquer momento.",
    
    pricing_plan_paid_cta: "Elegir plan",
    pricing_plan_paid_cta_loading: "Redirigiendo…",

    account_billing_on_pro_cancel_scheduled: "Sua assinatura Pro não será renovada. Ela terminará em",
    account_billing_on_pro_cancel_scheduled_no_date: "Sua assinatura Pro não será renovada ao final do período de cobrança atual.",
    account_billing_cancel_button: "Cancelar assinatura",
    account_billing_cancel_confirm: "Tem certeza de que deseja cancelar sua assinatura Pro? Você manterá o acesso até o final do período de cobrança atual.",
    account_billing_cancel_confirm_button: "Sim, cancelar Pro",
    account_billing_cancel_keep_pro_button: "Manter Pro",
    account_billing_cancel_loading: "Cancelando…",
    account_billing_cancel_error: "Não foi possível cancelar sua assinatura. Tente novamente ou entre em contato com o suporte."

    

    },
};

export function t(lang: SupportedLang, key: string): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}
