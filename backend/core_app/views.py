from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.db.models import Sum, Count, Q
import pandas as pd
import csv
import io
from django.http import HttpResponse
from datetime import datetime, timedelta
from .models import Vehiculo, Servicio, Mantenimiento, Combustible, Operaciones
from .serializers import (
    VehiculoSerializer, 
    ServicioSerializer, 
    MantenimientoSerializer, 
    CombustibleSerializer,
    OperacionSerializer
)

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


# Endpoints adicionales
@api_view(['POST'])
@permission_classes([AllowAny])
def form_submit(request):
    """Endpoint para recibir datos del formulario"""
    data = request.data
    
    # Aquí procesarías los datos, los validarías y los guardarías en el modelo
    # Por ejemplo:
    # form = TuFormulario(data=data)
    # if form.is_valid():
    #     form.save()
    
    return Response({
        "message": "Datos recibidos correctamente",
        "data": data
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    """Endpoint para obtener estadísticas del dashboard"""
    
    # Estadísticas generales
    total_vehiculos = Vehiculo.objects.count()
    total_operaciones = Operaciones.objects.count()
    
    # Operaciones del mes actual
    now = datetime.now()
    inicio_mes = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    operaciones_mes = Operaciones.objects.filter(fecha_operacion__gte=inicio_mes).count()
    
    # Costo total del mes
    costo_mes = Operaciones.objects.filter(
        fecha_operacion__gte=inicio_mes
    ).aggregate(Sum('costo_total'))['costo_total__sum'] or 0
    
    # Distribución por tipo de operación (mes actual)
    distribucion_tipo = Operaciones.objects.filter(
        fecha_operacion__gte=inicio_mes
    ).values('tipo_operacion').annotate(
        cantidad=Count('id'),
        costo=Sum('costo_total')
    )
    
    # Últimas 5 operaciones
    ultimas_operaciones = Operaciones.objects.select_related('vehiculo').order_by(
        '-fecha_operacion'
    )[:5]
    
    ultimas_ops_data = []
    for op in ultimas_operaciones:
        ultimas_ops_data.append({
            'id': op.id,
            'vehiculo': op.vehiculo.placa,
            'tipo': op.get_tipo_operacion_display(),
            'fecha': op.fecha_operacion,
            'costo': op.costo_total,
            'descripcion': op.descripcion
        })
    
    # Vehículos con más operaciones (top 5)
    top_vehiculos = Operaciones.objects.values(
        'vehiculo__placa', 'vehiculo__id'
    ).annotate(
        total_operaciones=Count('id'),
        costo_total=Sum('costo_total')
    ).order_by('-total_operaciones')[:5]
    
    # Tendencia de costos por mes (últimos 6 meses)
    seis_meses_atras = now - timedelta(days=180)
    tendencia_costos = Operaciones.objects.filter(
        fecha_operacion__gte=seis_meses_atras
    ).extra(
        select={'mes': "strftime('%%Y-%%m', fecha_operacion)"}
    ).values('mes').annotate(
        costo_total=Sum('costo_total'),
        cantidad=Count('id')
    ).order_by('mes')
    
    return Response({
        'resumen': {
            'total_vehiculos': total_vehiculos,
            'total_operaciones': total_operaciones,
            'operaciones_mes_actual': operaciones_mes,
            'costo_mes_actual': costo_mes
        },
        'distribucion_por_tipo': list(distribucion_tipo),
        'ultimas_operaciones': ultimas_ops_data,
        'top_vehiculos': list(top_vehiculos),
        'tendencia_costos': list(tendencia_costos)
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def operacion_masiva(request):
    """Endpoint para crear múltiples operaciones de una vez"""
    operaciones_data = request.data.get('operaciones', [])
    
    if not operaciones_data:
        return Response(
            {"detail": "No se proporcionaron datos de operaciones"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    operaciones_creadas = []
    errores = []
    
    for i, op_data in enumerate(operaciones_data):
        try:
            # Validar datos mínimos requeridos
            if 'vehiculo_id' not in op_data or 'tipo_operacion' not in op_data:
                errores.append(f"Operación {i+1}: Faltan datos requeridos (vehiculo_id, tipo_operacion)")
                continue
            
            # Crear la operación
            operacion = Operaciones.objects.create(
                vehiculo_id=op_data['vehiculo_id'],
                tipo_operacion=op_data['tipo_operacion'].upper(),
                costo_total=op_data.get('costo_total', 0.0),
                descripcion=op_data.get('descripcion', ''),
                ubicacion=op_data.get('ubicacion', '')
            )
            
            operaciones_creadas.append({
                'id': operacion.id,
                'vehiculo': operacion.vehiculo.placa,
                'tipo': operacion.get_tipo_operacion_display()
            })
            
        except Exception as e:
            errores.append(f"Operación {i+1}: Error al crear - {str(e)}")
    
    return Response({
        'operaciones_creadas': len(operaciones_creadas),
        'operaciones_exitosas': operaciones_creadas,
        'errores': errores
    }, status=status.HTTP_201_CREATED if operaciones_creadas else status.HTTP_400_BAD_REQUEST)