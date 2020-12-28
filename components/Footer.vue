<template>
  <v-container>
    <v-row>
      <v-spacer></v-spacer>
      <v-col class="pb-8" cols="12" xl="9">
        <v-row no-gutters class="ml-lg-3">
          <v-col cols="12" sm="6" lg="3" style="display: grid">
            <nuxt-link class="accent--text my-1 text--lighten-4" to="/payments">
              Piegade un apmaksa
            </nuxt-link>
            <nuxt-link class="accent--text my-1 text--lighten-4" to="/terms">
              Noteikumi
            </nuxt-link>
            <nuxt-link class="accent--text my-1 text--lighten-4" to="/partners">
              Partneriem
            </nuxt-link>
            <nuxt-link class="accent--text my-1 text--lighten-4" to="/about">
              Par mums
            </nuxt-link>
            <nuxt-link class="accent--text my-1 text--lighten-4" to="/contacts">
              Kontakti
            </nuxt-link>
          </v-col>
          <v-spacer></v-spacer>
          <v-col sm="6" lg="3">
            <v-row no-gutters>
              <v-col class="mt-2 mt-md-0">
                <p class="mt-2 accent--text my-1 text--lighten-4">
                  E-pasts: veikals@9perkoni.lv
                </p>
                <p class="accent--text my-1 text--lighten-4">
                  GSM: +371 2979 2529 / Telegram, WhatsApp
                </p>
              </v-col>
              <v-col class="mt-4" align-self="center" cols="12">
                <div>
                  <a
                    target="_blank"
                    class="pr-2"
                    href="https://www.facebook.com/deviniperkoni"
                    ><v-icon size="30">mdi-facebook</v-icon>
                  </a>
                  <a
                    target="_blank"
                    class="pr-4"
                    href="https://www.instagram.com/deviniperkoni"
                    ><v-icon size="30">mdi-instagram</v-icon>
                  </a>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- 
            contacts
            terms of service
            shipping and payments

         -->
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-container>
</template>
