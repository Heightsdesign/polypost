# api/email_templates.py


SUPPORTED_EMAIL_LANGS = {"en", "fr", "es", "pt"}


def normalize_lang_code(code: str | None) -> str:
    """
    Normalise 'fr-FR' -> 'fr', fallback to 'en' if unsupported or empty.
    """
    if not code:
        return "en"
    base = code.split("-")[0].lower()
    return base if base in SUPPORTED_EMAIL_LANGS else "en"




POSTLY_EMAIL_TEMPLATE = """<!DOCTYPE html>
<html lang="{{LANG}}" style="margin:0; padding:0;">
  <body style="margin:0; padding:0; background:#f5f3ff; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ff; padding:20px 0;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background:white; border-radius:18px; padding:32px; border:1px solid #e4ddff;">
            <tr>
              <td style="text-align:center; padding-bottom:18px;">
                <div style="font-size:24px; font-weight:800; color:#6c4bf4;">
                  Polypost
                </div>
              </td>
            </tr>
            <tr>
              <td style="font-size:20px; font-weight:700; color:#2a2a2a; padding-bottom:12px; text-align:center;">
                {{TITLE}}
              </td>
            </tr>
            <tr>
              <td style="font-size:14px; color:#444; line-height:1.6; padding-bottom:22px;">
                {{MESSAGE}}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:26px;">
                <a href="{{BUTTON_URL}}"
                   style="display:inline-block; background:linear-gradient(90deg,#6c4bf4,#ff79c7); color:white; padding:12px 22px; border-radius:12px; font-size:14px; font-weight:600; text-decoration:none; box-shadow:0 3px 8px rgba(108,75,244,0.25);">
                  {{BUTTON_TEXT}}
                </a>
              </td>
            </tr>
            <tr>
              <td style="font-size:12px; color:#888; text-align:center; line-height:1.5;">
                {{FOOTER_LINE}}<br/>
                © {{YEAR}} Polypost — All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>"""

# ------------------------------------------------------------
#  Per-email-type copy (subjects, message text, button text)
# ------------------------------------------------------------

