from rest_framework import serializers
from .models import (
    tarjetaVehiculo,
    Vehiculo,
    Operaciones,
    Servicio,
    Mantenimiento,
    Combustible
)

# ---------------------------------------------------
# 1) Serializer para tarjetaVehiculo
# ---------------------------------------------------
class TarjetaVehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tarjetaVehiculo
        fields = [
            'id', 'categoria', 'marca', 'modelo', 'version', 'color',
            'anio_fabricacion', 'anio_modelo', 'motor', 'combustible',
            'forma_rodante', 'vin', 'serie_chasis', 'ejes', 'ruedas',
            'pasajeros', 'carroceria', 'peso_neto', 'peso_bruto',
            'carga_util', 'cilindrada', 'cilindros', 'altura', 'ancho', 'longitud'
        ]

# ------------------------
# 3) Serializer para Servicio
# ---------------------------
class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = ['descripcion', 'costoServicio']

# ---------------------------------
# 4) Serializer para Mantenimiento
# ---------------------------------
class MantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mantenimiento
        fields = ['descripcionItem', 'cantidad', 'costoUnitario', 'subTotal']
        #read_only_fields = ['subTotal']

# -----------------------------------
# 5) Serializer para Combustible
# -----------------------------------
class CombustibleSerializer(serializers.ModelSerializer):
    placaVehiculo = serializers.SlugRelatedField(read_only=True, slug_field='placa')
    class Meta:
        model = Combustible
        fields = ['cantidadGalones', 'costoPorGalon', 'placaVehiculo', 'subTotal']
        #read_only_fields = ['subTotal']

# ---------------------------------------------------
# 2) Serializer para Operaciones (ENDPOINT: /api/operaciones/)
# ---------------------------------------------------
class OperacionesSerializer(serializers.ModelSerializer):
    combustibles = CombustibleSerializer(many=True, required=False)
    mantenimientos = MantenimientoSerializer(many=True, required=False)
    servicios = ServicioSerializer(many=True, required=False)

    class Meta:
        model = Operaciones
        fields = [
            'id',
            'numeroDocumento',
            'rucProveedor',
            'nombreProveedor',
            'tipoOperacion',
            'fecha',
            'descripcion',
            'combustibles',
            'mantenimientos',
            'servicios',
        ]
        #read_only_fields = ['id']

    def create(self, validated_data):
        # 1. Extraemos los datos anidados del diccionario validado
        combustibles_data = validated_data.pop('combustibles', [])
        mantenimientos_data = validated_data.pop('mantenimientos', [])
        servicios_data = validated_data.pop('servicios', [])

        operacion = Operaciones.objects.create(**validated_data)

        for combustible_data in combustibles_data:
            Combustible.objects.create(operacion=operacion, **combustible_data)

        for mantenimiento_data in mantenimientos_data:
            Mantenimiento.objects.create(operacion=operacion, **mantenimiento_data)

        for servicio_data in servicios_data:
            Servicio.objects.create(operacion=operacion, **servicio_data)

        return operacion

# ---------------------------------------------------
# 6) Serializer para Vehiculo
# ---------------------------------------------------
class VehiculoSerializer(serializers.ModelSerializer):
    tarjetaVehiculo = TarjetaVehiculoSerializer(read_only=True)
    tarjetaVehiculo_id = serializers.IntegerField(write_only=True)
    marca_modelo = serializers.SerializerMethodField()

    class Meta:
        model = Vehiculo
        fields = [
            'id',
            'placa',
            'anio',
            'tarjetaVehiculo',
            'tarjetaVehiculo_id',
            'kilometraje',
            'costo',
            'ubicacion',
            'marca_modelo',
        ]

    def get_marca_modelo(self, obj):
        if obj.tarjetaVehiculo:
            return f"{obj.tarjetaVehiculo.marca} {obj.tarjetaVehiculo.modelo}"
        return ""

class OperacionesDetalladaSerializer(serializers.ModelSerializer):
    """
    Serializa una Operación junto con los datos de Vehiculo (si existe),
    y los detalles de Servicio, Mantenimiento y Combustible (cada uno OneToOne).
    """

    # Asumiendo que Operaciones no tiene FK directo a Vehiculo, usamos objeto_id:
    servicio_detalle = ServicioSerializer(many=True)
    mantenimiento_detalle = MantenimientoSerializer(many=True)
    combustible_detalle = CombustibleSerializer(many=True)

    class Meta:
        model = Operaciones
        fields = [
            'id',
            'numeroDocumento',
            'rucProveedor',
            'nombreProveedor',
            'tipoOperacion',
            'fecha',
            'descripcion',
            'servicio_detalle',
            'mantenimiento_detalle',
            'combustible_detalle',
        ]

    def create(self, validated_data):
        # 1) Extraemos y removemos la lista de combustibles del validated_data:
        combustibles_data = validated_data.pop('combustible_detalle', [])
        # 2) Creamos la operación sin combustible:
        operacion = Operaciones.objects.create(**validated_data)
        # 3) Por cada dict en combustibles_data, creamos el Combustible vinculado:
        for c_data in combustibles_data:
            Combustible.objects.create(operacion=operacion, **c_data)
        return operacion
    
    def update(self, instance, validated_data):
        # Si quieres soportar PUT/PATCH con reemplazo de lista:
        combustibles_data = validated_data.pop('combustible_detalle', None)
        # Actualizas campos simples de la operación:
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if combustibles_data is not None:
            # Por ejemplo, borras los viejos y creas nuevos:
            instance.combustible_detalle.all().delete()
            for c_data in combustibles_data:
                Combustible.objects.create(operacion=instance, **c_data)
        return instance

    def get_servicio_detalle(self, obj):
        """
        El related_name en Servicio es 'servicio_detalle', así que:
        """
        s = obj.servicio_detalle.first()
        if s is not None:
            return {
                'descripcion': s.descripcion,
                'costo': s.costo
            }
        return None

    def get_mantenimiento_detalle(self, obj):
        s = obj.mantenimiento_detalle.first()
        if s is not None:
            return {
                'descripcionItem': s.descripcionItem,
                'cantidad': s.cantidad,
                'costoUnitario': s.costoUnitario,
                'subTotal': s.subTotal,
                'placaVehiculo': s.placaVehiculo.placa if s.placaVehiculo else None
            }
        return None

    def get_combustible_detalle(self, obj):
        s = obj.combustible_detalle.first()
        if s is not None:
            return {
                'cantidadGalones': s.cantidadGalones,
                'costoPorGalon': s.costoPorGalon,
                'placaVehiculo': s.placaVehiculo.placa if s.placaVehiculo else None,
                'subTotal': s.subTotal
            }
        return None