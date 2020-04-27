<template>
    <div class="chatbox">
        <div class="game-panel-title">Chat</div>
        <div class="chat-content">
            <div v-for="(message, index) in messages" v-bind:key="index" class="chat-message">
                <div class="chat-message-avatar">
                    <img :src="getAvatarUrl(message)" alt="">
                </div>
                <div class="chat-message-content">
                    <div class="chat-username">{{ message.username }}: </div>
                    <span>{{ message.message }}</span>
                </div>
            </div>
        </div>
        <div class="chat-form">
            <input v-model="messageInput" type="text" :disabled="!$store.state.loggedIn" @keyup.enter="sendMessage">
            <button @click="sendMessage">send</button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                messages: [],
                messageInput: ''
            };
        },
        updated() {
            let chatContent = document.getElementsByClassName('chat-content')[0];
            chatContent.scrollTop = chatContent.scrollHeight;
        },
        methods: {
            addChatMessage(chatMessage) {
                this.messages.push(chatMessage);
                console.log('Chat Message:', chatMessage);
            },
            sendMessage() {
                this.$socket.emit('chatMessage', localStorage.token, this.messageInput);
                this.messageInput = '';
            },
            getAvatarUrl(message) {
                return 'http://localhost:5000/avatars/' + ((message.avatar == 1) ? message.username : 'default') + '.png';
            }
        },
        socket: {
            events: {
                chatMessage(msg) {
                    this.addChatMessage(msg);
                }
            }
        }
    }
</script>

<style>
.chat-message .chat-username {
    display: inline-block;
    font-weight: bold;
    margin-right: 5px;
}

.chat-message-avatar {
    margin-right: 5px;
}

.chat-message {
    font-size: 0.9em;
    display: flex;
    flex-direction: row;
    font-family: Arial, Helvetica, sans-serif;
}

.chat-message:not(last-child) {
    margin-bottom: 5px;
}

.chat-message img {
    width: 30px;
    height: 30px;
    border: 1px solid #ccc;
}

.chat-content {
	height: 415px;
    overflow: auto;
}
</style>