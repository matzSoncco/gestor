from django.contrib import admin
from .models import tarjetaVehiculo, Vehiculo, Servicio, Mantenimiento, Combustible
admin.site.register(tarjetaVehiculo)
admin.site.register(Vehiculo)
admin.site.register(Servicio)
admin.site.register(Mantenimiento)
admin.site.register(Combustible)
