<template>
  <div>
    <call-to-action></call-to-action>
    <v-color-picker
      dot-size="25"
      mode="hexa"
      show-swatches
      swatches-max-height="250"
    ></v-color-picker>
  </div>
</template>
<script>
import callToAction from '@/components/callToAction'
export default {
  components: { callToAction },
}
</script>

<style></style>
