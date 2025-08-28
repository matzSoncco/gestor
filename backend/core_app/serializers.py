from rest_framework import serializers
from django.db import transaction
from decimal import Decimal
from django.contrib.auth.hashers import make_password
from decimal import Decimal, ROUND_HALF_UP
from .models import (
    Vehiculo,
    Operaciones,
    Servicio,
    Mantenimiento,
    Combustible,
    Repuesto,
    CustomUser,
    Empresa,
    MantenimientoHito
)

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        fields = ['id', 'ruc', 'razon_social']

class CustomUserSerializer(serializers.ModelSerializer):
    #empresa = EmpresaSerializer(read_only=True)
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

from rest_framework import serializers
from .models import Repuesto

class RepuestoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repuesto
        fields = ['id', 'descripcion', 'empresa']
        read_only_fields = ['empresa']  # lo asigna la vista con request.user.empresa

    def to_internal_value(self, data):
        """
        Permite aceptar un id o una cadena como 'repuesto'.
        Si es string, lo crea (o lo busca) automáticamente.
        """
        if isinstance(data, int):
            # Buscar por ID
            try:
                return Repuesto.objects.get(pk=data)
            except Repuesto.DoesNotExist:
                raise serializers.ValidationError(f"Repuesto con id {data} no existe.")
        
        if isinstance(data, str):
            descripcion = data.strip()
            if not descripcion:
                raise serializers.ValidationError("La descripción no puede estar vacía.")
            repuesto, _ = Repuesto.objects.get_or_create(
                descripcion=descripcion,
                defaults={'empresa': self.context['request'].user.empresa}
            )
            return repuesto

        raise serializers.ValidationError("Formato inválido para repuesto (usa id o texto).")

    def to_representation(self, instance):
        """
        Cómo se envía al frontend.
        """
        return {
            'id': instance.id,
            'descripcion': instance.descripcion
        }

class MantenimientoHitoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MantenimientoHito
        fields = '__all__'
        read_only_fields = ['fecha', 'empresa', 'vehiculo']

class ServicioSerializer(serializers.ModelSerializer):
    placa_vehiculo = serializers.PrimaryKeyRelatedField(
        queryset=Vehiculo.objects.all(),
        error_messages={
            "required": "Debes seleccionar un vehículo",
        }
    )
    igv = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    class Meta:
        model = Servicio
        fields = ['id', 'descripcion_item', 'subtotal', 'placa_vehiculo', 'igv', 'total']
        read_only_fields = ['igv', 'total']

    def get_igv(self, obj):
        return obj.igv

    def get_total(self, obj):
        return obj.total

class MantenimientoSerializer(serializers.ModelSerializer):
    repuesto = RepuestoSerializer()
    placa_vehiculo = serializers.PrimaryKeyRelatedField(queryset=Vehiculo.objects.all())
    igv = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    class Meta:
        model = Mantenimiento
        fields = ['id', 'repuesto', 'cantidad', 'costo_unitario', 'subtotal', 'placa_vehiculo', 'igv', 'total']
        read_only_fields = ['subtotal', 'igv', 'total']

    def get_igv(self, obj):
        return obj.igv

    def get_total(self, obj):
        return obj.total

    def create(self, validated_data):
        descripcion = validated_data.get("repuesto", "").strip()

        # ⚠️ Verifica si la descripción está vacía
        if not descripcion:
            raise serializers.ValidationError("La descripción del ítem no puede estar vacía.")

        # Obtener o crear el respuesto
        repuesto, _ = Repuesto.objects.get_or_create(descripcion=descripcion)

        # Asignar al mantenimiento
        validated_data["repuesto"] = repuesto

        return super().create(validated_data)

class CombustibleSerializer(serializers.ModelSerializer):
    placa_vehiculo = serializers.PrimaryKeyRelatedField(queryset=Vehiculo.objects.all())
    igv = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    class Meta:
        model = Combustible
        fields = ['id', 'cantidad_galones', 'costo_por_galon', 'placa_vehiculo', 'subtotal', 'ubicacion', 'igv', 'total']
        read_only_fields = ['subtotal', 'igv', 'total']

    def get_igv(self, obj):
        return obj.igv

    def get_total(self, obj):
        return obj.total

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
            'necesita_mantenimiento',
            'siguiente_hito_mantenimiento',
            'proximo_hito_mantenimiento',
            'created_at',
        ]
        read_only_fields = ['id', 'marca_modelo', 'empresa', 'necesita_mantenimiento', 'siguiente_hito_mantenimiento', 'proximo_hito_mantenimiento', 'created_at']

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
            'servicio_detalle', 'mantenimiento_detalle', 'combustible_detalle', 'created_at'
        ]
        read_only_fields = ['costo_total', 'created_at']

    def validate_ruc_proveedor(self, value):
        if not value.isdigit() or len(value) != 11:
            raise serializers.ValidationError("El RUC debe tener exactamente 11 dígitos numéricos")
        return value

    def create(self, validated_data):
        combustible_data = validated_data.pop('combustible_detalle', [])
        mantenimiento_data = validated_data.pop('mantenimiento_detalle', [])
        servicio_data = validated_data.pop('servicio_detalle', [])

        operacion = Operaciones.objects.create(**validated_data) # Primero crea la Operacion

        total_subtotal = Decimal('0.00')

        # Crea y asocia los detalles, y suma sus subtotales
        for c_data in combustible_data:
            combustible_instance = Combustible.objects.create(operacion=operacion, **c_data)
            total_subtotal += combustible_instance.subtotal

        for m_data in mantenimiento_data:
            mantenimiento_instance = Mantenimiento.objects.create(operacion=operacion, **m_data)
            total_subtotal += mantenimiento_instance.subtotal

        for s_data in servicio_data:
            servicio_instance = Servicio.objects.create(operacion=operacion, **s_data)
            total_subtotal += servicio_instance.subtotal

        # Calcula el IGV y el costo total
        igv_final = (total_subtotal * Decimal('0.18')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        costo_total_final = (total_subtotal + igv_final).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        # Asigna el costo_total calculado a la operación y guárdala nuevamente
        operacion.costo_total = costo_total_final
        operacion.save() # Llama al save del modelo que ahora debería ser más simple (o incluso vacío si la lógica está toda aquí)

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
                servicio = Servicio.objects.create(operacion=instance, empresa=self.context["request"].user.empresa, **servicio_data)
                total_operacion += servicio.costo_servicio

            # Mantenimientos
            instance.mantenimiento_detalle.all().delete()
            for mantenimiento_data in mantenimientos_data:
                mantenimiento = Mantenimiento.objects.create(operacion=instance, empresa=self.context["request"].user.empresa, **mantenimiento_data)
                total_operacion += mantenimiento.subtotal

            # Combustibles
            instance.combustible_detalle.all().delete()
            for combustible_data in combustibles_data:
                combustible = Combustible.objects.create(operacion=instance, empresa=self.context["request"].user.empresa, **combustible_data)
                total_operacion += combustible.subtotal

            # RECALCULAMOS, ASIGNAMOS Y GUARDAMOS EL NUEVO COSTO TOTAL
            instance.costo_total = total_operacion
            instance.save()
            
            return instance