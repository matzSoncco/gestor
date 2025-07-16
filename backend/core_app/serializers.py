from rest_framework import serializers
from django.db import transaction
from decimal import Decimal, InvalidOperation
import logging
from .models import (
    Vehiculo,
    Operaciones,
    Servicio,
    Mantenimiento,
    Combustible,
    Repuesto,
    CustomUser
)

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'empresa']

class RepuestoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repuesto
        fields = ['id', 'nombre']

class ServicioSerializer(serializers.ModelSerializer):
    placa_vehiculo = serializers.PrimaryKeyRelatedField(queryset=Vehiculo.objects.all())
    class Meta:
        model = Servicio
        fields = ['id', 'descripcion_item', 'costo_servicio', 'placa_vehiculo']
        read_only_fields = ['id']

# ---------------------------------
# 4) Serializer para Mantenimiento
# ---------------------------------
class MantenimientoSerializer(serializers.ModelSerializer):
    placa_vehiculo = serializers.PrimaryKeyRelatedField(queryset=Vehiculo.objects.all())
    class Meta:
        model = Mantenimiento
        fields = ['id', 'descripcion_item', 'cantidad', 'costo_unitario', 'subtotal', 'placa_vehiculo']
        read_only_fields = ['id', 'subtotal']

# -----------------------------------
# 5) Serializer para Combustible
# -----------------------------------
class CombustibleSerializer(serializers.ModelSerializer):
    placa_vehiculo = serializers.PrimaryKeyRelatedField(queryset=Vehiculo.objects.all())
    class Meta:
        model = Combustible
        fields = ['id', 'cantidad_galones', 'costo_por_galon', 'placa_vehiculo', 'subtotal']
        read_only_fields = ['id', 'subtotal']

# ---------------------------------------------------
# 6) Serializer para Vehiculo
# ---------------------------------------------------
class VehiculoSerializer(serializers.ModelSerializer):
    # Campo extra combinado
    marca_modelo = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Vehiculo
        fields = [
            'id',
            'placa',
            'anio',
            'kilometraje',
            'costo',
            'ubicacion',
            # Datos de tarjeta
            'categoria',
            'marca',
            'modelo',
            'version',
            'color',
            'anio_fabricacion',
            'anio_modelo',
            'motor',
            'combustible',
            'forma_rodante',
            'vin',
            'serie_chasis',
            'ejes',
            'ruedas',
            'pasajeros',
            'carroceria',
            'peso_neto',
            'peso_bruto',
            'carga_util',
            'cilindrada',
            'cilindros',
            'altura',
            'ancho',
            'longitud',
            # Campo derivado
            'marca_modelo',
        ]
        read_only_fields = ['id', 'marca_modelo']

    def get_marca_modelo(self, obj):
        return f"{obj.marca} {obj.modelo}"

class OperacionSerializer(serializers.ModelSerializer):
    servicio_detalle = ServicioSerializer(many=True, required=False)
    mantenimiento_detalle = MantenimientoSerializer(many=True, required=False)
    combustible_detalle = CombustibleSerializer(many=True, required=False)

    class Meta:
        model = Operaciones
        fields = [
            'id', 'numero_documento', 'ruc_proveedor', 'nombre_proveedor',
            'tipo_operacion', 'fecha', 'descripcion', 'costo_total',
            'servicio_detalle', 'mantenimiento_detalle', 'combustible_detalle',
        ]
        read_only_fields = ['costo_total']

    def create(self, validated_data):
        # Usamos una transacción. Si algo falla, nada se guarda.
        logger = logging.getLogger(__name__)
        with transaction.atomic():
            servicios_data = validated_data.pop('servicio_detalle', [])
            mantenimientos_data = validated_data.pop('mantenimiento_detalle', [])
            combustibles_data = validated_data.pop('combustible_detalle', [])

            # Creamos la operación principal
            operacion = Operaciones.objects.create(**validated_data)
            
            total_operacion = Decimal('0.00')

            def safe_decimal_conversion(value, field_name="campo"):
                """Convierte un valor a Decimal de forma segura"""
                try:
                    if value is None:
                        return Decimal('0.00')
                    if isinstance(value, Decimal):
                        return value
                    return Decimal(str(value))
                except (InvalidOperation, ValueError, TypeError) as e:
                    logger.error(f"Error convirtiendo {field_name}: {value} - {e}")
                    return Decimal('0.00')

            # Creamos los detalles y vamos sumando sus subtotales
            for servicio_data in servicios_data:
                servicio = Servicio.objects.create(operacion=operacion, **servicio_data)
                costo_servicio = safe_decimal_conversion(servicio.costo_servicio, "costo_servicio")
                total_operacion += costo_servicio

            for mantenimiento_data in mantenimientos_data:
                mantenimiento = Mantenimiento.objects.create(operacion=operacion, **mantenimiento_data)
                subtotal_mantenimiento = safe_decimal_conversion(mantenimiento.subtotal, "subtotal_mantenimiento")
                total_operacion += subtotal_mantenimiento

            for combustible_data in combustibles_data:
                combustible = Combustible.objects.create(operacion=operacion, **combustible_data)
                subtotal_combustible = safe_decimal_conversion(combustible.subtotal, "subtotal_combustible")
                total_operacion += subtotal_combustible

            # ASIGNAMOS Y GUARDAMOS EL COSTO TOTAL CALCULADO
            operacion.costo_total = total_operacion
            operacion.save()

            return operacion
    
    def update(self, instance, validated_data):
        # Misma lógica de transacción para el update
        with transaction.atomic():
            servicios_data = validated_data.pop('servicio_detalle', [])
            mantenimientos_data = validated_data.pop('mantenimiento_detalle', [])
            combustibles_data = validated_data.pop('combustible_detalle', [])

            # Actualizamos los campos simples de la operación
            instance.numero_documento = validated_data.get('numero_documento', instance.numero_documento)
            instance.ruc_proveedor = validated_data.get('ruc_proveedor', instance.ruc_proveedor)
            instance.nombre_proveedor = validated_data.get('nombre_proveedor', instance.nombre_proveedor)
            instance.tipo_operacion = validated_data.get('tipo_operacion', instance.tipo_operacion)
            instance.fecha = validated_data.get('fecha', instance.fecha)
            instance.descripcion = validated_data.get('descripcion', instance.descripcion)
            instance.save()

            total_operacion = Decimal('0.0')

            # Estrategia "Borrar y Reemplazar" para los detalles
            # (es simple y efectiva para la mayoría de los casos de uso de formularios)
            
            # Servicios
            instance.servicio_detalle.all().delete()
            for servicio_data in servicios_data:
                servicio = Servicio.objects.create(operacion=instance, **servicio_data)
                total_operacion += servicio.costo_servicio

            # Mantenimientos
            instance.mantenimiento_detalle.all().delete()
            for mantenimiento_data in mantenimientos_data:
                mantenimiento = Mantenimiento.objects.create(operacion=instance, **mantenimiento_data)
                total_operacion += mantenimiento.subtotal

            # Combustibles
            instance.combustible_detalle.all().delete()
            for combustible_data in combustibles_data:
                combustible = Combustible.objects.create(operacion=instance, **combustible_data)
                total_operacion += combustible.subtotal

            # RECALCULAMOS, ASIGNAMOS Y GUARDAMOS EL NUEVO COSTO TOTAL
            instance.costo_total = total_operacion
            instance.save()
            
            return instance