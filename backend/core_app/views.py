from rest_framework.decorators import api_view, permission_classes
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import pandas as pd
import csv
import io
from django.http import HttpResponse
from .models import tarjetaVehiculo, Vehiculo, Servicio, Mantenimiento, Combustible
from .serializers import (
    TarjetaVehiculoSerializer, 
    VehiculoSerializer, 
    ServicioSerializer, 
    MantenimientoSerializer, 
    CombustibleSerializer
)

#rest - api
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
    
    # Aquí generarías los datos del reporte desde tu base de datos
    # Por ejemplo:
    # data = TuModelo.objects.all().values()
    
    # Para este ejemplo, crearemos datos de muestra
    data = [
        {"id": 1, "nombre": "Producto 1", "cantidad": 100, "fecha": "2023-05-01"},
        {"id": 2, "nombre": "Producto 2", "cantidad": 200, "fecha": "2023-05-15"},
        {"id": 3, "nombre": "Producto 3", "cantidad": 150, "fecha": "2023-05-22"},
    ]
    
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
        response['Content-Disposition'] = 'attachment; filename=reporte.xlsx'
        return response
        
    elif format_type == 'pdf':
        # Para PDF necesitarías bibliotecas adicionales como ReportLab o WeasyPrint
        # Por ahora simulamos un archivo PDF muy simple
        
        import tempfile
        from reportlab.pdfgen import canvas
        
        # Crear un buffer en memoria
        buffer = io.BytesIO()
        
        # Crear el PDF
        p = canvas.Canvas(buffer)
        p.drawString(100, 800, "Reporte de Datos")
        p.drawString(100, 780, "Fecha: 2023-05-30")
        
        y = 750
        for item in data:
            y -= 20
            p.drawString(100, y, f"{item['id']} - {item['nombre']} - {item['cantidad']} - {item['fecha']}")
        
        p.showPage()
        p.save()
        
        # Devolver el PDF
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename=reporte.pdf'
        return response
        
    else:
        return Response({"detail": f"Formato '{format_type}' no soportado"}, 
                      status=status.HTTP_400_BAD_REQUEST)


