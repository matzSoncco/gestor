<template>
  <transition name="fade">
    <div v-if="show" class="modal-backdrop">
      <div class="modal-card" :class="tipo">
        <p>{{ mensaje }}</p>
        <button class="btn-close" @click="$emit('close')">Cerrar</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show:    { type: Boolean, default: false },
    mensaje: { type: String,  default: '' },
    tipo:    { type: String,  default: 'success' }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;           /* por encima de todo */
  pointer-events: all;     /* captura clics de fondo */
}

.modal-card {
  background: white;
  padding: 1.5rem;
  border-radius: .5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  max-width: 90vw;
  width: 320px;
  text-align: center;
}
.modal-card.error { border-top: 4px solid #e74c3c; }
.modal-card.success { border-top: 4px solid #2ecc71; }

.btn-close {
  margin-top: 1rem;
  padding: .5rem 1rem;
  background: #e74c3c;
  border: 1px solid currentColor;
  border-radius: .25rem;
  cursor: pointer;
}
</style>