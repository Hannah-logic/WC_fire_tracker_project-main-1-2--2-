from django.shortcuts import render

def home_view(request):
    return render(request, 'home.html') # Render the home.html template

def contact_view(request):
    return render(request, 'contact.html')     # Add this line to render the contact.html template
