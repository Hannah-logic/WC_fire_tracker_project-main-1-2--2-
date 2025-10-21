from django.contrib import admin
from .models import Feedback, UserFeedback # <-- Import UserFeedback

# 1. Registration for the General Contact Form Model
@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name','email','submitted_at')
    search_fields = ('name','email','message') 

# 2. Registration for the Site-Specific User Report Model
@admin.register(UserFeedback)
class UserFeedbackAdmin(admin.ModelAdmin):
    # Display key fields for quick review
    list_display = ('site', 'user_name', 'regeneration_status', 'date_posted')
    # Allow filtering by regeneration status
    list_filter = ('regeneration_status', 'date_posted')
    # Allow searching by user or comment
    search_fields = ('user_name', 'comment')