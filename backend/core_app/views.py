from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Sum, Count, Q
import pandas as pd
import csv
import io
from django.http import HttpResponse
from datetime import datetime, timedelta
from .models import tarjetaVehiculo, Vehiculo, Servicio, Mantenimiento, Combustible, Operaciones
from .serializers import (
    TarjetaVehiculoSerializer, 
    VehiculoSerializer, 
    ServicioSerializer, 
    MantenimientoSerializer, 
    CombustibleSerializer,
    OperacionesSerializer,
    OperacionesDetalladaSerializer
)

# ViewSets existentes
class TarjetaVehiculoViewSet(ModelViewSet):
    queryset = tarjetaVehiculo.objects.all()
    serializer_class = TarjetaVehiculoSerializer
    permission_classes = [IsAuthenticated]


class VehiculoViewSet(ModelViewSet):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Permite filtrar vehículos por placa o ubicación"""
        queryset = Vehiculo.objects.all()
        placa = self.request.query_params.get('placa')
        ubicacion = self.request.query_params.get('ubicacion')
        
        if placa:
            queryset = queryset.filter(placa__icontains=placa)
        if ubicacion:
            queryset = queryset.filter(ubicacion__icontains=ubicacion)
            
        return queryset
    
    @action(detail=True, methods=['get'])
    def operaciones(self, request, pk=None):
        """Obtener todas las operaciones de un vehículo específico"""
        vehiculo = self.get_object()
        operaciones = vehiculo.operaciones.all()
        
        # Filtros opcionales
        tipo = request.query_params.get('tipo')
        fecha_desde = request.query_params.get('fecha_desde')
        fecha_hasta = request.query_params.get('fecha_hasta')
        
        if tipo:
            operaciones = operaciones.filter(tipo_operacion=tipo.upper())
        
        if fecha_desde:
            try:
                fecha_desde = datetime.strptime(fecha_desde, '%Y-%m-%d')
                operaciones = operaciones.filter(fecha_operacion__gte=fecha_desde)
            except ValueError:
                pass
        
        if fecha_hasta:
            try:
                fecha_hasta = datetime.strptime(fecha_hasta, '%Y-%m-%d')
                operaciones = operaciones.filter(fecha_operacion__lte=fecha_hasta)
            except ValueError:
                pass
        
        serializer = OperacionesDetalladaSerializer(operaciones, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def resumen_operaciones(self, request, pk=None):
        """Obtener resumen estadístico de operaciones del vehículo"""
        vehiculo = self.get_object()
        
        # Resumen por tipo de operación
        resumen = vehiculo.operaciones.values('tipo_operacion').annotate(
            total_operaciones=Count('id'),
            costo_total=Sum('costo_total')
        )
        
        # Operaciones del último mes
        ultimo_mes = datetime.now() - timedelta(days=30)
        operaciones_recientes = vehiculo.operaciones.filter(
            fecha_operacion__gte=ultimo_mes
        ).count()
        
        # Costo total histórico
        costo_total_historico = vehiculo.operaciones.aggregate(
            total=Sum('costo_total')
        )['total'] or 0
        
        return Response({
            'vehiculo': vehiculo.placa,
            'resumen_por_tipo': list(resumen),
            'operaciones_ultimo_mes': operaciones_recientes,
            'costo_total_historico': costo_total_historico,
            'total_operaciones': vehiculo.operaciones.count()
        })


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


# Nuevo ViewSet para Operaciones
class OperacionesViewSet(ModelViewSet):
    queryset = Operaciones.objects.all()
    serializer_class = OperacionesSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filtrar operaciones por varios criterios"""
        queryset = Operaciones.objects.all()
        
        # Filtro por vehículo
        vehiculo_id = self.request.query_params.get('vehiculo')
        if vehiculo_id:
            queryset = queryset.filter(vehiculo_id=vehiculo_id)
        
        # Filtro por tipo de operación
        tipo = self.request.query_params.get('tipo')
        if tipo:
            queryset = queryset.filter(tipo_operacion=tipo.upper())
        
        # Filtro por rango de fechas
        fecha_desde = self.request.query_params.get('fecha_desde')
        fecha_hasta = self.request.query_params.get('fecha_hasta')
        
        if fecha_desde:
            try:
                fecha_desde = datetime.strptime(fecha_desde, '%Y-%m-%d')
                queryset = queryset.filter(fecha_operacion__gte=fecha_desde)
            except ValueError:
                pass
        
        if fecha_hasta:
            try:
                fecha_hasta = datetime.strptime(fecha_hasta, '%Y-%m-%d')
                queryset = queryset.filter(fecha_operacion__lte=fecha_hasta)
            except ValueError:
                pass
        
        # Filtro por rango de costos
        costo_min = self.request.query_params.get('costo_min')
        costo_max = self.request.query_params.get('costo_max')
        
        if costo_min:
            try:
                queryset = queryset.filter(costo_total__gte=float(costo_min))
            except ValueError:
                pass
        
        if costo_max:
            try:
                queryset = queryset.filter(costo_total__lte=float(costo_max))
            except ValueError:
                pass
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def resumen_general(self, request):
        """Resumen general de todas las operaciones"""
        total_operaciones = Operaciones.objects.count()
        
        # Resumen por tipo
        por_tipo = Operaciones.objects.values('tipo_operacion').annotate(
            cantidad=Count('id'),
            costo_total=Sum('costo_total')
        )
        
        # Operaciones por mes (últimos 6 meses)
        seis_meses_atras = datetime.now() - timedelta(days=180)
        por_mes = Operaciones.objects.filter(
            fecha_operacion__gte=seis_meses_atras
        ).extra(
            select={'mes': "strftime('%%Y-%%m', fecha_operacion)"}
        ).values('mes').annotate(
            cantidad=Count('id'),
            costo_total=Sum('costo_total')
        ).order_by('mes')
        
        # Costo total
        costo_total = Operaciones.objects.aggregate(
            total=Sum('costo_total')
        )['total'] or 0
        
        # Top 5 vehículos con más operaciones
        top_vehiculos = Operaciones.objects.values(
            'vehiculo__placa'
        ).annotate(
            cantidad_operaciones=Count('id'),
            costo_total=Sum('costo_total')
        ).order_by('-cantidad_operaciones')[:5]
        
        return Response({
            'total_operaciones': total_operaciones,
            'costo_total_general': costo_total,
            'resumen_por_tipo': list(por_tipo),
            'resumen_por_mes': list(por_mes),
            'top_vehiculos': list(top_vehiculos)
        })
    
    @action(detail=False, methods=['get'])
    def detalladas(self, request):
        """Obtener operaciones con todos sus detalles"""
        queryset = self.get_queryset()
        serializer = OperacionesDetalladaSerializer(queryset, many=True)
        return Response(serializer.data)


