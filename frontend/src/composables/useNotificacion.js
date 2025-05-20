import { ref } from "vue";

export function useNotificacion() {
    const mensaje = ref("");
    const tipoMensaje = ref("");

    function mostrarNotificacion(msg, severety = "success", duracion = 3000) {
        mensaje.value = msg;
        tipoMensaje.value = severety;
        setTimeout(() => {
            mensaje.value = "";
            tipoMensaje.value = "";
        }, duracion);
    }

    return {
        mensaje,
        tipoMensaje,
        mostrarNotificacion,
    };
}