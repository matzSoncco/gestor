from django.db import models
from decimal import Decimal
# from django.contrib.auth.models import User
from decimal import Decimal
from django.core.validators import (
    MinValueValidator, MaxValueValidator, RegexValidator
)
from django.contrib.auth.models import AbstractUser

COMBUSTIBLE_CHOICES = [
    ('GASOLINA', 'Gasolina'),
    ('DIÉSEL',   'Diésel'),
    ('ELÉCTRICO','Eléctrico'),
]

TIPO_OPERACION = [
    ('combustible', 'Combustible'),
    ('mantenimiento', 'Mantenimiento'),
    ('servicio', 'Servicio'),
]


class Empresa(models.Model):
    ruc = models.CharField(max_length=11, unique=True, validators=[RegexValidator(r'^\d{11}$', 'RUC debe tener 11 dígitos.')])
    razon_social = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200, blank=True, null=True)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.razon_social

class MantenimientoHito(models.Model):
    vehiculo = models.ForeignKey('Vehiculo', on_delete=models.CASCADE, related_name='mantenimientos_hito')
    empresa = models.ForeignKey('Empresa', on_delete=models.CASCADE)
    kilometraje = models.PositiveIntegerField()
    fecha = models.DateField(auto_now_add=True)
    observaciones = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('vehiculo', 'kilometraje')  # Evita duplicados por hito
        ordering = ['-fecha']

    def __str__(self):
        return f"Hito {self.kilometraje} km - {self.vehiculo}"

class Vehiculo(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name="vehiculos")
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
        decimal_places=2,
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
    cilindrada = models.DecimalField(max_digits=7, decimal_places=3, default=Decimal('0.000'),
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
    
    @property
    def necesita_mantenimiento(self):
        intervalo = 100

        ultimo = self.mantenimientos_hito.order_by('-kilometraje').first()
        if not ultimo:
            # Si no hay mantenimientos, calcular el primer hito desde 0
            proximo = intervalo
        else:
            # Calcular el siguiente hito desde el último mantenimiento
            proximo = ((ultimo.kilometraje // intervalo) + 1) * intervalo
            #print(f"[DEBUG] KM actual: {self.kilometraje}, último: {ultimo.kilometraje if ultimo else 'Ninguno'}, siguiente hito: {proximo}")

        return self.kilometraje >= proximo

    @property
    def siguiente_hito_mantenimiento(self):
        intervalo = 100

        ultimo = self.mantenimientos_hito.order_by('-kilometraje').first()
        if not ultimo:
            return intervalo
        return ((ultimo.kilometraje // intervalo) + 1) * intervalo

    @property
    def proximo_hito_mantenimiento(self):
        # Este método calcula el siguiente hito, incluso si el actual ya fue superado
        return self.siguiente_hito_mantenimiento + 100

    def save(self, *args, **kwargs):
        self.placa = self.placa.upper()
        self.vin = self.vin.upper()
        super().save(*args, **kwargs)


class Operaciones(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name="operaciones")
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
        fecha_str = self.fecha.strftime('%Y-%m-%d') if self.fecha else 'Sin fecha'
        return f"{self.get_tipo_operacion_display()} - {fecha_str}"
    
    def save(self, *args, **kwargs):
        # Aquí puedes agregar lógica adicional antes de guardar
        super().save(*args, **kwargs)


class Repuesto(models.Model):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name="repuestos")
    descripcion = models.CharField(max_length=100, default="")

    def __str__(self):
        return self.descripcion

class Servicio(models.Model):
    # Relación con Operaciones
    operacion = models.ForeignKey(Operaciones, on_delete=models.CASCADE, null=True, blank=True, related_name='servicio_detalle')
    placa_vehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE, null=True, blank=True, related_name='servicio_vehiculo')

    # Relación con Empresa
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name="servicios")

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

    # Relación con Empresa
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name="mantenimientos")

    # Campos específicos del mantenimiento
    repuesto = models.ForeignKey(Repuesto, null=True, blank=True, on_delete=models.SET_NULL)
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

    # Relación con Empresa
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name="combustibles")

    # Campos específicos del combustible
    cantidad_galones = models.IntegerField(null=False, default=0)
    costo_por_galon = models.DecimalField(null=False, default=Decimal('0.00'), decimal_places=2, max_digits=10)
    subtotal = models.DecimalField(null=False, default=Decimal('0.00'), editable=False, decimal_places=2, max_digits=10)

    def save(self, *args, **kwargs):
        self.subtotal = Decimal(self.cantidad_galones) * self.costo_por_galon
        super().save(*args, **kwargs)
    
class CustomUser(AbstractUser):
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, null=True, blank=True, related_name='usuarios')

    def __str__(self):
        return f"{self.username} ({self.empresa.razon_social if self.empresa else 'Sin empresa'})"