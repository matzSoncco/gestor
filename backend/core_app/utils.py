from core_app.models import Empresa, Repuesto

def crear_repuestos_base_para_empresa(empresa: Empresa) -> None:
    base_items = [
        "Llanta",
        "Filtro de aceite",
        "Pastillas de freno",
        "Cambio de aceite",
        "Alineamiento",
        "Balanceo",
        "Revisión general",
        "Cambio de bujías",
        "Revisión de suspensión"
    ]

    for descripcion in base_items:
        Repuesto.objects.get_or_create(
            empresa=empresa,
            descripcion=descripcion
        )