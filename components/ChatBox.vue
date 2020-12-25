<template>
  <div>
    <chat-app v-if="$auth.loggedIn && !$auth.user.is_admin && chatStatus" />
    <admin-chat v-if="$auth.loggedIn && $auth.user.is_admin && chatStatus" />
  </div>
</template>

<script>
import ChatApp from '~/components/ChatApp.vue'
import AdminChat from '~/components/AdminChat.vue'
export default {
  components: { ChatApp, AdminChat },
  data() {
    return {
      chatStatus: false,
      end_time: '1608913800000',
    }
  },
  mounted() {
    this.watchChatStatus()
  },
  methods: {
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
