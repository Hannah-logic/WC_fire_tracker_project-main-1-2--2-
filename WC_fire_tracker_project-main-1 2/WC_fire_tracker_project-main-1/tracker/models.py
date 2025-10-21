from django.db import models

# Tracker Models 

class FireIncident(models.Model):
    title = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    date = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    source_url = models.URLField(blank=True)
    status = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """String representation of the FireIncident model."""
        return f"{self.title} — {self.location or 'unknown'}"   # Return title and location (or 'unknown' if location is empty)

class RegenerationSite(models.Model):
    # Link to the FireIncident (ForeignKey) that affects this site
        associated_fire = models.ForeignKey(
            FireIncident, 
            on_delete=models.SET_NULL, # Keep the site record even if the fire record is deleted
            null=True, 
            blank=True,
            related_name='regeneration_sites',
            verbose_name="Associated Fire Incident"
        )
    
        site_name = models.CharField(max_length=200, unique=True)
        # Replicate location fields for specific tracking
        latitude = models.DecimalField(max_digits=9, decimal_places=6)
        longitude = models.DecimalField(max_digits=9, decimal_places=6)
        description = models.TextField(verbose_name="Trail/Area Description")
        date_established = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return self.site_name



   