from rest_framework.decorators import api_view, permission_classes
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import Vehiculo, Servicio, Mantenimiento, Combustible, Operaciones, Repuesto, CustomUser
from .serializers import (
    VehiculoSerializer, 
    ServicioSerializer, 
    MantenimientoSerializer, 
    CombustibleSerializer,
    OperacionSerializer,
    RepuestoSerializer,
    CustomUserSerializer,
)

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

class ServicioViewSet(ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    permission_classes = [IsAuthenticated]


class MantenimientoViewSet(ModelViewSet):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer
    permission_classes = [IsAuthenticated]


class CombustibleViewSet(ModelViewSet):
    queryset = Combustible.objects.all()
    serializer_class = CombustibleSerializer
    permission_classes = [IsAuthenticated]

class OperacionesViewSet(ModelViewSet):
    queryset = Operaciones.objects.all()
    serializer_class = OperacionSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except Exception:
        pass
    return Response(status=status.HTTP_200_OK)