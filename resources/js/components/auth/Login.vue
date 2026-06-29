<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600"
    @keydown.esc="dialog = false"
  >
    <div class="login-card">
      <v-progress-linear v-if="loading" indeterminate color="#9B1C1C" height="4" class="loading-bar"></v-progress-linear>

      <div class="login-header">
        <h3 class="login-title">Bienvenido</h3>
        <button type="button" @click.stop="dialog = false" class="btn-close">
          <v-icon size="18" color="rgba(255,255,255,0.6)">mdi-close</v-icon>
        </button>
      </div>

      <div class="login-body">
        <div class="logo-wrapper">
          <img src="/img/escudo.png" alt="Escudo La Victoria" class="login-logo" />
        </div>

        <validation-observer ref="loginObserver" v-slot="{ invalid }">
          <form @submit.prevent="submit" class="login-form">
            <validation-provider v-slot="{ errors }" name="username" rules="required|min:3">
              <div class="input-group">
                <label class="input-label">Usuario</label>
                <div class="input-wrapper">
                  <v-icon class="input-icon" size="16">mdi-account</v-icon>
                  <input type="text" v-model="loginForm.username" placeholder="Ingrese su usuario" class="custom-input" autofocus />
                </div>
                <span class="error-text" v-if="errors[0]">{{ errors[0] }}</span>
              </div>
            </validation-provider>

            <validation-provider v-slot="{ errors }" name="password" rules="required|min:4">
              <div class="input-group">
                <label class="input-label">Contraseña</label>
                <div class="input-wrapper">
                  <v-icon class="input-icon" size="16">mdi-lock</v-icon>
                  <input :type="shadowPassword ? 'password' : 'text'" v-model="loginForm.password" placeholder="••••••••" class="custom-input" />
                  <button type="button" class="btn-toggle-password" @click="shadowPassword = !shadowPassword">
                    <v-icon size="16">{{ shadowPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                  </button>
                </div>
                <span class="error-text" v-if="errors[0]">{{ errors[0] }}</span>
              </div>
            </validation-provider>

            <button type="submit" :disabled="invalid || loading" class="btn-submit">
              Ingresar
            </button>
          </form>
        </validation-observer>
      </div>

      <div class="login-footer-gradient"></div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'Login',
  data: function() {
    return {
      dialog: false,
      shadowPassword: true,
      loginForm: {
        username: '',
        password: '',
      },
      loading: false,
    }
  },
  computed: {
    imageHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '70px'
        case 'sm': return '110px'
        case 'md': return '130px'
        default: return '140'
      }
    },
  },
  methods: {
    showDialog() {
      this.loginForm = {
        username: '',
        password: '',
      }
      this.dialog = true
      this.$nextTick(() => {
        this.$refs.loginObserver.reset()
      })
    },
    async submit() {
      try {
        let valid = await this.$refs.loginObserver.validate()
        if (valid) {
          this.loading = true
          await axios.get('sanctum/csrf-cookie')
          await this.$store.dispatch('login', this.loginForm)
          this.$router.push({
            name: this.$store.getters.user.isAdmin ? 'users' : 'procedures'
          })
        }
      } catch(error) {
        this.loginForm.password = ''
        this.$refs.loginObserver.reset()
        if ('errors' in error.response.data) {
          this.$refs.loginObserver.setErrors(error.response.data.errors)
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.login-card {
  position: relative;
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  font-family: system-ui, -apple-system, sans-serif;
}

.loading-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  margin: 0;
}

.login-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background-color: #1E2D4E;
}

.login-title {
  color: white;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.025em;
  margin: 0;
}

.btn-close {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-close:hover .v-icon {
  color: white !important;
}

.login-body {
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.logo-wrapper {
  width: 6rem;
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.25rem;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af !important;
}

.custom-input {
  width: 100%;
  padding: 0.625rem 2.5rem;
  font-size: 0.875rem;
  border: none;
  border-bottom: 2px solid #e5e7eb;
  background-color: #f9fafb;
  border-radius: 0.25rem 0.25rem 0 0;
  outline: none;
  transition: border-color 0.2s;
}
.custom-input:focus {
  border-bottom-color: #9B1C1C;
}

.btn-toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: #9ca3af;
}
.btn-toggle-password:hover {
  color: #4b5563;
}

.error-text {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background-color: #9B1C1C;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 0.25rem;
}
.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
}
.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-footer-gradient {
  height: 0.25rem;
  width: 100%;
  background: linear-gradient(90deg, #9B1C1C 0%, #C9A227 50%, #1E2D4E 100%);
}
</style>