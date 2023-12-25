// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    // The private keys which are only available server-side
    // apiSecret: "123",
    // Keys within public are also exposed client-side
    public: {
      // apiBase: "/api",
    },
  },
  components: {
    global: true,
    dirs: ["~/components"],
  },
  modules: ['@nuxt/ui', '@nuxtjs/tailwindcss', 'nuxt-icon'],
  ui: {
    global: true,
    // icons: ['mdi', 'simple-icons']
  }
});
