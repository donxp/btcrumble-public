<template>
    <div class="login-view">
        <div class="panel panel-padded">
            <div class="panel-title">Login</div>
            <div class="message-box">
                <p v-for="(item, index) in errors" v-bind:key="index" class="error-message">
                    {{item}}
                </p>
            </div>
            <form v-on:submit.prevent="login">
                <div class="login-form">
                    <input type="text" v-model="username" placeholder="Username">
                    <input type="password" v-model="password" placeholder="Password">
                    <button @click="login">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import AuthService from '../AuthService';
import store from '../store';

export default {
    data() {
        return {
            username: '',
            password: '',
            errors: []
        };
    },
    created() {
    },
    methods: {
        login() {
            this.errors = [];
            if(this.username && this.password) {
                AuthService.login(this.username, this.password)
                .then(res => {
                    if(res.success) {
                        console.log('Logged in', res.balance);
                        store.state.auth_token = res.token;
                        store.state.username = res.username;
                        store.state.balance = res.balance;
                        store.state.depositAddress = res.depositAddress;
                        store.state.loggedIn = true;
                        localStorage.token = res.token;
                        this.$router.push({name: 'home'});
                    } else {
                        console.log(res.message);
                    }
                }).catch((err) => {
                    this.errors.push('Unable to login with provided details.');
                    console.log(err);
                })
            } else {
                this.errors.push('Please complete all fields.');
            }
        }
    }
}
</script>

<style>
    .login-form {
        width: 35%;
        margin: 50px auto 0 auto;
        display: flex;
        flex-direction: column;
    }

    .login-form > * {
        margin-bottom: 30px;
    }

    .login-form input {
        height: 40px;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0 10px 0 10px;
    }

    .login-form button {
        background: #25b5fe;
        border: 0;
        transition: 0.5s;
        padding: 10px;
        color: #222;
        font-size: 0.9em;
        text-transform: uppercase;
        font-family: Arial, Helvetica, sans-serif;
    }

    .login-form button:hover {
        background: #2196d2;
        color: #000;
    }

    .message-box {
        text-align: center;
        margin-top: 20px;
    }

    .message-box p {
        margin: 0;
    }

    .error-message {
        color: red;
    }

    .success-message {
        color: green;
    }
</style>