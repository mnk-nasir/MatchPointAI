import logging
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from core.models import InvestorProfile

logger = logging.getLogger(__name__)

def _get_html_wrapper(content_html: str) -> str:
    """Wrapper for dark-mode styled HTML emails matching the site's layout triggers."""
    return f"""
    <html>
    <body style="margin:0; padding:0; background-color:#02030a; font-family:'Inter', sans-serif; color:#ffffff;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #0d1117; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 25px; text-align: center;">
                <h1 style="margin:0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">MatchPoint AI</h1>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: rgba(255,255,255,0.8); font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Intelligence Engine</p>
            </div>
            <div style="padding: 30px;">
                {content_html}
            </div>
            <div style="background-color: #070a0f; padding: 15px; text-align: center; border-top: 1px solid rgba(255,255,255,0.03);">
                <span style="font-size: 11px; color: rgba(255,255,255,0.3);">&copy; 2026 MatchPoint AI. All rights reserved.</span>
            </div>
        </div>
    </body>
    </html>
    """

def send_investor_interest_confirmation(lead):
    """Notify the investor that their submission was received."""
    if not hasattr(lead, 'email') or not lead.email:
         return
    
    content = f"""
    <h3 style="color: #6366f1; margin-top:0;">Hello {getattr(lead, 'name', 'there')},</h3>
    <p style="line-height: 1.6; color: rgba(255,255,255,0.8);">Thank you for expressing interest in MatchPoint AI.</p>
    <p style="line-height: 1.6; color: rgba(255,255,255,0.8);">Our team has received your submission and will connect with you very soon regarding onboarding and access.</p>
    
    <div style="margin: 25px 0; padding: 15px; border-radius: 12px; background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);">
        <p style="margin:0; font-size: 11px; text-transform: uppercase; color: rgba(255,255,255,0.4); letter-spacing: 1px;">Details Recorded</p>
        <p style="margin: 5px 0 0 0; font-size: 13px; font-weight: 600; color: #a855f7;">Focus: {getattr(lead, 'focus', 'N/A')}</p>
    </div>
    
    <p style="line-height: 1.6; color: rgba(255,255,255,0.8);">Best regards,<br/>The MatchPoint AI Team</p>
    """
    
    try:
        send_mail(
            subject="Submission Received — MatchPoint AI",
            message="Thank you for your submission. Our team will connect with you very soon.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[lead.email],
            html_message=_get_html_wrapper(content),
            fail_silently=True
        )
    except Exception as e:
        logger.error(f"[MailService] Confirmation failed: {e}")

def send_investor_interest_admin_alert(lead):
    """Notify the Admin with full lead details."""
    content = f"""
    <h3 style="color: #ec4899; margin-top:0;">New Investor Interest Lead 📢</h3>
    <p style="color: rgba(255,255,255,0.8);">A new investor submitted interest:</p>
    
    <div style="margin: 20px 0; display: grid; gap: 10px; padding: 15px; border-radius: 12px; background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);">
        <p style="margin:0; font-size:13px;"><strong style="color: rgba(255,255,255,0.5);">Name:</strong> {getattr(lead, 'name', '—')}</p>
        <p style="margin:0; font-size:13px;"><strong style="color: rgba(255,255,255,0.5);">Email:</strong> {getattr(lead, 'email', '—')}</p>
        <p style="margin:0; font-size:13px;"><strong style="color: rgba(255,255,255,0.5);">Firm:</strong> {getattr(lead, 'firm', '—')}</p>
        <p style="margin:0; font-size:13px;"><strong style="color: rgba(255,255,255,0.5);">Role:</strong> {getattr(lead, 'role', '—')}</p>
        <p style="margin:0; font-size:13px;"><strong style="color: rgba(255,255,255,0.5);">Focus:</strong> {getattr(lead, 'focus', '—')}</p>
        <p style="margin:0; font-size:13px;"><strong style="color: rgba(255,255,255,0.5);">LinkedIn:</strong> {getattr(lead, 'linkedin', '—')}</p>
    </div>
    """
    
    try:
        send_mail(
            subject=f"New Investor Lead — {getattr(lead, 'name', 'Interest')}",
            message=f"New Lead: {getattr(lead, 'name', '')}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            html_message=_get_html_wrapper(content),
            fail_silently=True
        )
    except Exception as e:
         logger.error(f"[MailService] Admin alert failed: {e}")

