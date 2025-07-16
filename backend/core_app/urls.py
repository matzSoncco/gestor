from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router principal
router = DefaultRouter()
router.register(r'vehiculos', views.VehiculoViewSet)
router.register(r'operaciones', views.OperacionesViewSet, basename='operaciones')  # /api/operaciones/

urlpatterns = [
    # REST API routes principales
    path('', include(router.urls)),
    
    # Endpoints específicos existentes
    path('form-submit/', views.form_submit, name='form_submit'),
    
    # Endpoints adicionales para operaciones
    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),
    path('operacion-masiva/', views.operacion_masiva, name='operacion_masiva'),
]