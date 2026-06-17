/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          'background': '#f9f2f2',
          'surface': '#FFFFFF',
          'primary': '#ad4553',
          'primary-darken-1': '#3700B3',
          'secondary': '#8a8a8a',
          'secondary-darken-1': '#018786',
          'error': '#B00020',
          'info': '#2196F3',
          'success': '#4CAF50',
          'warning': '#FB8C00',
        },
      },
    },
  },
})
