from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import Vehiculo, Servicio, Mantenimiento, Combustible, Operaciones, Repuesto, CustomUser, Empresa, MantenimientoHito
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

    @action(detail=True, methods=['POST'], url_path='registrar_mantenimiento_hito')
    def registrar_mantenimiento_hito(self, request, pk=None):
        vehiculo = self.get_object()
        empresa = request.user.empresa
        hito = vehiculo.siguiente_hito_mantenimiento

        if vehiculo.mantenimientos_hito.filter(kilometraje=hito).exists():
            return Response(
                {"detail": f"Ya se registró el mantenimiento para {hito} km"},
                status=status.HTTP_400_BAD_REQUEST
            )

        MantenimientoHito.objects.create(
            vehiculo=vehiculo,
            empresa=empresa,
            kilometraje=hito,
            observaciones=request.data.get('observaciones', '')
        )

        vehiculo.refresh_from_db()  # para asegurarte que refleje el cambio
        serializer = self.get_serializer(vehiculo)

        return Response(
            {
                "detail": f"Mantenimiento registrado para {hito} km",
                "vehiculo": serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['PATCH'], url_path='actualizar_kilometraje')
    def actualizar_kilometraje(self, request, pk=None):
        vehiculo = self.get_object()
        nuevo_kilometraje = request.data.get('kilometraje')

        if nuevo_kilometraje is None:
            return Response(
                {"detail": "Debe proporcionar el nuevo kilometraje"},
                status=status.HTTP_400_BAD_REQUEST
            )

        vehiculo.kilometraje = nuevo_kilometraje
        vehiculo.save()

        serializer = self.get_serializer(vehiculo)
        return Response({"vehiculo": serializer.data}, status=status.HTTP_200_OK)

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
        empresa = self.request.user.empresa
        queryset = Operaciones.objects.filter(empresa=empresa)

        numero_documento = self.request.query_params.get('numero_documento')
        if numero_documento:
            queryset = queryset.filter(numero_documento__icontains=numero_documento)

        fecha_inicio = self.request.query_params.get('fecha_inicio')
        if fecha_inicio:
            queryset = queryset.filter(fecha__gte=fecha_inicio)

        fecha_fin = self.request.query_params.get('fecha_fin')
        if fecha_fin:
            queryset = queryset.filter(fecha__lte=fecha_fin)

        return queryset.order_by('-fecha')

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
