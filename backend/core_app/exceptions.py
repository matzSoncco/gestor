from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status as drf_status
from rest_framework.exceptions import (
    ValidationError, NotAuthenticated, AuthenticationFailed,
    PermissionDenied, NotFound, MethodNotAllowed
)

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


# Asignación explícita por tipo de excepción (sobrescribe default_code)
EXC_CODE_MAP = {
    NotAuthenticated: "UNAUTHENTICATED",
    AuthenticationFailed: "UNAUTHENTICATED",
    PermissionDenied: "FORBIDDEN",
    NotFound: "NOT_FOUND",
    MethodNotAllowed: "METHOD_NOT_ALLOWED",
}

NON_FIELD_KEY = "non_field_errors"

def _code_for(exc, status_code: int) -> str:
    # Prioriza mapeo por clase
    for klass, code in EXC_CODE_MAP.items():
        if isinstance(exc, klass):
            return code
    # Luego default_code de DRF (upper)
    default_code = getattr(exc, "default_code", None)
    if default_code:
        return str(default_code).upper()
    # Finalmente por status
    return DEFAULT_CODE_MAP.get(status_code, "ERROR")

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    # Errores no manejados por DRF → 500
    if response is None:
        status_code = drf_status.HTTP_500_INTERNAL_SERVER_ERROR
        return Response({
            "status": status_code,
            "code": "SERVER_ERROR",
            "detail": "Ha ocurrido un error inesperado. Intenta nuevamente.",
            "errors": None
        }, status=status_code)

    status_code = response.status_code
    data = response.data

    # Validaciones → forzar dict y usar NON_FIELD_KEY si viene lista/str
    if isinstance(exc, ValidationError):
        if isinstance(data, dict):
            errors = data
        elif isinstance(data, list):
            errors = {NON_FIELD_KEY: data}
        else:
            errors = {NON_FIELD_KEY: [str(data)]}

        response.data = {
            "status": status_code,
            "code": "VALIDATION_ERROR",
            "detail": "Por favor revisa los campos marcados.",
            "errors": errors
        }
        return response

    # Resto de errores → mantener shape fijo
    if isinstance(data, dict):
        detail = data.get("detail") or str(exc) or "Ocurrió un error."
    else:
        detail = str(data) if data is not None else "Ocurrió un error."

    response.data = {
        "status": status_code,
        "code": _code_for(exc, status_code),
        "detail": detail,
        "errors": None
    }
    return response