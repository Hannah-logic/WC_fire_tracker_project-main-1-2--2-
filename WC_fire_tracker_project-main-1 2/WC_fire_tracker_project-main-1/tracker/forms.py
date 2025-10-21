from django import forms
from feedback.models import UserFeedback

class CommentForm(forms.ModelForm):
    class Meta:
        model = UserFeedback
        fields = '__all__'
        