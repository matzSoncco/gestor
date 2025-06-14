from django.db import models
from decimal import Decimal
# from django.contrib.auth.models import User
from decimal import Decimal
from django.core.validators import (
    MinValueValidator, MaxValueValidator, RegexValidator
)

SERVICIOS = [
    ('SERV1', 'SERVICIO 1'),
    ('SERV2', 'SERVICIO 2'),
]

COMBUSTIBLE_CHOICES = [
    ('GASOLINA', 'Gasolina'),
    ('DIESEL',   'Diésel'),
    ('ELECTRICO','Eléctrico'),
]

TIPO_OPERACION = [
    ('combustible', 'Combustible'),
    ('mantenimiento', 'Mantenimiento'),
    ('servicio', 'Servicio'),
]

class Vehiculo(models.Model):
    placa = models.CharField(
        max_length=6,
        unique=True,
        validators=[
            RegexValidator(r'^[A-Z0-9]{6}$', 'La placa debe tener 6 caracteres alfanuméricos en mayúscula.')
        ],
        help_text="6 caracteres, letras en mayúscula y dígitos."
    )
    anio = models.PositiveIntegerField(
        default=2000,
        validators=[MinValueValidator(1900), MaxValueValidator(2100)],
        help_text="Año de matriculación, entre 1900 y 2100."
    )
    kilometraje = models.DecimalField(
        max_digits=10,
        decimal_places=1,
        default=Decimal('0.0'),
        validators=[MinValueValidator(0)],
        help_text="Kilómetros recorridos, 1 decimal."
    )
    costo = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(0)],
        help_text="Costo del vehículo en soles, 2 decimales."
    )
    ubicacion = models.CharField(
        max_length=100,
        blank=True,
        help_text="Ubicación actual (opcional)."
    )

    # Datos del “tarjetaVehiculo” integrados
    categoria = models.CharField(max_length=50, help_text="Categoría del vehículo", default='')
    marca     = models.CharField(max_length=50, help_text="Marca del vehículo", default='')
    modelo    = models.CharField(max_length=50, help_text="Modelo del vehículo", default='')
    version   = models.CharField(max_length=50, blank=True, default='', help_text="Versión del vehículo")
    color     = models.CharField(max_length=30, blank=True, default='', help_text="Color del vehículo")
    anio_fabricacion = models.PositiveIntegerField(
        default=2000,
        validators=[MinValueValidator(1900), MaxValueValidator(2100)]
    )
    anio_modelo = models.PositiveIntegerField(
        default=2000,
        validators=[MinValueValidator(1900), MaxValueValidator(2100)]
    )
    motor = models.CharField(max_length=30, blank=True)
    combustible = models.CharField(
        max_length=20,
        choices=COMBUSTIBLE_CHOICES,
        default='GASOLINA'
    )
    forma_rodante = models.CharField(max_length=50, default='')
    vin = models.CharField(
        max_length=17,
        unique=True,
        validators=[RegexValidator(r'^[A-HJ-NPR-Z0-9]{17}$', 'VIN inválido.')],
        help_text="17 caracteres alfanuméricos (sin I,O,Q).", default=''
    )
    serie_chasis = models.CharField(max_length=30, blank=True)
    ejes = models.PositiveSmallIntegerField(default=2, validators=[MinValueValidator(1)])
    ruedas = models.PositiveSmallIntegerField(default=4, validators=[MinValueValidator(2)])
    pasajeros = models.PositiveSmallIntegerField(default=1, validators=[MinValueValidator(1)])
    carroceria = models.CharField(max_length=30, blank=True)

    peso_neto = models.DecimalField(
        max_digits=7, decimal_places=3, default=Decimal('0.000'),
        validators=[MinValueValidator(0)]
    )
    peso_bruto = models.DecimalField(
        max_digits=7, decimal_places=3, default=Decimal('0.000'),
        validators=[MinValueValidator(0)]
    )
    carga_util = models.DecimalField(
        max_digits=7, decimal_places=3, default=Decimal('0.000'),
        validators=[MinValueValidator(0)]
    )
    cilindrada = models.DecimalField(default=Decimal('0.000'),
        validators=[MinValueValidator(0)])
    cilindros  = models.PositiveSmallIntegerField(default=1, validators=[MinValueValidator(1)])
    altura     = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
    ancho      = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
    longitud   = models.DecimalField(max_digits=6, decimal_places=3, default=Decimal('0.000'))

    class Meta:
        verbose_name = "Vehículo"
        verbose_name_plural = "Vehículos"
        ordering = ['placa']

    def __str__(self):
        return f"{self.placa} ({self.marca} {self.modelo})"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class Operaciones(models.Model):
    numero_documento = models.CharField(max_length=20, blank=True, null=True)
    ruc_proveedor = models.CharField(max_length=11, blank=True, null=True)
    nombre_proveedor = models.CharField(max_length=100, blank=True, null=True)
    tipo_operacion = models.CharField(max_length=15, choices=TIPO_OPERACION)
    fecha = models.DateField(auto_now_add=False, default=None, null=True, blank=True)
    descripcion = models.TextField(blank=True, null=True)
    costo_total = models.DecimalField(null=False, default=Decimal('0.00'), editable=False, decimal_places=2, max_digits=10)
    
    class Meta:
        ordering = ['-fecha']
        verbose_name = 'Operación'
        verbose_name_plural = 'Operaciones'
    
    def __str__(self):
        # Eliminamos referencias a campos inexistentes (vehiculo, fecha_operacion)
        return f"{self.get_tipo_operacion_display()} - {self.fecha.strftime('%Y-%m-%d')}"
    
    def save(self, *args, **kwargs):
        # Aquí puedes agregar lógica adicional antes de guardar
        super().save(*args, **kwargs)