# Endpoints adicionales
@api_view(['POST'])
@permission_classes([IsAuthenticated])
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def csv_upload(request):
    """Endpoint para recibir y procesar archivos CSV"""
    if 'file' not in request.FILES:
        return Response({"detail": "No se envió ningún archivo"}, status=status.HTTP_400_BAD_REQUEST)
    
    csv_file = request.FILES['file']
    
    # Validar que sea un archivo CSV
    if not csv_file.name.endswith('.csv'):
        return Response({"detail": "El archivo debe ser CSV"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Procesar el archivo CSV
    try:
        # Leer el archivo como DataFrame de pandas
        data = pd.read_csv(csv_file)
        
        # Aquí puedes procesar los datos según tus necesidades
        # Por ejemplo, guardarlos en la base de datos
        
        # Retornar un resumen del procesamiento
        return Response({
            "message": "Archivo CSV procesado correctamente",
            "rows_processed": len(data),
            "columns": list(data.columns)
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({"detail": f"Error al procesar el archivo: {str(e)}"}, 
                      status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def report_generate(request):
    """Endpoint para generar reportes en diferentes formatos"""
    format_type = request.query_params.get('format', 'excel')
    reporte_tipo = request.query_params.get('tipo', 'operaciones')
    
    if reporte_tipo == 'operaciones':
        # Obtener datos de operaciones
        operaciones = Operaciones.objects.select_related('vehiculo').all()
        
        data = []
        for op in operaciones:
            data.append({
                'ID': op.id,
                'Vehículo': op.vehiculo.placa,
                'Tipo Operación': op.get_tipo_operacion_display(),
                'Fecha': op.fecha_operacion.strftime('%Y-%m-%d %H:%M'),
                'Costo Total': op.costo_total,
                'Descripción': op.descripcion or '',
                'Ubicación': op.ubicacion or ''
            })
    
    elif reporte_tipo == 'vehiculos':
        # Obtener datos de vehículos con resumen de operaciones
        vehiculos = Vehiculo.objects.all()
        
        data = []
        for v in vehiculos:
            total_ops = v.operaciones.count()
            costo_total = v.operaciones.aggregate(Sum('costo_total'))['costo_total__sum'] or 0
            
            data.append({
                'Placa': v.placa,
                'Año': v.anio,
                'Marca': v.tarjetaVehiculo.marca,
                'Modelo': v.tarjetaVehiculo.modelo,
                'Kilometraje': v.kilometraje,
                'Ubicación': v.ubicacion,
                'Total Operaciones': total_ops,
                'Costo Total Operaciones': costo_total
            })
    
    else:
        return Response({"detail": f"Tipo de reporte '{reporte_tipo}' no soportado"}, 
                      status=status.HTTP_400_BAD_REQUEST)
    
    df = pd.DataFrame(data)
    
    # Generar reporte según formato solicitado
    if format_type == 'excel':
        # Crear un buffer en memoria
        output = io.BytesIO()
        
        # Escribir el DataFrame al buffer como Excel
        df.to_excel(output, index=False, engine='openpyxl')
        
        # Preparar la respuesta
        output.seek(0)
        response = HttpResponse(
            output.read(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename=reporte_{reporte_tipo}.xlsx'
        return response
        
    elif format_type == 'pdf':
        # Para PDF necesitarías bibliotecas adicionales como ReportLab o WeasyPrint
        import tempfile
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter, A4
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.lib import colors
        
        # Crear un buffer en memoria
        buffer = io.BytesIO()
        
        # Crear el PDF con mejor formato
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        elements = []
        
        # Estilos
        styles = getSampleStyleSheet()
        title_style = styles['Title']
        
        # Título
        title = Paragraph(f"Reporte de {reporte_tipo.title()}", title_style)
        elements.append(title)
        
        # Crear tabla con los datos
        if not df.empty:
            # Preparar datos para la tabla
            table_data = [df.columns.tolist()]  # Headers
            for _, row in df.iterrows():
                table_data.append(row.tolist())
            
            # Crear tabla
            table = Table(table_data)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('FONTSIZE', (0, 1), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            elements.append(table)
        else:
            no_data = Paragraph("No hay datos disponibles", styles['Normal'])
            elements.append(no_data)
        
        # Construir PDF
        doc.build(elements)
        
        # Devolver el PDF
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename=reporte_{reporte_tipo}.pdf'
        return response
        
    elif format_type == 'csv':
        # Generar CSV
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename=reporte_{reporte_tipo}.csv'
        
        df.to_csv(path_or_buf=response, index=False)
        return response
        
    else:
        return Response({"detail": f"Formato '{format_type}' no soportado"}, 
                      status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
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