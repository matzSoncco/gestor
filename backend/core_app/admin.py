from django.contrib import admin
from core_app.models import Vehiculo, Servicio, Mantenimiento, Combustible, tarjetaVehiculo
admin.site.register(Vehiculo)
admin.site.register(Servicio)
admin.site.register(Mantenimiento)
admin.site.register(Combustible)
admin.site.register(tarjetaVehiculo)
