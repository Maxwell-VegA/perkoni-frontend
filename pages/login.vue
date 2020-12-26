<template>
  <div>
    <p>please wait...</p>
    <p>{{ token }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: this.$route.query.token ? this.$route.query.token : null,
    }
  },
  mounted() {
    this.$auth
      .login('local', {
        data: {
          token: this.token,
        },
      })
      .catch((err) => {
        console.log(err)
      })
  },
}
</script>
