from rest_framework.decorators import api_view, permission_classes
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import Vehiculo, Servicio, Mantenimiento, Combustible, Operaciones, Repuesto, CustomUser, Empresa
from .serializers import (
    VehiculoSerializer, 
    ServicioSerializer, 
    MantenimientoSerializer, 
    CombustibleSerializer,
    OperacionSerializer,
    RepuestoSerializer,
    CustomUserSerializer,
    EmpresaSerializer
)
from django.conf import settings
import requests

class CurrentUserView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)
    
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Solo usuarios de la empresa del usuario logueado
        return CustomUser.objects.filter(empresa=self.request.user.empresa)

    def perform_create(self, serializer):
        # Asociar el usuario a la empresa del usuario logueado
        serializer.save(empresa=self.request.user.empresa)

class RepuestoViewSet(viewsets.ModelViewSet):
    serializer_class = RepuestoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Solo repuestos de la empresa del usuario logueado
        return Repuesto.objects.filter(empresa=self.request.user.empresa)

    def perform_create(self, serializer):
        # Asociar el repuesto a la empresa del usuario
        serializer.save(empresa=self.request.user.empresa)

class VehiculoViewSet(ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtrar solo los vehículos de la empresa del usuario
        return Vehiculo.objects.filter(empresa=self.request.user.empresa)

    def perform_create(self, serializer):
        # Asociar automáticamente a la empresa del usuario autenticado
        serializer.save(empresa=self.request.user.empresa)

class EmpresaViewSet(ModelViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
    permission_classes = [IsAuthenticated]

class ServicioViewSet(ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtrar solo los vehículos de la empresa del usuario
        return Servicio.objects.filter(empresa=self.request.user.empresa)

    def perform_create(self, serializer):
        # Asociar automáticamente a la empresa del usuario autenticado
        serializer.save(empresa=self.request.user.empresa)

class MantenimientoViewSet(ModelViewSet):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtrar solo los vehículos de la empresa del usuario
        return Mantenimiento.objects.filter(empresa=self.request.user.empresa)

    def perform_create(self, serializer):
        # Asociar automáticamente a la empresa del usuario autenticado
        serializer.save(empresa=self.request.user.empresa)

class CombustibleViewSet(ModelViewSet):
    queryset = Combustible.objects.all()
    serializer_class = CombustibleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtrar solo los vehículos de la empresa del usuario
        return Combustible.objects.filter(empresa=self.request.user.empresa)

    def perform_create(self, serializer):
        # Asociar automáticamente a la empresa del usuario autenticado
        serializer.save(empresa=self.request.user.empresa)

class OperacionesViewSet(ModelViewSet):
    queryset = Operaciones.objects.all()
    serializer_class = OperacionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Filtrar solo los vehículos de la empresa del usuario
        return Operaciones.objects.filter(empresa=self.request.user.empresa)

    def perform_create(self, serializer):
        # Asociar automáticamente a la empresa del usuario autenticado
        serializer.save(empresa=self.request.user.empresa)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except Exception:
        pass
    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def consultar_ruc(request, ruc):
    if len(ruc) != 11 or not ruc.isdigit():
        #return Response({"error": "RUC inválido"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": f"RUC inválido: {ruc}"}, status=400)
    
    token = settings.API_NET_PE_TOKEN
    url = f"https://api.apis.net.pe/v2/sunat/ruc?numero={ruc}" 
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }

    try:
        response = requests.get(url, headers=headers)
        data = response.json()

        if "razonSocial" in data:
            return Response({"nombre": data["razonSocial"]})
        else:
            return Response({"error": "No se encontró razón social"}, status=status.HTTP_404_NOT_FOUND)

    except requests.RequestException as e:
        return Response({"error": "Error al consultar RUC"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
