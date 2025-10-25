from django.shortcuts import render, get_object_or_404 , redirect  
from .models import FireIncident, RegenerationSite
from feedback.models import UserFeedback 
from .forms import CommentForm

def incident_list(request):
    """View to list all fire incidents, ordered by Regeneration Sites"""
    sites = RegenerationSite.objects.select_related('associated_fire').order_by('-date_established')
    
    context = {
        'sites': sites, 
        'page_title': 'Tracked Regeneration Sites',
    }
    return render(request, 'tracker/list.html', context) 

def incident_detail(request, pk):   
    """View to display details of a specific Regeneration Site."""
    site = get_object_or_404(RegenerationSite, pk=pk)
    site_feedback = site.user_reports.all().order_by('-date_posted') 

    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comments = form.save(commit=False)
            comments.site = site
            comments.save()

            return redirect( 'incident_detail',pk=pk)
    else:
        form = CommentForm()

    
    context = {
        'site': site,
        'site_feedback': site_feedback,
        'page_title': site.site_name,
        'form': form
    }
    return render(request, 'tracker/detail.html', context) 





    return render(request, 'detail.html',{'post':post, 'form':form, 'comments':comments })

