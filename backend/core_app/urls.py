from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router principal
router = DefaultRouter()
router.register(r'tarjetas', views.TarjetaVehiculoViewSet)
router.register(r'vehiculos', views.VehiculoViewSet)

# Router para operaciones
operaciones_router = DefaultRouter()
operaciones_router.register(r'', views.OperacionesViewSet, basename='operaciones')  # /api/operaciones/
operaciones_router.register(r'servicios', views.ServicioViewSet, basename='operaciones-servicios')  # /api/operaciones/servicios/
operaciones_router.register(r'mantenimientos', views.MantenimientoViewSet, basename='operaciones-mantenimientos')  # /api/operaciones/mantenimientos/
operaciones_router.register(r'combustibles', views.CombustibleViewSet, basename='operaciones-combustibles')  # /api/operaciones/combustibles/

urlpatterns = [
    # REST API routes principales
    path('', include(router.urls)),
    
    # Rutas de operaciones jerárquicas
    path('operaciones/', include(operaciones_router.urls)),
    
    # Endpoints específicos existentes
    path('form-submit/', views.form_submit, name='form_submit'),
    path('csv-upload/', views.csv_upload, name='csv_upload'),
    path('report-generate/', views.report_generate, name='report_generate'),
    
    # Endpoints adicionales para operaciones
    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),
    path('operacion-masiva/', views.operacion_masiva, name='operacion_masiva'),
]