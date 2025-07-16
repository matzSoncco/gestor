from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.db.models import Sum, Count, Q
import pandas as pd
import csv
import io
from django.http import HttpResponse
from datetime import datetime, timedelta
from .models import Vehiculo, Servicio, Mantenimiento, Combustible, Operaciones, Repuesto
from .serializers import (
    VehiculoSerializer, 
    ServicioSerializer, 
    MantenimientoSerializer, 
    CombustibleSerializer,
    OperacionSerializer,
    RepuestoSerializer
)

class RepuestoViewSet(viewsets.ModelViewSet):
    serializer_class = RepuestoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo repuestos de la empresa del usuario logueado
        return Repuesto.objects.filter(empresa=self.request.user.empresa)

    def perform_create(self, serializer):
        # Asociar el repuesto a la empresa del usuario
        serializer.save(empresa=self.request.user.empresa)

class VehiculoViewSet(ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
    permission_classes = [AllowAny]

class ServicioViewSet(ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    permission_classes = [AllowAny]


class MantenimientoViewSet(ModelViewSet):
    queryset = Mantenimiento.objects.all()
    serializer_class = MantenimientoSerializer
    permission_classes = [AllowAny]


class CombustibleViewSet(ModelViewSet):
    queryset = Combustible.objects.all()
    serializer_class = CombustibleSerializer
    permission_classes = [AllowAny]

class OperacionesViewSet(ModelViewSet):
    queryset = Operaciones.objects.all()
    serializer_class = OperacionSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)