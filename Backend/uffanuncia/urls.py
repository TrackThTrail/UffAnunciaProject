# urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.shortcuts import render


def serve_react(request):
    return render(request, 'index.html')

urlpatterns = [
    path('', serve_react),
    path('admin/', admin.site.urls),
    path('api/', include('uffanunciaapp.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
