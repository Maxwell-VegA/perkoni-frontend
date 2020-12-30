<template>
  <div>
    <user-chat v-if="$auth.loggedIn && !$auth.user.is_admin && chatStatus" />
    <admin-chat v-if="$auth.loggedIn && $auth.user.is_admin && chatStatus" />
  </div>
</template>

<script>
import UserChat from '~/components/UserChat.vue'
import AdminChat from '~/components/AdminChat.vue'
export default {
  components: { UserChat, AdminChat },
  data() {
    return {
      chatStatus: false,
      end_time: '1608913800000',
    }
  },
  computed: {},
  mounted() {
    this.watchChatStatus()
    this.expired()
  },
  methods: {
    expired() {
      const x = setInterval(() => {
        if (this.end_time < Date.now()) {
          this.chatStatus = false
        }
      }, 5000)
    },
    async watchChatStatus() {
      await this.$fire.firestore
        .collection(`chat`)
        .doc('room')
        .onSnapshot((doc) => {
          this.chatStatus = doc.data().chat_status
          this.end_time = doc.data().end_time
        })
    },
  },
}
</script>

<style></style>