class Repuesto(models.Model):
    idRepuesto = models.IntegerField(null=False)
    nombre = models.CharField(max_length=100, default="")
    
    def __str__(self):
        return f"Repuesto {self.idRepuesto} - {self.nombre}"

class Servicio(models.Model):
    # Relación con Operaciones
    operacion = models.ForeignKey(Operaciones, on_delete=models.CASCADE, null=True, blank=True, related_name='servicio_detalle')
    placa_vehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE, null=True, blank=True, related_name='servicio_vehiculo')

    # Campos específicos del servicio
    descripcion_item = models.CharField(max_length=100, default="")
    costo_servicio = models.DecimalField(null=False, default=Decimal('0.00'), decimal_places=2, max_digits=10)
    
    def save(self, *args, **kwargs):
        # 1) Si necesitas lógica adicional: colócala aquí…
        super().save(*args, **kwargs)


class Mantenimiento(models.Model):
    # Relación con Operaciones
    operacion = models.ForeignKey(Operaciones, on_delete=models.CASCADE, null=True, blank=True, related_name='mantenimiento_detalle')
    placa_vehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE, null=True, blank=True, related_name='mantenimiento_vehiculo')

    # Campos específicos del mantenimiento
    descripcion_item = models.CharField(max_length=100, default="")
    cantidad = models.IntegerField(null=False, default=0)
    costo_unitario = models.DecimalField(null=False, default=Decimal('0.00'), decimal_places=2, max_digits=10)
    subtotal = models.DecimalField(null=False, default=Decimal('0.00'), editable=False, decimal_places=2, max_digits=10)

    def save(self, *args, **kwargs):
        self.subtotal = Decimal(self.cantidad) * self.costo_unitario
        super().save(*args, **kwargs)

class Combustible(models.Model):
    # Relación con Operaciones
    operacion = models.ForeignKey(Operaciones, on_delete=models.CASCADE, null=True, blank=True, related_name='combustible_detalle')
    placa_vehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE, null=True, blank=True, related_name='combustible_vehiculo')

    # Campos específicos del combustible
    cantidad_galones = models.IntegerField(null=False, default=0)
    costo_por_galon = models.DecimalField(null=False, default=Decimal('0.00'), decimal_places=2, max_digits=10)
    subtotal = models.DecimalField(null=False, default=Decimal('0.00'), editable=False, decimal_places=2, max_digits=10)

    def save(self, *args, **kwargs):
        self.subtotal = Decimal(self.cantidad_galones) * self.costo_por_galon
        super().save(*args, **kwargs)