EMAIL_TEXT = {
    "login_alert": {
        "en": {
            "subject": "Login alert for your Polypost account",
            "message": (
                "Hi {username},\n\n"
                "A login was just detected on your Polypost account:\n\n"
                "- IP: {ip}\n"
                "- Device: {device}\n"
                "- Time: {timestamp}\n\n"
                "If this wasn’t you, please reset your password immediately."
            ),
            "button_text": "Reset password",
        },
        "fr": {
            "subject": "Alerte de connexion sur ton compte Polypost",
            "message": (
                "Salut {username},\n\n"
                "Une connexion vient d’être détectée sur ton compte Polypost :\n\n"
                "- IP : {ip}\n"
                "- Appareil : {device}\n"
                "- Heure : {timestamp}\n\n"
                "Si ce n’était pas toi, merci de réinitialiser ton mot de passe immédiatement."
            ),
            "button_text": "Réinitialiser le mot de passe",
        },
        "es": {
            "subject": "Alerta de inicio de sesión en tu cuenta de Polypost",
            "message": (
                "Hola {username},\n\n"
                "Se ha detectado un inicio de sesión en tu cuenta de Polypost:\n\n"
                "- IP: {ip}\n"
                "- Dispositivo: {device}\n"
                "- Hora: {timestamp}\n\n"
                "Si no fuiste tú, restablece tu contraseña de inmediato."
            ),
            "button_text": "Restablecer contraseña",
        },
        "pt": {
            "subject": "Alerta de login na sua conta Polypost",
            "message": (
                "Olá {username},\n\n"
                "Um login foi detectado na sua conta Polypost:\n\n"
                "- IP: {ip}\n"
                "- Dispositivo: {device}\n"
                "- Horário: {timestamp}\n\n"
                "Se não foi você, redefina sua senha imediatamente."
            ),
            "button_text": "Redefinir senha",
        },
    },

    "confirm_account": {
        "en": {
            "subject": "Confirm your Polypost account",
            "message": (
                "Welcome to Polypost!\n\n"
                "Please confirm your email address by clicking the button below.\n\n"
                "If you didn't create this account, you can ignore this email."
            ),
            "button_text": "Confirm email",
        },
        "fr": {
            "subject": "Confirme ton compte Polypost",
            "message": (
                "Bienvenue sur Polypost !\n\n"
                "Merci de confirmer ton adresse email en cliquant sur le bouton ci-dessous.\n\n"
                "Si tu n'es pas à l’origine de cette inscription, tu peux ignorer cet email."
            ),
            "button_text": "Confirmer l’email",
        },
        "es": {
            "subject": "Confirma tu cuenta de Polypost",
            "message": (
                "¡Bienvenido/a a Polypost!\n\n"
                "Confirma tu correo haciendo clic en el botón de abajo.\n\n"
                "Si tú no creaste esta cuenta, puedes ignorar este correo."
            ),
            "button_text": "Confirmar correo",
        },
        "pt": {
            "subject": "Confirme sua conta Polypost",
            "message": (
                "Bem-vindo(a) à Polypost!\n\n"
                "Confirme seu email clicando no botão abaixo.\n\n"
                "Se você não criou esta conta, pode ignorar este e-mail."
            ),
            "button_text": "Confirmar e-mail",
        },
    },
    "password_reset": {
        "en": {
            "subject": "Reset your Polypost password",
            "message": (
                "You requested a password reset for your Polypost account.\n\n"
                "Click the button below to set a new password.\n\n"
                "If you didn’t request this, you can safely ignore this email."
            ),
            "button_text": "Reset password",
        },
        "fr": {
            "subject": "Réinitialise ton mot de passe Polypost",
            "message": (
                "Tu as demandé une réinitialisation de mot de passe pour ton compte Polypost.\n\n"
                "Clique sur le bouton ci-dessous pour définir un nouveau mot de passe.\n\n"
                "Si tu n’es pas à l’origine de cette demande, tu peux ignorer cet email."
            ),
            "button_text": "Réinitialiser le mot de passe",
        },
        "es": {
            "subject": "Restablece tu contraseña de Polypost",
            "message": (
                "Has solicitado restablecer la contraseña de tu cuenta de Polypost.\n\n"
                "Haz clic en el botón de abajo para crear una nueva contraseña.\n\n"
                "Si tú no hiciste esta solicitud, puedes ignorar este correo."
            ),
            "button_text": "Restablecer contraseña",
        },
        "pt": {
            "subject": "Redefinir sua senha da Polypost",
            "message": (
                "Você solicitou a redefinição da senha da sua conta Polypost.\n\n"
                "Clique no botão abaixo para definir uma nova senha.\n\n"
                "Se você não fez essa solicitação, pode ignorar este e-mail."
            ),
            "button_text": "Redefinir senha",
        },
    },
    "welcome_after_confirm": {
        "en": {
            "subject": "Welcome to Polypost! 🎉",
            "message": (
                "Your email has been confirmed and your Polypost account is ready to use!\n\n"
                "You’re all set — start generating ideas, captions, and planning your content.\n\n"
                "Click below to access your dashboard:"
            ),
            "button_text": "Go to dashboard",
        },
        "fr": {
            "subject": "Bienvenue sur Polypost ! 🎉",
            "message": (
                "Ton email est confirmé et ton compte Polypost est prêt à l’emploi !\n\n"
                "Tu peux maintenant générer des idées, des légendes et planifier ton contenu.\n\n"
                "Clique ci-dessous pour accéder à ton tableau de bord :"
            ),
            "button_text": "Accéder au tableau de bord",
        },
        "es": {
            "subject": "¡Bienvenido/a a Polypost! 🎉",
            "message": (
                "Tu correo ha sido confirmado y tu cuenta de Polypost está lista para usarse.\n\n"
                "Ya puedes generar ideas, textos y planificar tu contenido.\n\n"
                "Haz clic abajo para ir a tu panel:"
            ),
            "button_text": "Ir al panel",
        },
        "pt": {
            "subject": "Bem-vindo(a) à Polypost! 🎉",
            "message": (
                "Seu e-mail foi confirmado e sua conta Polypost está pronta para uso!\n\n"
                "Agora você pode gerar ideias, legendas e planejar seu conteúdo.\n\n"
                "Clique abaixo para acessar o painel:"
            ),
            "button_text": "Ir para o painel",
        },
    },
    "weekly_summary": {
        "en": {
            "subject": "Your weekly Polypost summary 📊",
            "message": (
                "Hi {username},\n\n"
                "Here’s your content summary for this week:\n\n"
                "- Ideas generated: {ideas}\n"
                "- Captions generated: {captions}\n"
                "- Drafts saved: {drafts}\n\n"
                "Stay consistent — every post is progress! 🚀"
            ),
            "button_text": "Open dashboard",
        },
        "fr": {
            "subject": "Ton résumé Polypost de la semaine 📊",
            "message": (
                "Salut {username},\n\n"
                "Voici ton résumé de contenu pour cette semaine :\n\n"
                "- Idées générées : {ideas}\n"
                "- Légendes générées : {captions}\n"
                "- Brouillons enregistrés : {drafts}\n\n"
                "Reste constant(e) — chaque post compte ! 🚀"
            ),
            "button_text": "Ouvrir le tableau de bord",
        },
        "es": {
            "subject": "Tu resumen semanal de Polypost 📊",
            "message": (
                "Hola {username},\n\n"
                "Aquí tienes tu resumen de contenido de esta semana:\n\n"
                "- Ideas generadas: {ideas}\n"
                "- Subtítulos generados: {captions}\n"
                "- Borradores guardados: {drafts}\n\n"
                "Sigue constante — ¡cada publicación suma! 🚀"
            ),
            "button_text": "Abrir panel",
        },
        "pt": {
            "subject": "Seu resumo semanal do Polypost 📊",
            "message": (
                "Olá {username},\n\n"
                "Aqui está seu resumo de conteúdo desta semana:\n\n"
                "- Ideias geradas: {ideas}\n"
                "- Legendas geradas: {captions}\n"
                "- Rascunhos salvos: {drafts}\n\n"
                "Mantenha a consistência — cada post conta! 🚀"
            ),
            "button_text": "Abrir painel",
        },
    },
    "posting_reminder": {
        "en": {
            "subject": "⏰ Posting reminder",
            "message": (
                "Hi {username},\n\n"
                "Just a reminder that your {platform} post is scheduled in 1 hour:\n"
                "- Scheduled time: {scheduled_time}\n"
                "- Note: {note}\n\n"
                "You're doing great — keep up the momentum! 💪"
            ),
            "button_text": "Open scheduler",
        },
        "fr": {
            "subject": "⏰ Rappel de publication",
            "message": (
                "Salut {username},\n\n"
                "Petit rappel : ton post {platform} est prévu dans 1 heure :\n"
                "- Heure prévue : {scheduled_time}\n"
                "- Note : {note}\n\n"
                "Tu gères très bien — continue comme ça ! 💪"
            ),
            "button_text": "Ouvrir le planning",
        },
        "es": {
            "subject": "⏰ Recordatorio de publicación",
            "message": (
                "Hola {username},\n\n"
                "Solo un recordatorio: tu publicación en {platform} está programada para dentro de 1 hora:\n"
                "- Hora prevista: {scheduled_time}\n"
                "- Nota: {note}\n\n"
                "¡Lo estás haciendo muy bien! 💪"
            ),
            "button_text": "Abrir agenda",
        },
        "pt": {
            "subject": "⏰ Lembrete de postagem",
            "message": (
                "Olá {username},\n\n"
                "Só um lembrete: sua postagem em {platform} está marcada para daqui 1 hora:\n"
                "- Horário previsto: {scheduled_time}\n"
                "- Nota: {note}\n\n"
                "Você está indo muito bem — continue assim! 💪"
            ),
            "button_text": "Abrir agenda",
        },
    },


}


EMAIL_FOOTER = {
    "en": "You're receiving this email because you have an account on Polypost.",
    "fr": "Tu reçois cet e-mail parce que tu as un compte sur Polypost.",
    "es": "Recibes este correo porque tienes una cuenta en Polypost.",
    "pt": "Você está recebendo este e-mail porque tem uma conta na Polypost.",
}


def get_email_text(kind: str, lang: str) -> dict:
    """
    Returns a dict with: subject, message, button_text.
    Falls back to English if lang/kind combo not found.
    """
    lang = normalize_lang_code(lang)
    by_kind = EMAIL_TEXT.get(kind, {})
    data = by_kind.get(lang) or by_kind.get("en")
    if not data:
        # Super fallback – shouldn't happen
        return {
            "subject": "Polypost",
            "message": "",
            "button_text": "Open",
        }
    return data
