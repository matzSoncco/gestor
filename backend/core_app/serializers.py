from rest_framework import serializers
from .models import tarjetaVehiculo, Vehiculo, Servicio, Mantenimiento, Combustible, Operaciones

class TarjetaVehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tarjetaVehiculo
        fields = ['id', 'categoria', 'marca', 'modelo', 'version', 'color', 
                 'anio_fabricacion', 'anio_modelo', 'motor', 'combustible', 
                 'forma_rodante', 'vin', 'serie_chasis', 'ejes', 'ruedas', 
                 'pasajeros', 'carroceria', 'peso_neto', 'peso_bruto', 
                 'carga_util', 'cilindrada', 'cilindros', 'altura', 'ancho', 'longitud']


class OperacionesSerializer(serializers.ModelSerializer):
    tipo_operacion_display = serializers.CharField(source='get_tipo_operacion_display', read_only=True)
    vehiculo_placa = serializers.CharField(source='vehiculo.placa', read_only=True)
    
    class Meta:
        model = Operaciones
        fields = ['id', 'vehiculo', 'vehiculo_placa', 'tipo_operacion', 'tipo_operacion_display',
                 'fecha_operacion', 'costo_total', 'descripcion', 'ubicacion', 'objeto_id']


class ServicioSerializer(serializers.ModelSerializer):
    tipo_servicio_nombre = serializers.CharField(source='get_tipoServicio_display', read_only=True)
    operacion_detalle = OperacionesSerializer(source='operacion', read_only=True)
    vehiculo = serializers.PrimaryKeyRelatedField(queryset=Vehiculo.objects.all(), write_only=True)

    class Meta:
        model = Servicio
        fields = ['id', 'idServicio', 'RUC', 'proveedor', 'tipoServicio', 'tipo_servicio_nombre',
                 'operacion', 'operacion_detalle', 'vehiculo']
    
    def create(self, validated_data):
        vehiculo = validated_data.pop('vehiculo', None)
        servicio = Servicio.objects.create(**validated_data)
        
        # Crear la operación asociada
        if vehiculo:
            operacion = Operaciones.objects.create(
                vehiculo=vehiculo,
                tipo_operacion='SERVICIO',
                descripcion=f"Servicio: {servicio.get_tipoServicio_display()}",
                costo_total=0.0  # Puedes calcular esto según tus necesidades
            )
            servicio.operacion = operacion
            servicio.save()
        
        return servicio


class MantenimientoSerializer(serializers.ModelSerializer):
    tipo_repuesto_nombre = serializers.CharField(source='get_tipoRepuesto_display', read_only=True)
    operacion_detalle = OperacionesSerializer(source='operacion', read_only=True)
    vehiculo = serializers.PrimaryKeyRelatedField(queryset=Vehiculo.objects.all(), write_only=True)
    costoTotal = serializers.FloatField(default=0.0)

    class Meta:
        model = Mantenimiento
        fields = ['id', 'idMantenim', 'costoTotal', 'comentario', 'tipoRepuesto', 
                 'tipo_repuesto_nombre', 'cantidad', 'operacion', 'operacion_detalle', 'vehiculo']
    
    def create(self, validated_data):
        vehiculo = validated_data.pop('vehiculo', None)
        costo_total = validated_data.get('costoTotal', 0.0)
        mantenimiento = Mantenimiento.objects.create(**validated_data)
        
        # Crear la operación asociada
        if vehiculo:
            operacion = Operaciones.objects.create(
                vehiculo=vehiculo,
                tipo_operacion='MANTENIMIENTO',
                costo_total=costo_total,
                descripcion=f"Mantenimiento: {mantenimiento.comentario}"
            )
            mantenimiento.operacion = operacion
            mantenimiento.save()
        
        return mantenimiento


class CombustibleSerializer(serializers.ModelSerializer):
    operacion_detalle = OperacionesSerializer(source='operacion', read_only=True)
    vehiculo = serializers.PrimaryKeyRelatedField(queryset=Vehiculo.objects.all(), write_only=True)
    
    class Meta:
        model = Combustible
        fields = ['id', 'idCombustible', 'cantidadGalon', 'costoGalon', 
                 'costoTotal', 'operacion', 'operacion_detalle', 'vehiculo']
    
    def create(self, validated_data):
        vehiculo = validated_data.pop('vehiculo', None)
        combustible = Combustible.objects.create(**validated_data)
        
        # Crear la operación asociada
        if vehiculo:
            operacion = Operaciones.objects.create(
                vehiculo=vehiculo,
                tipo_operacion='COMBUSTIBLE',
                costo_total=combustible.costoTotal,
                descripcion=f"Combustible: {combustible.cantidadGalon} galones a ${combustible.costoGalon} c/u"
            )
            combustible.operacion = operacion
            combustible.save()
        
        return combustible


class VehiculoSerializer(serializers.ModelSerializer):
    tarjeta_detalle = TarjetaVehiculoSerializer(source='tarjetaVehiculo', read_only=True)
    operaciones_recientes = OperacionesSerializer(source='operaciones', many=True, read_only=True)
    total_operaciones = serializers.SerializerMethodField()
    costo_total_operaciones = serializers.SerializerMethodField()

    class Meta:
        model = Vehiculo
        fields = ['id', 'placa', 'anio', 'tarjetaVehiculo', 'kilometraje', 
                 'costo', 'ubicacion', 'tarjeta_detalle', 'operaciones_recientes',
                 'total_operaciones', 'costo_total_operaciones']
    
    def get_total_operaciones(self, obj):
        return obj.operaciones.count()
    
    def get_costo_total_operaciones(self, obj):
        return sum(op.costo_total for op in obj.operaciones.all())


# Serializer combinado para reportes
class OperacionesDetalladaSerializer(serializers.ModelSerializer):
    vehiculo_detalle = VehiculoSerializer(source='vehiculo', read_only=True)
    servicio_detalle = ServicioSerializer(source='servicio_detalle', read_only=True)
    mantenimiento_detalle = MantenimientoSerializer(source='mantenimiento_detalle', read_only=True)
    combustible_detalle = CombustibleSerializer(source='combustible_detalle', read_only=True)
    tipo_operacion_display = serializers.CharField(source='get_tipo_operacion_display', read_only=True)
    
    class Meta:
        model = Operaciones
        fields = ['id', 'vehiculo', 'vehiculo_detalle', 'tipo_operacion', 'tipo_operacion_display',
                 'fecha_operacion', 'costo_total', 'descripcion', 'ubicacion',
                 'servicio_detalle', 'mantenimiento_detalle', 'combustible_detalle']