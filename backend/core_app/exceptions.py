from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

DEFAULT_CODE_MAP = {
    400: "BAD_REQUEST",
    401: "UNAUTHENTICATED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    405: "METHOD_NOT_ALLOWED",
    413: "PAYLOAD_TOO_LARGE",
    429: "TOO_MANY_REQUESTS",
    500: "SERVER_ERROR",
}

def custom_exception_handler(exc, context):
    resp = exception_handler(exc, context)

    # No lo manejó DRF → 500 genérico unificado
    if resp is None:
        return Response({
            "detail": "Ha ocurrido un error inesperado. Intenta nuevamente.",
            "code": "SERVER_ERROR"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    data = resp.data

    # Validaciones → empaquetar como {detail, code, errors}
    if isinstance(exc, ValidationError):
        errors = data if isinstance(data, dict) else {"non_field_errors": data}
        resp.data = {
            "detail": "Por favor revisa los campos marcados.",
            "code": "VALIDATION_ERROR",
            "errors": errors
        }
        return resp

    # Otros errores → asegurar {detail, code}
    if isinstance(data, dict):
        detail = data.get("detail", "Ocurrió un error.")
        code = data.get("code", DEFAULT_CODE_MAP.get(resp.status_code, "ERROR"))
    else:
        detail = str(data)
        code = DEFAULT_CODE_MAP.get(resp.status_code, "ERROR")

    resp.data = {"detail": detail, "code": code}
    return resp