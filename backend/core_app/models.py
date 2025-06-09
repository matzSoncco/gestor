from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal

SERVICIOS = [
    ('SERV1', 'SERVICIO 1'),
    ('SERV2', 'SERVICIO 2'),
]

COMBUSTIBLE = [
    ('GSL', 'GASOLINA'),
    ('PET', 'PETROLEO'),
]

TIPO_OPERACION = [
    ('combustible', 'Combustible'),
    ('mantenimiento', 'Mantenimiento'),
    ('servicio', 'Servicio'),
]

class tarjetaVehiculo(models.Model):
    categoria = models.CharField(max_length=10) 
    marca = models.CharField(max_length=20)       
    modelo = models.CharField(max_length=20)     
    version = models.CharField(max_length=100)  
    color = models.CharField(max_length=30)     
    anio_fabricacion = models.PositiveIntegerField() 
    anio_modelo = models.PositiveIntegerField()      
    motor = models.CharField(max_length=20)    
    combustible = models.CharField(max_length=10, choices=COMBUSTIBLE)
    forma_rodante = models.CharField(max_length=10) 
    vin = models.CharField(max_length=30, unique=True) 
    serie_chasis = models.CharField(max_length=30)     
    ejes = models.PositiveIntegerField()          
    ruedas = models.PositiveIntegerField()        
    pasajeros = models.PositiveIntegerField()     
    carroceria = models.CharField(max_length=20) 
    peso_neto = models.DecimalField(max_digits=6, decimal_places=3)    
    peso_bruto = models.DecimalField(max_digits=6, decimal_places=3)    
    carga_util = models.DecimalField(max_digits=6, decimal_places=3) 
    cilindrada = models.PositiveIntegerField()   
    cilindros = models.PositiveIntegerField()     
    altura = models.DecimalField(max_digits=4, decimal_places=2)    
    ancho = models.DecimalField(max_digits=4, decimal_places=2)
    longitud = models.DecimalField(max_digits=5, decimal_places=3)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f'{self.marca} {self.modelo} ({self.vin})'


class Vehiculo(models.Model):
    placa = models.CharField(max_length=6)
    anio = models.IntegerField(null=False, default=0)
    tarjetaVehiculo = models.ForeignKey(tarjetaVehiculo, on_delete=models.CASCADE)
    kilometraje = models.FloatField(null=False, default=0.0)
    costo = models.DecimalField(null=False, default=Decimal('0.00'), decimal_places=2, max_digits=10)
    ubicacion = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.placa} ({self.anio})"


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