from django.db import models
from django.contrib.auth.models import User

SERVICIOS = [
    ('SERV1', 'SERVICIO 1'),
    ('SERV2', 'SERVICIO 2'),
]

REPUESTO = [
    ('REP1', 'REPUESTO 1'),
    ('REP2', 'REPUESTO 2'),
]

COMBUSTIBLE = [
    ('GSL', 'GASOLINA'),
    ('PET', 'PETROLEO'),
]

TIPO_OPERACION = [
    ('COMBUSTIBLE', 'Combustible'),
    ('MANTENIMIENTO', 'Mantenimiento'),
    ('SERVICIO', 'Servicio'),
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

    def __str__(self):
        return f'{self.marca} {self.modelo} ({self.vin})'


class Vehiculo(models.Model):
    placa = models.CharField(max_length=6)
    anio = models.IntegerField(null=False, default=0)
    tarjetaVehiculo = models.ForeignKey(tarjetaVehiculo, on_delete=models.CASCADE)
    kilometraje = models.FloatField(null=False, default=0.0)
    costo = models.FloatField(null=False, default=0.0)
    ubicacion = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.placa} ({self.anio})"


class Operaciones(models.Model):
    """
    Clase padre que engloba todas las operaciones del vehículo
    """
    vehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE, related_name='operaciones')
    tipo_operacion = models.CharField(max_length=15, choices=TIPO_OPERACION)
    fecha_operacion = models.DateTimeField(auto_now_add=True)
    costo_total = models.FloatField(null=False, default=0.0)
    descripcion = models.TextField(blank=True, null=True)
    ubicacion = models.CharField(max_length=100, blank=True, null=True)
    
    # Campo para identificar la operación específica
    objeto_id = models.PositiveIntegerField(null=True, blank=True)
    
    class Meta:
        ordering = ['-fecha_operacion']
        verbose_name = 'Operación'
        verbose_name_plural = 'Operaciones'
    
    def __str__(self):
        return f"{self.vehiculo.placa} - {self.get_tipo_operacion_display()} - {self.fecha_operacion.strftime('%Y-%m-%d')}"
    
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
    operacion = models.OneToOneField(Operaciones, on_delete=models.CASCADE, null=True, blank=True, related_name='servicio_detalle')
    
    # Campos específicos del servicio
    idServicio = models.IntegerField(null=False)
    RUC = models.CharField(max_length=11)
    proveedor = models.CharField(max_length=100)  # Aumenté el tamaño
    tipoServicio = models.CharField(max_length=10, choices=SERVICIOS)
    
    def __str__(self):
        return f"{self.proveedor} - {self.get_tipoServicio_display()}"
    
    def save(self, *args, **kwargs):
        # Crear o actualizar la operación padre
        if not self.operacion:
            self.operacion = Operaciones.objects.create(
                vehiculo_id=1,  # Deberás pasar el vehículo correspondiente
                tipo_operacion='SERVICIO',
                descripcion=f"Servicio: {self.get_tipoServicio_display()}"
            )
        super().save(*args, **kwargs)


class Mantenimiento(models.Model):
    # Relación con Operaciones
    operacion = models.OneToOneField(Operaciones, on_delete=models.CASCADE, null=True, blank=True, related_name='mantenimiento_detalle')
    
    # Campos específicos del mantenimiento
    idMantenim = models.IntegerField(null=False)
    comentario = models.TextField()
    tipoRepuesto = models.CharField(max_length=10, choices=REPUESTO)
    cantidad = models.IntegerField(null=False, default=0)
    
    def __str__(self):
        return f"Mantenimiento {self.idMantenim} - {self.get_tipoRepuesto_display()}"
    
    def save(self, *args, **kwargs):
        # Crear o actualizar la operación padre
        if not self.operacion:
            self.operacion = Operaciones.objects.create(
                vehiculo_id=1,  # Deberás pasar el vehículo correspondiente
                tipo_operacion='MANTENIMIENTO',
                costo_total=getattr(self, 'costoTotal', 0.0),
                descripcion=f"Mantenimiento: {self.comentario}"
            )
        else:
            self.operacion.costo_total = getattr(self, 'costoTotal', 0.0)
            self.operacion.descripcion = f"Mantenimiento: {self.comentario}"
            self.operacion.save()
        
        super().save(*args, **kwargs)


class Combustible(models.Model):
    # Relación con Operaciones
    operacion = models.OneToOneField(Operaciones, on_delete=models.CASCADE, null=True, blank=True, related_name='combustible_detalle')
    
    # Campos específicos del combustible
    idCombustible = models.IntegerField(null=False)
    cantidadGalon = models.IntegerField(null=False, default=0)
    costoGalon = models.FloatField(null=False, default=0.0)
    costoTotal = models.FloatField(null=False, default=0.0)
    
    def __str__(self):
        return f"Combustible {self.idCombustible} - {self.cantidadGalon} galones"

    def save(self, *args, **kwargs):
        # Calcular costo total
        self.costoTotal = self.cantidadGalon * self.costoGalon
        
        # Crear o actualizar la operación padre
        if not self.operacion:
            self.operacion = Operaciones.objects.create(
                vehiculo_id=1,  # Deberás pasar el vehículo correspondiente
                tipo_operacion='COMBUSTIBLE',
                costo_total=self.costoTotal,
                descripcion=f"Combustible: {self.cantidadGalon} galones a ${self.costoGalon} c/u"
            )
        else:
            self.operacion.costo_total = self.costoTotal
            self.operacion.descripcion = f"Combustible: {self.cantidadGalon} galones a ${self.costoGalon} c/u"
            self.operacion.save()
        
        super().save(*args, **kwargs)