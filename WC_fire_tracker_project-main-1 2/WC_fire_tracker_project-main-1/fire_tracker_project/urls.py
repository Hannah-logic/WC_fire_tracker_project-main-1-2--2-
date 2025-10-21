from django.contrib import admin # type: ignore
from django.urls import path, include # type: ignore
from django.conf import settings # type: ignore
from django.conf.urls.static import static # type: ignore

from tracker import views as tracker_views 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),           # home & contact at root
    path('tracker/', include('tracker.urls')), # listing + detail
    path('feedback/', include('feedback.urls')), # feedback form
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
