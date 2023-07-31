<template>
  <div class="fullscreen bg-dark text-white q-pa-md flex flex-center">
    <div class="error-container">
      <div class="error-heading">
        <h1 class="text-h1">404</h1>
      </div>

      <div class="error-message">
        <p class="text-h5">Oops. No existe Nada por aquí!!</p>
        <span class="emoji">🏜️</span>
      </div>

      <div class="error-button">
        <q-btn
          color="secondary"
          unelevated
          to="/"
          label="Go Home"
          no-caps
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>

<style scoped>
.fullscreen {
  height: 100vh;
  width: 100vw;
}

.bg-dark {
  background-color: #333333; /* Color de fondo oscuro */
}

.text-white {
  color: #ffffff; /* Texto en blanco */
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-heading {
  font-size: 10rem;
}

.error-message {
  text-align: center;
}

.error-message .emoji {
  font-size: 6rem; /* Aumentar el tamaño del emoji a 6rem */
}

.error-button {
  margin-top: 1.5rem;
}

.q-btn {
  font-size: 1.2rem;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  width: 200px;
  transition: background-color 0.2s;
}

.q-btn:hover {
  background-color: #444444; /* Efecto de hover en gris oscuro */
}

@media (max-width: 768px) {
  /* Estilos para pantallas más pequeñas (responsive) */
  .error-heading {
    font-size: 6rem;
  }

  .q-btn {
    width: 150px;
  }
}
</style>
