from django.db.models.signals import post_save, post_migrate
from django.dispatch import receiver
from django.contrib.auth.hashers import make_password
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

@receiver(post_migrate)
def crear_superadmin(sender, **kwargs):
    from core_app.models import CustomUser

    if not CustomUser.objects.filter(username='maxadmin').exists():
        CustomUser.objects.create(
            username='maxadmin',
            password=make_password('s3cret0Max123'),
            is_superuser=True,
            is_staff=True,
            email='admin@example.com',  # opcional
            empresa=None  # explícitamente sin empresa
        )
        print("Superadmin 'maxadmin' creado exitosamente.")
    else:
        print("Superadmin 'maxadmin' ya existe, no se creó de nuevo.")