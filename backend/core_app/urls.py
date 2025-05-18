from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tarjetas', views.TarjetaVehiculoViewSet)
router.register(r'vehiculos', views.VehiculoViewSet)
router.register(r'servicios', views.ServicioViewSet)
router.register(r'mantenimientos', views.MantenimientoViewSet)
router.register(r'combustibles', views.CombustibleViewSet)

urlpatterns = [
    #rest
    path('', include(router.urls)),
    
    path('form-submit/', views.form_submit, name='form_submit'),
    path('csv-upload/', views.csv_upload, name='csv_upload'),
    path('report-generate/', views.report_generate, name='report_generate'),
]