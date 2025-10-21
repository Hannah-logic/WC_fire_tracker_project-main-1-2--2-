# tracker/admin.py
from django.contrib import admin
from .models import FireIncident, RegenerationSite  # <--- IMPORT RegenerationSite


# 1. Registration for Fire Incidents (Your Existing Code)
@admin.register(FireIncident)
class FireIncidentAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'date', 'status', 'created_at')
    list_filter = ('status', 'date')
    search_fields = ('title', 'location', 'description')

# 2. Registration for Regeneration Sites (NEW CODE)
@admin.register(RegenerationSite)
class RegenerationSiteAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'associated_fire', 'latitude', 'longitude')
    list_filter = ('associated_fire',) 
    search_fields = ('site_name', 'description')
