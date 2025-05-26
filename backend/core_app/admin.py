from django.contrib import admin
from core_app.models import Vehiculo, Servicio, Mantenimiento, Combustible, tarjetaVehiculo, Operaciones

class OperacionesInline(admin.TabularInline):
    model = Operaciones
    extra = 0
    readonly_fields = ('fecha_operacion',)
    fields = ('tipo_operacion', 'costo_total', 'descripcion', 'ubicacion', 'fecha_operacion')

@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    list_display = ('placa', 'anio', 'marca_modelo', 'kilometraje', 'ubicacion', 'total_operaciones')
    list_filter = ('anio', 'ubicacion', 'tarjetaVehiculo__marca')
    search_fields = ('placa', 'tarjetaVehiculo__marca', 'tarjetaVehiculo__modelo')
    inlines = [OperacionesInline]
    
    def marca_modelo(self, obj):
        return f"{obj.tarjetaVehiculo.marca} {obj.tarjetaVehiculo.modelo}"
    marca_modelo.short_description = 'Marca/Modelo'
    
    def total_operaciones(self, obj):
        return obj.operaciones.count()
    total_operaciones.short_description = 'Total Operaciones'

@admin.register(Operaciones)
class OperacionesAdmin(admin.ModelAdmin):
    list_display = ('id', 'vehiculo', 'tipo_operacion', 'fecha_operacion', 'costo_total', 'ubicacion')
    list_filter = ('tipo_operacion', 'fecha_operacion', 'vehiculo__placa')
    search_fields = ('vehiculo__placa', 'descripcion')
    date_hierarchy = 'fecha_operacion'
    readonly_fields = ('fecha_operacion',)
    
    fieldsets = (
        ('Información General', {
            'fields': ('vehiculo', 'tipo_operacion', 'fecha_operacion')
        }),
        ('Detalles Financieros', {
            'fields': ('costo_total',)
        }),
        ('Información Adicional', {
            'fields': ('descripcion', 'ubicacion', 'objeto_id'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ('idServicio', 'proveedor', 'tipoServicio', 'RUC', 'operacion_vehiculo')
    list_filter = ('tipoServicio',)
    search_fields = ('proveedor', 'RUC')
    
    def operacion_vehiculo(self, obj):
        if obj.operacion:
            return obj.operacion.vehiculo.placa
        return "Sin operación"
    operacion_vehiculo.short_description = 'Vehículo'

@admin.register(Mantenimiento)
class MantenimientoAdmin(admin.ModelAdmin):
    list_display = ('idMantenim', 'tipoRepuesto', 'cantidad', 'costo_total_display', 'operacion_vehiculo')
    list_filter = ('tipoRepuesto',)
    search_fields = ('comentario',)
    
    def costo_total_display(self, obj):
        return getattr(obj, 'costoTotal', 0.0)
    costo_total_display.short_description = 'Costo Total'
    
    def operacion_vehiculo(self, obj):
        if obj.operacion:
            return obj.operacion.vehiculo.placa
        return "Sin operación"
    operacion_vehiculo.short_description = 'Vehículo'

@admin.register(Combustible)
class CombustibleAdmin(admin.ModelAdmin):
    list_display = ('idCombustible', 'cantidadGalon', 'costoGalon', 'costoTotal', 'operacion_vehiculo')
    readonly_fields = ('costoTotal',)
    
    def operacion_vehiculo(self, obj):
        if obj.operacion:
            return obj.operacion.vehiculo.placa
        return "Sin operación"
    operacion_vehiculo.short_description = 'Vehículo'

@admin.register(tarjetaVehiculo)
class TarjetaVehiculoAdmin(admin.ModelAdmin):
    list_display = ('vin', 'marca', 'modelo', 'anio_fabricacion', 'combustible')
    list_filter = ('marca', 'combustible', 'anio_fabricacion')
    search_fields = ('vin', 'marca', 'modelo', 'serie_chasis')
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('categoria', 'marca', 'modelo', 'version', 'color')
        }),
        ('Años', {
            'fields': ('anio_fabricacion', 'anio_modelo')
        }),
        ('Motor y Combustible', {
            'fields': ('motor', 'combustible', 'cilindrada', 'cilindros')
        }),
        ('Identificación', {
            'fields': ('vin', 'serie_chasis')
        }),
        ('Características Físicas', {
            'fields': ('forma_rodante', 'ejes', 'ruedas', 'pasajeros', 'carroceria'),
            'classes': ('collapse',)
        }),
        ('Pesos y Medidas', {
            'fields': ('peso_neto', 'peso_bruto', 'carga_util', 'altura', 'ancho', 'longitud'),
            'classes': ('collapse',)
        }),
    )

# Personalización del sitio de administración
admin.site.site_header = "Administración de Vehículos"
admin.site.site_title = "Panel de Control"
admin.site.index_title = "Gestión de Vehículos y Operaciones"