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
router.register(r'empresas', views.EmpresaViewSet, basename='empresas')

urlpatterns = [
    # REST API routes principales
    path('', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.logout_view, name='logout'),
    path('user/me/', views.CurrentUserView.as_view(), name='current-user'),
    path('ruc/<str:ruc>/', views.consultar_ruc, name='consultar_ruc'),
    path('adminmayor/crear-usuario/', views.crear_usuario_con_clave),
]