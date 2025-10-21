from django.shortcuts import render, redirect   # for redirecting after form submission
from .forms import FeedbackForm
from django.contrib import messages
from feedback.models import Feedback


def feedback_view(request):
    """View to handle feedback form submission."""

    if request.method == 'POST':
        form = FeedbackForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()                   
            messages.success(request, "Thanks — your feedback was submitted.")
            return redirect('feedback:feedback')  # will define URL name in urls.py
    else:
        form = FeedbackForm()
    carousel = Feedback.objects.all().order_by('-id')[:4] 
    
    return render(request, 'feedback/form.html', {'form': form, 'carousel': carousel})



def display_feedback(request):
    # Public view - only show approved feedback
    approved_feedbacks = Feedback.objects.filter(is_approved=True)
    
    # Calculate average rating
    if approved_feedbacks:
        avg_rating = sum(f.rating for f in approved_feedbacks) / approved_feedbacks.count()
    else:
        avg_rating = 0
    
    return render(request, 'feedback/display_feedback.html', {
        'feedbacks': approved_feedbacks,
        'avg_rating': round(avg_rating, 1),
        'total_feedbacks': approved_feedbacks.count(),
    })
