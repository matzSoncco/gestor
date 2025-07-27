from django.db.models.signals import post_save
from django.dispatch import receiver
from core_app.models import Empresa, Repuesto

@receiver(post_save, sender=Empresa)
def crear_repuestos_base(sender, instance: Empresa, created: bool, **kwargs):
    if not created:
        return  # Solo cuando se crea la empresa

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
            empresa=instance,
            descripcion=descripcion
        )