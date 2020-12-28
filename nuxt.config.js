import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - Perkoni-Frontend',
    title: 'Perkoni-Frontend',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/firebase',
    // https://go.nuxtjs.dev/content
    // '@nuxt/content',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: "http://localhost:8000/api",
    credentials: true,
  },

  firebase: {
    config: {
        apiKey: 'AIzaSyBb8WzLvdnvpEM75oF-k1j4Vfo3IZFK5ew',
        authDomain: 'rt-chat-3902a.firebaseapp.com',
        projectId: 'rt-chat-3902a',
        storageBucket: 'rt-chat-3902a.appspot.com',
        messagingSenderId: '555688664693',
        appId: '1:555688664693:web:66c57dcfb4952ef8f0e23c',
        measurementId: 'G-BCQ2HLL4Y6',
    },
    services: {
      auth: false,
      firestore: true,
      analytics: true,
      messaging: true,
      performance: true,
    }
  },

  vue: {
    development: {
      config: {
        productionTip: false,
        devtools: true,
      }
    }
  },

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:8000/api/'
  },

  auth: {
    redirect: {
      home: '/vendor',
      logout: '/products',
      login: '/signin'
    },
  strategies: {
    local: {
      token: {
        property: 'token',
      },
      user: {
        property: 'user',
        // autoFetch: true
      },
      endpoints: {
        login: { url: '/auth/signin', method: 'post', propertyName: 'token'},
        logout: { url: '/auth/signout', method: 'post', propertyName: 'token'},
        user: { url: '/auth/user', method: 'get'}
      }
    },
  }
}
}
