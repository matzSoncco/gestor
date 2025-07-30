from django.contrib import admin
from core_app.models import Vehiculo, Servicio, Mantenimiento, Combustible, Operaciones, Repuesto, CustomUser, Empresa

class ServicioInline(admin.TabularInline):
    """
    Permite editar/visualizar el registro de Servicio directamente
    desde la página de cambio/creación de Operaciones.
    """
    model = Servicio
    fk_name = 'operacion'
    extra = 0
    readonly_fields = ['descripcion_item', 'subtotal']

class MantenimientoInline(admin.TabularInline):
    """
    Permite editar/visualizar el registro de Mantenimiento directamente
    desde la página de Operaciones.
    """
    model = Mantenimiento
    fk_name = 'operacion'
    extra = 0
    readonly_fields = ['repuesto', 'cantidad', 'costo_unitario', 'subtotal']

class CombustibleInline(admin.TabularInline):
    """
    Permite editar/visualizar el registro de Combustible directamente
    desde la página de Operaciones.
    """
    model = Combustible
    fk_name = 'operacion'
    extra = 0
    readonly_fields = ['cantidad_galones', 'costo_por_galon', 'subtotal']

@admin.register(Empresa)
class EmpresaAdmin(admin.ModelAdmin):
    list_display = ['id', 'razon_social', 'ruc']
    search_fields = ['razon_social', 'ruc']
    ordering = ['razon_social']
    list_filter = ['razon_social']

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'email', 'first_name', 'last_name', 'empresa']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['username']
    list_filter = ['empresa']

@admin.register(Repuesto)
class RepuestoAdmin(admin.ModelAdmin):
    list_display = ['id', 'descripcion', 'empresa']
    search_fields = ['descripcion']
    ordering = ['descripcion']

@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    # Columnas que se muestran en la lista de registros
    list_display = (
        'placa',
        'marca',
        'modelo',
        'anio',
        'kilometraje',
        'costo',
        'combustible',
    )
    # Filtros laterales
    list_filter = (
        'marca',
        'categoria',
        'combustible',
        'anio',
    )
    # Búsqueda por estos campos
    search_fields = (
        'placa',
        'vin',
        'serie_chasis',
        'marca',
        'modelo',
    )
    # Orden por defecto (puede omitirse porque lo definiste en Meta.ordering)
    ordering = ('placa',)

    # Agrupación de campos en el formulario de detalle
    fieldsets = (
        ('Datos básicos', {
            'fields': (
                'placa',
                'anio',
                'kilometraje',
                'costo',
            )
        }),
        ('Tarjeta del Vehículo', {
            'fields': (
                'categoria',
                'marca',
                'modelo',
                'version',
                'color',
                ('anio_fabricacion', 'anio_modelo'),
                'motor',
                'combustible',
                'forma_rodante',
                'vin',
                'serie_chasis',
                ('ejes', 'ruedas', 'pasajeros'),
                'carroceria',
            )
        }),
        ('Dimensiones y pesos', {
            'fields': (
                ('peso_neto', 'peso_bruto', 'carga_util'),
                ('cilindrada', 'cilindros'),
                ('altura', 'ancho', 'longitud'),
            )
        }),
    )

    # Campos de sólo lectura (si los tuvieras)
    readonly_fields = ()

    # Número de elementos por página
    list_per_page = 25
    

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
        'subtotal',
        'placa_vehiculo',
        'operacion'
    ]
    list_filter = ['placa_vehiculo']
    readonly_fields = ['subtotal']
    search_fields = ['descripcion_item']

@admin.register(Mantenimiento)
class MantenimientoAdmin(admin.ModelAdmin):
    """
    Configuración del admin para Mantenimiento.
    """
    list_display = [
        'id',
        'repuesto',
        'cantidad',
        'costo_unitario',
        'subtotal',
        'placa_vehiculo',
        'operacion'
    ]
    list_filter = ['placa_vehiculo']
    readonly_fields = ['subtotal']
    search_fields = ['repuesto']

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
        'operacion',
        'ubicacion'
    ]
    list_filter = ['placa_vehiculo']
    readonly_fields = ['subtotal']

# Personalización del sitio de administración
admin.site.site_header = "Administración de Vehículos"
admin.site.site_title = "Panel de Control"
admin.site.index_title = "Gestión de Vehículos y Operaciones"