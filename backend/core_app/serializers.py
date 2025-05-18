from rest_framework import serializers
from .models import tarjetaVehiculo, Vehiculo, Servicio, Mantenimiento, Combustible

class TarjetaVehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tarjetaVehiculo
        fields = ['id', 'categoria', 'marca', 'modelo', 'version', 'color', 
                 'anio_fabricacion', 'anio_modelo', 'motor', 'combustible', 
                 'forma_rodante', 'vin', 'serie_chasis', 'ejes', 'ruedas', 
                 'pasajeros', 'carroceria', 'peso_neto', 'peso_bruto', 
                 'carga_util', 'cilindrada', 'cilindros', 'altura', 'ancho', 'longitud']

class VehiculoSerializer(serializers.ModelSerializer):
    tarjeta_detalle = TarjetaVehiculoSerializer(source='tarjetaVehiculo', read_only=True)

    class Meta:
        model = Vehiculo
        fields = ['id', 'placa', 'anio', 'tarjetaVehiculo', 'kilometraje', 
                 'costo', 'ubicacion', 'tarjeta_detalle']
        depth = 1 

class ServicioSerializer(serializers.ModelSerializer):
    tipo_servicio_nombre = serializers.CharField(source='get_tipoServicio_display', read_only=True)

    class Meta:
        model = Servicio
        fields = ['id', 'idServicio', 'RUC', 'proveedor', 'tipoServicio', 'tipo_servicio_nombre']

class MantenimientoSerializer(serializers.ModelSerializer):
    tipo_repuesto_nombre = serializers.CharField(source='get_tipoRepuesto_display', read_only=True)

    class Meta:
        model = Mantenimiento
        fields = ['id', 'idMantenim', 'costoTotal', 'comentario', 'tipoRepuesto', 
                 'tipo_repuesto_nombre', 'cantidad']

class CombustibleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Combustible
        fields = ['id', 'idCombustible', 'cantidadGalon', 'costoGalon', 
                 'costoTotal', 'ubicacion']