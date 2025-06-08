from django.contrib import admin
from core_app.models import Vehiculo, Servicio, Mantenimiento, Combustible, tarjetaVehiculo, Operaciones

class ServicioInline(admin.TabularInline):
    """
    Permite editar/visualizar el registro de Servicio directamente
    desde la página de cambio/creación de Operaciones.
    """
    model = Servicio
    fk_name = 'operacion'   # el campo OneToOneField hacia Operaciones
    extra = 0               # Si no quieres filas en blanco adicionales, déjalo en 0
    readonly_fields = ['descripcion_item', 'costo_servicio']  # si deseas que sea solo lectura
    # Si prefieres permitir edición de Servicio dentro de Operaciones, remueve 'readonly_fields'.

class MantenimientoInline(admin.TabularInline):
    """
    Permite editar/visualizar el registro de Mantenimiento directamente
    desde la página de Operaciones.
    """
    model = Mantenimiento
    fk_name = 'operacion'
    extra = 0
    readonly_fields = ['descripcion_item', 'cantidad', 'costo_unitario', 'subtotal']
    # Quita 'readonly_fields' si quieres que los campos sean editables en el inline.

class CombustibleInline(admin.TabularInline):
    """
    Permite editar/visualizar el registro de Combustible directamente
    desde la página de Operaciones.
    """
    model = Combustible
    fk_name = 'operacion'
    extra = 0
    readonly_fields = ['cantidad_galones', 'costo_por_galon', 'subtotal', 'placa_vehiculo']
    # Quita 'readonly_fields' si quieres permitir edición en el inline.

@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    list_display = ('placa', 'anio', 'marca_modelo', 'kilometraje', 'ubicacion', 'costo')
    list_filter = ('anio', 'ubicacion')
    search_fields = ('placa',)
    list_editable = ('kilometraje', 'costo')
    
    def marca_modelo(self, obj):
        if obj.tarjetaVehiculo:
            return f"{obj.tarjetaVehiculo.marca} {obj.tarjetaVehiculo.modelo}"
        return "Sin tarjeta"
    marca_modelo.short_description = 'Marca/Modelo'
    

@admin.register(Operaciones)
class OperacionesAdmin(admin.ModelAdmin):
    """
    Configuración del admin para Operaciones.
    """
    list_display = [
        'id',
        'numero_documento',
        'ruc_proveedor',
        'nombre_proveedor',
        'tipo_operacion',
        'fecha',
        'descripcion',
    ]
    list_filter = ['tipo_operacion', 'fecha']
    readonly_fields = []             # Si quieres que 'fecha' sea solo lectura: pon ['fecha']
    date_hierarchy = 'fecha'         # Barra de navegación por año/mes/día usando el campo 'fecha'
    inlines = [ServicioInline, MantenimientoInline, CombustibleInline]
    search_fields = ['numero_documento', 'ruc_proveedor', 'nombre_proveedor']

@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    """
    Configuración del admin para Servicio (fuera de contexto de Operaciones).
    """
    list_display = [
        'id', 
        'descripcion_item',
        'costo_servicio',
        'placa_vehiculo',
        'operacion'
    ]
    list_filter = ['costo_servicio']
    readonly_fields = []   # Si quieres que “operacion” sea readonly, pon ['operacion']
    search_fields = ['descripcion_item']

@admin.register(Mantenimiento)
class MantenimientoAdmin(admin.ModelAdmin):
    """
    Configuración del admin para Mantenimiento.
    """
    list_display = [
        'id',
        'descripcion_item',
        'cantidad',
        'costo_unitario',
        'subtotal',
        'placa_vehiculo',
        'operacion'
    ]
    list_filter = ['fecha']  # si deseas filtrar por fecha, deberías haber un campo fecha; si no, elimina
    # En tu modelo Mantenimiento no definiste fechaMantenimiento, así que en list_filter
    # podrías filtrar por 'costoUnitario' o por otro campo que exista.
    list_filter = ['costo_unitario']
    readonly_fields = []  # Si quieres que "subTotal" sea solo lectura, pon ['subTotal']
    search_fields = ['descripcion_item']

@admin.register(Combustible)
class CombustibleAdmin(admin.ModelAdmin):
    """
    Configuración del admin para Combustible.
    """
    list_display = [
        'id',
        'cantidad_galones',
        'costo_por_galon',
        'subtotal',
        'placa_vehiculo',
        'operacion'
    ]
    list_filter = ['placa_vehiculo']
    readonly_fields = []   # Si quieres que "subTotal" sea solo lectura, pon ['subTotal']

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