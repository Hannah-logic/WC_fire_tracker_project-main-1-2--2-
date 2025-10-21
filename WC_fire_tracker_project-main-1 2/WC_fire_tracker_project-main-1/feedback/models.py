from django.db import models
# Import the model for linking
from tracker.models import RegenerationSite 


# User feedback or contact form model


class Feedback(models.Model):
    name = models.CharField(max_length=120)       # User's name
    email = models.EmailField()             # User's email
    message = models.TextField()            # Feedback message
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        
        return f"{self.name} — {self.email}"   # Display name and email in admin panel


class UserFeedback(models.Model):
    REGEN_STATUS_CHOICES = [
        ('F', 'Fine to Walk (Good Regeneration)'),
        ('M', 'Moderate Recovery (Trails OK)'),
        ('P', 'Poor Recovery (Hazardous/Closed)'),
        ('I', 'Initial Growth (Requires Caution)'),
    ]
    
    # LINKAGE to the RegenerationSite
    site = models.ForeignKey(
        RegenerationSite,
        on_delete=models.CASCADE, 
        related_name='user_reports',
        verbose_name="Regeneration Site"
    )
    
    # Renaming fields for clarity vs. the general Feedback model
    user_name = models.CharField(max_length=100, verbose_name="Your Name/Handle", blank=True, default='Anonymous')
    comment = models.TextField(verbose_name="Regeneration Observation/Comment")
    regeneration_status = models.CharField(
        max_length=1, 
        choices=REGEN_STATUS_CHOICES, 
        default='I',
        verbose_name="Current Trail/Regeneration Status"
    )
    
  
    
    date_posted = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Report on {self.site.site_name} by {self.user_name}"