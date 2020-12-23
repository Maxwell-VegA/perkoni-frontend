<template>
  <v-row>
    <v-spacer />
    <v-col cols="12" xl="9">
      <v-carousel
        vertical-delimiters="right"
        continuous
        :show-arrows-on-hover="true"
        vertical
        cycle
        hide-delimiter-background
        interval="1113000"
      >
        <v-carousel-item v-for="slide in slides" :key="slide.index">
          <v-img
            :src="slide.image"
            style="top: 50%; transform: translateY(-50%)"
          >
          </v-img>
          <v-btn
            absolute
            bottom
            right
            :class="{ 'light-btn-bg': slide.light }"
            class="glass-btn font-weight-light text-h4 rounded-lg v-btn--outlined py-9 px-15 ma-12"
            >{{ slide.text }}</v-btn
          >
        </v-carousel-item>
      </v-carousel>
    </v-col>
    <v-spacer />
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      slides: [
        {
          image: 'DSC_0068-6.jpg',
          text: 'Novembra cepure',
          light: true,
          index: 0,
        },
        {
          image: 'IMG_00.jpg',
          text: 'Uzlimju redaktors',
          light: false,
          index: 1,
        },
        {
          image: 'DSC_0244-Edit.jpg',
          text: 'Lieldienu uzlimes',
          light: false,
          index: 2,
        },
        {
          image: 'DSC_0231.jpg',
          text: 'Dzemperis "Latvija"',
          light: true,
          index: 3,
        },
      ],
    }
  },
}
</script>

<style scoped>
.glass-btn {
  background: rgba(15, 15, 15, 0.2);
  backdrop-filter: blur(7px);
  border: solid 2px transparent;
  background-clip: padding-box;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.2);
}
.light-btn-bg {
  background: rgba(255, 255, 255, 0.2);
}
</style>