def send_startup_submission_admin_alert(evaluation):
    """Notify the Admin with startup details and metrics score benchmarks."""
    content = f"""
    <h3 style="color: #10b981; margin-top:0;">New Startup Evaluation Submitted ✅</h3>
    <p style="color: rgba(255,255,255,0.8);">A company registered for scoring:</p>
    
    <div style="margin: 20px 0; padding: 15px; border-radius: 12px; background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);">
        <p style="margin:0; font-size: 16px; font-weight: bold; color: #ffffff;">{evaluation.company_name}</p>
        <p style="margin: 2px 0 10px 0; font-size: 12px; color: #10b981; font-weight: 600;">Stage: {evaluation.stage}</p>
        
        <div style="margin-top: 10px; display: flex; gap: 15px;">
            <div>
                <span style="font-size: 10px; color: rgba(255,255,255,0.4);">TOTAL SCORE</span><br/>
                <strong style="color: #6366f1; font-size: 18px;">{evaluation.total_score}/100</strong>
            </div>
            <div style="margin-left: 20px;">
                <span style="font-size: 10px; color: rgba(255,255,255,0.4);">RATING</span><br/>
                <strong style="color: #a855f7; font-size: 18px;">{evaluation.rating}</strong>
            </div>
        </div>
    </div>
    """
    try:
        send_mail(
            subject=f"New Startup Registered — {evaluation.company_name}",
            message=f"Startup {evaluation.company_name} registered.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            html_message=_get_html_wrapper(content),
            fail_silently=True
        )
    except Exception as e:
        logger.error(f"[MailService] Startup admin alert failed: {e}")

def send_new_startup_investor_alert(evaluation):
    """Broadcast alert to all Investors with a stylized teaser configuration."""
    investors = InvestorProfile.objects.all().select_related('user')
    emails = [inv.user.email for inv in investors if inv.user and inv.user.email]
    if not emails:
        return
        
    content = f"""
    <h3 style="color: #f59e0b; margin-top:0;">New Startup Opportunity 🌟</h3>
    <p style="color: rgba(255,255,255,0.8);">A new company matching our premium rating thresholds has registered:</p>
    
    <div style="margin: 20px 0; padding: 20px; border-radius: 16px; background-color: rgba(255,255,255,0.03); border: 1px solid rgba(245, 158, 11, 0.2); text-align: center;">
        <h4 style="margin: 0 0 5px 0; font-size: 18px; color: #ffffff;">{evaluation.company_name}</h4>
        <span style="font-size:11px; color: rgba(255,255,255,0.5); text-transform: uppercase;">{evaluation.stage} Stage</span>
        
        <div style="margin: 20px 0; padding: 10px; border-radius: 8px; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); display: inline-block;">
             <span style="font-size: 10px; color: #f59e0b; opacity: 0.8; letter-spacing: 0.5px;">MATCHPOINT SCORE</span><br/>
             <strong style="font-size: 24px; color: #ffffff;">{evaluation.total_score}</strong>
        </div>
    </div>
    
    <p style="line-height: 1.6; color: rgba(255,255,255,0.8); text-align: center;">
        Log in to your dashboard to review full metrics, risk profiles, and news signals.
    </p>
    """
    try:
        # Broadcasting individually or bcc is safer, using send_mail inside loop is okay for small sets,
        # but let's do a single send with bcc for performance if many, using list for simplicity here for individual items.
        for email in emails:
            send_mail(
                subject=f"New Opportunity: {evaluation.company_name} is now live!",
                message=f"New Startup on board: {evaluation.company_name}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=_get_html_wrapper(content),
                fail_silently=True
            )
    except Exception as e:
        logger.error(f"[MailService] Investor broadcast failed: {e}")
