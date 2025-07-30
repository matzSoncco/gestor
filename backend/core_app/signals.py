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

    username = settings.ADMIN_USERNAME
    password = settings.ADMIN_PASSWORD

    if not CustomUser.objects.filter(username=username).exists():
        CustomUser.objects.create(
            username=username,
            password=make_password(password),
            is_superuser=True,
            is_staff=True,
            is_active=True,
            email='maxjuniorsmy@gmail.com',  # opcional
            empresa=None  # explícitamente sin empresa
        )
        print("Superadmin creado exitosamente.")
    else:
        print("Superadmin ya existe, no se creó de nuevo.")