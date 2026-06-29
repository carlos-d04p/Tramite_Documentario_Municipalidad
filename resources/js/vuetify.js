import Vue from 'vue'
import Vuetify from 'vuetify'
import VuetifyToast from 'vuetify-toast-snackbar'
import es from 'vuetify/src/locale/es.ts'

Vue.use(Vuetify)

const vuetify = new Vuetify({
  lang: {
    locales: { es },
    current: 'es',
  },
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    dark: false,
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#1A1A2E',
        secondary: '#1E2D4E',
        tertiary: '#eae4e1',
        accent: '#C9A227',
        error: '#9B1C1C',
        background: '#1A1A2E',
      },
    },
  },
})

Vue.use(VuetifyToast, {
  $vuetify: vuetify.framework,
  timeout: 5000,
  x: 'center',
  y: 'top',
})

export default vuetify