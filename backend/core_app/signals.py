from django.db.models.signals import post_save, post_migrate
from django.dispatch import receiver
from django.contrib.auth.hashers import make_password
from core_app.models import Empresa, Repuesto
from django.conf import settings
from core_app.utils import crear_repuestos_base_para_empresa

@receiver(post_save, sender=Empresa)
def crear_repuestos_base(sender, instance: Empresa, created: bool, **kwargs):
    if not created:
        return
    crear_repuestos_base_para_empresa(instance)

@receiver(post_migrate)
def crear_superadmin(sender, **kwargs):
    from core_app.models import CustomUser

    if not CustomUser.objects.filter(username='ADMIN_USERNAME').exists():
        CustomUser.objects.create(
            username='ADMIN_USERNAME',
            password=make_password('ADMIN_PASSWORD'),
            is_superuser=True,
            is_staff=True,
            email='maxjuniorsmy@gmail.com',  # opcional
            empresa=None  # explícitamente sin empresa
        )
        print("Superadmin creado exitosamente.")
    else:
        print("Superadmin ya existe, no se creó de nuevo.")