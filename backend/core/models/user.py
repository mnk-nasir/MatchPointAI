import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    """
    Custom User model for SaaS platform.
    Uses email as the primary login identifier.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_('email address'), unique=True, db_index=True)
    
    # Additional SaaS fields
    is_founder = models.BooleanField(_('Is Founder'), default=True)
    is_investor = models.BooleanField(_('Is Investor'), default=False)
    
    company = models.CharField(_('Company'), max_length=255, blank=True, default="")
    phone = models.CharField(_('Phone'), max_length=50, blank=True, default="")
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-date_joined']

    def __str__(self):
        return self.email

class InvestorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='investor_profile')
    firm_name = models.CharField(max_length=255, blank=True, default="")
    target_industries = models.JSONField(default=list, blank=True, help_text="List of industries of interest")
    preferred_stages = models.JSONField(default=list, blank=True, help_text="e.g., ['Seed', 'Series A']")
    min_ticket_size = models.IntegerField(null=True, blank=True)
    max_ticket_size = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.firm_name}"
