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

from django.db import models

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
    placa=models.CharField(max_length=6)
    anio=models.IntegerField(null=False, default=0)
    tarjetaVehiculo=models.ForeignKey(tarjetaVehiculo, on_delete=models.CASCADE)
    kilometraje=models.FloatField(null=False, default=0.0)
    costo=models.FloatField(null=False, default=0.0)
    ubicacion=models.CharField(max_length=100)
    def __str__(self):
        return f"{self.placa} ({self.anio})"

class Servicio(models.Model):
    idServicio=models.IntegerField(null=False )
    RUC=models.CharField(max_length=11)
    proveedor=models.CharField(max_length=6)
    tipoServicio = models.CharField(max_length=10, choices=SERVICIOS)
    def __str__(self):
        return f"{self.proveedor} - {self.get_tipoServicio_display()}"
    
class Mantenimiento(models.Model):
    idMantenim=models.IntegerField(null=False )
    costoTotal=models.FloatField(null=False, default=0.0)
    comentario=models.TextField()
    tipoRepuesto=models.CharField(max_length=10, choices=REPUESTO)
    cantidad=models.IntegerField(null=False, default=0)

class Combustible(models.Model):
    idCombustible=models.IntegerField(null=False )
    cantidadGalon=models.IntegerField(null=False, default=0)
    costoGalon=models.FloatField(null=False, default=0.0)
    costoTotal = models.FloatField(null=False, default=0.0)
    ubicacion=models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        self.costoTotal = self.cantidadGalon * self.costoGalon
        super().save(*args, **kwargs)



