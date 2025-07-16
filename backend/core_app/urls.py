from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router principal
router = DefaultRouter()
router.register(r'vehiculos', views.VehiculoViewSet, basename='vehiculos')  # /api/vehiculos/
router.register(r'operaciones', views.OperacionesViewSet, basename='operaciones')  # /api/operaciones/
router.register(r'repuestos', views.RepuestoViewSet, basename='repuestos')  # /api/repuestos/

urlpatterns = [
    # REST API routes principales
    path('', include(router.urls)),
]