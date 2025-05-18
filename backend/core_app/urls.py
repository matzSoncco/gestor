from django.urls import path
from . import views # Importarás tus vistas aquí
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# urlpatterns = [
#     path('ruta-ejemplo/', views.MiVista.as_view(), name='mi-vista'),
# ]
# Se completa más adelante
urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]