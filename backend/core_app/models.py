from django.db import models
from django.contrib.auth.models import User

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
    numeroDocumento = models.CharField(max_length=20, blank=True, null=True)
    rucProveedor = models.CharField(max_length=11, blank=True, null=True)
    nombreProveedor = models.CharField(max_length=100, blank=True, null=True)
    tipoOperacion = models.CharField(max_length=15, choices=TIPO_OPERACION)
    fecha = models.DateField(auto_now_add=False, default=None, null=True, blank=True)
    descripcion = models.TextField(blank=True, null=True)
    
    class Meta:
        ordering = ['-fecha']
        verbose_name = 'Operación'
        verbose_name_plural = 'Operaciones'
    
    def __str__(self):
        # Eliminamos referencias a campos inexistentes (vehiculo, fecha_operacion)
        return f"{self.get_tipoOperacion_display()} - {self.fecha.strftime('%Y-%m-%d')}"
    
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
    
    # Campos específicos del servicio
    descripcion = models.CharField(max_length=100, default="")
    costo = models.FloatField(null=False, default=0.0)
    placaVehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE, null=True, blank=True, related_name='servicio_vehiculo')
    
    def save(self, *args, **kwargs):
        # Crear o actualizar la operación padre
        if not self.operacion:
            # Si no hay operación asociada, creamos una. OJO: Django NO sabrá cuál es la "fecha"
            # porque aquí no le estamos pasando fecha, pero como 'fecha' no tiene auto_now_add,
            # el frontend tendrá que enviarla más adelante o podrías forzar una fecha predeterminada.
            self.operacion = Operaciones.objects.create(
                numeroDocumento="",       # puedes dejar vacío o usar un valor por defecto
                rucProveedor="",
                nombreProveedor="",
                tipoOperacion='SERVICIO',
                fecha=models.DateField().to_python(models.DateField().default) if hasattr(models.DateField(), 'default') else None,
                descripcion=f"Servicio: {self.descripcion}"
            )
        super().save(*args, **kwargs)


class Mantenimiento(models.Model):
    # Relación con Operaciones
    operacion = models.ForeignKey(Operaciones, on_delete=models.CASCADE, null=True, blank=True, related_name='mantenimiento_detalle')
    
    # Campos específicos del mantenimiento
    descripcionItem = models.CharField(max_length=100, default="")
    cantidad = models.IntegerField(null=False, default=0)
    costoUnitario = models.FloatField(null=False, default=0.0)
    subTotal = models.FloatField(null=False, default=0.0)
    placaVehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE, null=True, blank=True, related_name='mantenimiento_vehiculo')

    def save(self, *args, **kwargs):
        # Calculamos subTotal antes de crear la operación padre
        self.subTotal = self.cantidad * self.costoUnitario

        # Crear o actualizar la operación padre
        if not self.operacion:
            self.operacion = Operaciones.objects.create(
                numeroDocumento="",
                rucProveedor="",
                nombreProveedor="",
                tipoOperacion='MANTENIMIENTO',
                fecha=models.DateField().to_python(models.DateField().default) if hasattr(models.DateField(), 'default') else None,
            )
        else:
            self.operacion.save()
        
        super().save(*args, **kwargs)


class Combustible(models.Model):
    # Relación con Operaciones
    operacion = models.ForeignKey(Operaciones, on_delete=models.CASCADE, null=True, blank=True, related_name='combustible_detalle')
    
    # Campos específicos del combustible
    cantidadGalones = models.IntegerField(null=False, default=0)
    costoPorGalon = models.FloatField(null=False, default=0.0)
    subTotal = models.FloatField(null=False, default=0.0)
    placaVehiculo = models.ForeignKey(Vehiculo, on_delete=models.CASCADE, null=True, blank=True, related_name='combustible_vehiculo')

    def save(self, *args, **kwargs):
        # Calcular subTotal correctamente
        self.subTotal = self.cantidadGalones * self.costoPorGalon
        
        # Crear o actualizar la operación padre
        if not self.operacion:
            self.operacion = Operaciones.objects.create(
                numeroDocumento="",
                rucProveedor="",
                nombreProveedor="",
                tipoOperacion='COMBUSTIBLE',
                fecha=models.DateField().to_python(models.DateField().default) if hasattr(models.DateField(), 'default') else None,
            )
        else:
            self.operacion.save()
        
        super().save(*args, **kwargs)