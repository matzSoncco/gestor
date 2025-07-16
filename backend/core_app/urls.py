from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

# Router principal
router = DefaultRouter()
router.register(r'vehiculos', views.VehiculoViewSet, basename='vehiculos')  # /api/vehiculos/
router.register(r'operaciones', views.OperacionesViewSet, basename='operaciones')  # /api/operaciones/
router.register(r'repuestos', views.RepuestoViewSet, basename='repuestos')  # /api/repuestos/

urlpatterns = [
    # REST API routes principales
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
    path('logout/', views.logout_view, name='logout'),
]