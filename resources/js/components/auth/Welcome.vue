<template>
  <v-app id="welcome">
    <div class="landing-wrapper">
      <div class="bg-image"></div>
      <div class="bg-overlay"></div>

      <div class="landing-content">
        <div class="logo-container">
          <img src="/img/escudo.png" alt="Escudo Distrito de La Victoria" class="logo-img" />
        </div>

        <div class="text-container">
          <p class="subtitle">Municipalidad Distrital de</p>
          <h1 class="title">LA VICTORIA</h1>
          <div class="divider"></div>
          <h2 class="description">Gestión Documental y Control<br/>de Correspondencia</h2>
        </div>

        <div class="button-container">
          <button @click.stop="$refs.dialogLogin.showDialog()" class="btn-primary">Iniciar Sesión</button>
          <button @click.stop="$refs.dialogSearchCode.showDialog()" class="btn-secondary">Consultar Trámite</button>
        </div>
      </div>
    </div>
    <Login ref="dialogLogin"/>
    <SearchCode ref="dialogSearchCode"/>
  </v-app>
</template>

<script>
import Login from '@/components/auth/Login'
import SearchCode from '@/components/auth/SearchCode'

export default {
  name: 'Welcome',
  components: {
    Login,
    SearchCode,
  },
  data: function() {
    return {
      dialogLogin: false,
    }
  },
  computed: {
    imageWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '120px'
        case 'sm': return '200px'
        case 'md': return '250px'
        default: return '350'
      }
    },
    logoTextFont() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 'font-weight-light'
        case 'sm': return 'font-weight-light'
        default: return 'font-weight-normal'
      }
    },
    marginTopColumn1() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '0px'
        case 'sm': return '60px'
        case 'md': return '125px'
        case 'lg': return '125px'
        case 'xl': return '125px'
        default: return '0px'
      }
    },
    marginTopColumn2() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '0px'
        case 'sm': return '-35px'
        case 'md': return '-25px'
        case 'lg': return '-100px'
        case 'xl': return '-100px'
        default: return '0px'
      }
    },
    marginTopColumn3() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '0px'
        case 'sm': return '184px'
        case 'md': return '233px'
        case 'lg': return '273px'
        case 'xl': return '300px'
        default: return '0px'
      }
    },
  },
  methods: {
    async login() {
      try {
        let valid = await this.$refs.loginObserver.validate()
        if (valid) {
          this.loading = true
          await axios.get('sanctum/csrf-cookie')
          await this.$store.dispatch('login', this.loginForm)
          this.loading = false
          this.$router.push({
            name: 'welcome'
          })
        }
      } catch(error) {
        this.loginForm.password = ''
        this.$refs.loginObserver.reset()
        if ('errors' in error.response.data) {
          this.$refs.loginObserver.setErrors(error.response.data.errors)
        }
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
#welcome {
  background-color: var(--v-background-base);
}

.landing-wrapper {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: system-ui, -apple-system, sans-serif;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/img/parque.png');
  background-size: cover;
  background-position: center;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(30,45,78,0.90) 0%, rgba(26,26,46,0.82) 55%, rgba(155,28,28,0.55) 100%);
}

.landing-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 0 1rem;
}

.logo-container {
  width: 7rem;
  height: 7rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.25);
  padding: 0.375rem;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.text-container {
  text-align: center;
  max-width: 32rem;
}

.subtitle {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.title {
  color: white;
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: 0.025em;
  margin-bottom: 0.75rem;
  text-shadow: 0 2px 16px rgba(0,0,0,0.5);
  line-height: 1.1;
}
@media (min-width: 768px) {
  .title {
    font-size: 3rem;
  }
}

.divider {
  width: 5rem;
  height: 2px;
  margin: 0 auto 1rem auto;
  border-radius: 9999px;
  background: linear-gradient(90deg, transparent, #C9A227, transparent);
}

.description {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  line-height: 1.625;
}
@media (min-width: 768px) {
  .description {
    font-size: 1rem;
  }
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
@media (min-width: 640px) {
  .button-container {
    flex-direction: row;
  }
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 2.5rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 0.375rem;
  transition: all 0.3s;
  min-width: 190px;
  cursor: pointer;
  outline: none;
}

.btn-primary {
  background-color: #9B1C1C;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: none;
}
.btn-primary:hover {
  opacity: 0.9;
  transform: scale(1.05);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.btn-secondary {
  background-color: transparent;
  border: 2px solid rgba(255, 255, 255, 0.35);
}
.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}
</style>