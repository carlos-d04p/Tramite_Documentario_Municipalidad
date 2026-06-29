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
        <h3 class="login-title">Seguimiento de hoja de ruta</h3>
        <button type="button" @click.stop="dialog = false" class="btn-close">
          <v-icon size="18" color="rgba(255,255,255,0.6)">mdi-close</v-icon>
        </button>
      </div>

      <div class="login-body">
        <div class="logo-wrapper">
          <img src="/img/escudo.png" alt="Escudo La Victoria" class="login-logo" />
        </div>
        <div class="text-center font-weight-bold" style="font-size: 13px; text-transform: uppercase;">
          MUNICIPALIDAD DE LA VICTORIA
        </div>

        <validation-observer ref="searchbserver" v-slot="{ invalid }">
          <form @submit.prevent="submit" class="login-form">
            <validation-provider v-slot="{ errors }" name="code" rules="required|min:3">
              <div class="input-group" v-if="timeline.length == 0">
                <label class="input-label">Código de hoja de ruta</label>
                <div class="input-wrapper">
                  <v-icon class="input-icon" size="16">mdi-barcode-scan</v-icon>
                  <input type="text" v-model="searchForm.code" placeholder="Ingrese el código" class="custom-input" autofocus />
                </div>
                <span class="error-text" v-if="errors[0]">{{ errors[0] }}</span>
              </div>
              
              <v-simple-table class="mt-3" v-else>
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <td class="text-right text-caption text-sm-caption text-md-body-2 text-lg-body-1 text-xl-body-1">Hoja de ruta: </td>
                      <td class="font-weight-bold text-caption text-sm-caption text-md-body-2 text-lg-body-1 text-xl-body-1">{{ procedure.code }}</td>
                    </tr>
                    <tr>
                      <td class="text-right text-caption text-sm-caption text-md-body-2 text-lg-body-1 text-xl-body-1">Tipo de trámite: </td>
                      <td class="font-weight-bold text-caption text-sm-caption text-md-body-2 text-lg-body-1 text-xl-body-1">{{ procedure.procedure_type.name }}</td>
                    </tr>
                    <tr>
                      <td class="text-right text-caption text-sm-caption text-md-body-2 text-lg-body-1 text-xl-body-1">Nombre: </td>
                      <td class="font-weight-bold text-caption text-sm-caption text-md-body-2 text-lg-body-1 text-xl-body-1">{{ procedure.origin }}</td>
                    </tr>
                    <tr>
                      <td class="text-right text-caption text-sm-caption text-md-body-2 text-lg-body-1 text-xl-body-1">Su trámite se encuentra en: </td>
                      <td class="font-weight-bold text-caption text-sm-caption text-md-body-2 text-lg-body-1 text-xl-body-1">{{ timeline[0].to_area }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </validation-provider>

            <v-divider v-if="timeline.length > 0" class="my-4"></v-divider>
            <div class="text-center mb-4 text-subtitle-2 font-weight-bold" v-if="timeline.length > 0">
              Detalle de derivaciones
            </div>
            <Timeline :timeline="timeline" v-if="timeline.length > 0"/>

            <button type="submit" :disabled="invalid || loading" class="btn-submit mt-3" v-if="timeline.length == 0">
              <v-icon size="16" color="white" class="mr-2">mdi-magnify</v-icon> Buscar
            </button>
            <button type="button" @click.stop="showDialog" :disabled="loading" class="btn-submit mt-3" v-else>
              <v-icon size="16" color="white" class="mr-2">mdi-autorenew</v-icon> Nueva búsqueda
            </button>
          </form>
        </validation-observer>
      </div>

      <div class="login-footer-gradient"></div>
    </div>
  </v-dialog>
</template>

<script>
import Timeline from '@/components/shared/Timeline'

export default {
  name: 'SearchCode',
  components: {
    Timeline,
  },
  data: function() {
    return {
      dialog: false,
      timeline: [],
      procedure: {
        id: null
      },
      searchForm: {
        code: '',
      },
      loading: false,
    }
  },
  computed: {
    imageHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '80px'
        case 'sm': return '110px'
        case 'md': return '140px'
        default: return '150'
      }
    },
  },
  methods: {
    showDialog() {
      this.timeline = []
      this.procedure = {
        id: null
      }
      this.searchForm = {
        code: '',
      }
      this.dialog = true
      this.$nextTick(() => {
        this.$refs.searchbserver.reset()
      })
    },
    async submit() {
      try {
        let valid = await this.$refs.searchbserver.validate()
        if (valid) {
          this.loading = true
          await axios.get('sanctum/csrf-cookie')
          let response = await axios.get(`procedure_code`, {
            params: {
              code: this.searchForm.code
            }
          })
          this.procedure = response.data.payload.procedure
          response = await axios.get(`tracking/${response.data.payload.procedure.id}`)
          this.timeline = response.data.payload.timeline
        }
      } catch(error) {
        if ('errors' in error.response.data) {
          this.$refs.searchbserver.setErrors(error.response.data.errors)
        }
      } finally {
        this.loading = false
      }
    },
  }
}
</script>

<style lang="css" scoped>
tr:hover {
  background-color: transparent !important;
}

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
  display: flex;
  align-items: center;
  justify-content: center;
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