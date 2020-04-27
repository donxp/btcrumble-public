<template>
    <div class="register-view">
        <div class="panel panel-padded">
            <div class="panel-title">Register</div>
            <div class="message-box">
                <p v-for="(item, index) in form_errors" v-bind:key="index" class="error-message">
                    {{item}}
                </p>
                <p class="success-message" v-if="success">
                    Registration was complete. You can now login.
                </p>
            </div>
            <form v-on:submit.prevent="register">
                <div class="register-form">
                    <input type="text" v-model="username" placeholder="Username">
                    <input type="text" v-model="email" placeholder="Email">
                    <input type="password" v-model="password" placeholder="Password">
                    <input type="password" v-model="password_confirm" placeholder="Confirm password">
                    <button @click="register">Register</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import AuthService from '../AuthService';

export default {
    data() {
        return {
            username: '',
            email: '',
            password: '',
            password_confirm: '',
            form_errors: [],
            success: false
        };
    },
    methods: {
        register() {
            this.form_errors = [];
            this.username = this.username.trim();
            if(this.username && this.email && this.password) {
                if(this.password != this.password_confirm) {
                    this.form_errors.push('Passwords do not match.');
                }
                if(this.username.length < 4) {
                    this.form_errors.push('Username must be at least 4 characters long.');
                }
                if(this.password.length < 6) {
                    this.form_errors.push('Password must be at least 4 characters long.');
                }
                if(this.form_errors.length == 0) {
                    AuthService.register(this.username, this.email, this.password, this.password_confirm)
                    .then((res) => {
                        if(res.success) {
                            this.success = true;
                            this.username = '';
                            this.email = '';
                            this.password = '';
                            this.password_confirm = '';
                        } else {
                            this.form_errors.push('Unable to register a new user');
                            console.log(res.message);
                        }
                    })
                    .catch(err => {
                        this.form_errors.push('Unable to register a new user');
                        console.log(err);
                    });
                } else {
                    console.log(this.form_errors);
                }
            } else {
                this.form_errors.push('Please complete all fields.');
            }
        }
    }
}
</script>
<style>
    .register-form {
        width: 35%;
        margin: 50px auto 0 auto;
        display: flex;
        flex-direction: column;
    }

    .register-form > * {
        margin-bottom: 30px;
    }

    .register-form input {
        height: 40px;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0 10px 0 10px;
    }

    .register-form button {
        background: #25b5fe;
        border: 0;
        transition: 0.5s;
        padding: 10px;
        color: #222;
        font-size: 0.9em;
        text-transform: uppercase;
        font-family: Arial, Helvetica, sans-serif;
    }

    .register-form button:hover {
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