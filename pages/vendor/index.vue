<template>
  <div>
    <h2>{{ $auth.user.username }}</h2>
    <section>Overview</section>
    <!-- Make this a kind of overview section showing things like the most important statistics, unfulfilled orders, messages/notifications -->
    <v-btn to="products/create">Jauns Produkts</v-btn>
  </div>
</template>

<script>
export default {
  layout: 'vendor',
}
</script>

<style></style>
