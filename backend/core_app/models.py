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

class tarjetaVehiculo(models.Model):
    dato="prueba :v"
    def __str__(self):
        return self.dato

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



