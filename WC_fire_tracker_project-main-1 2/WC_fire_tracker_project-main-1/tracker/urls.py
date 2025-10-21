from django.urls import path
from . import views

urlpatterns = [
    path('', views.incident_list, name='incident_list'),    # List view for all incidents
    path('<int:pk>/', views.incident_detail, name='incident_detail'),   # Detail view for a specific incident
]
