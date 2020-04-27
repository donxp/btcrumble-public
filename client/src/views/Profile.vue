<template>
    <div class="profile-view">
        <div class="panel panel-padded">
            <div class="panel-title">Profile</div>

            <div class="profile-change-password">
                <h3>Change password</h3>
                <div class="message-status-box message-status-box-error" v-if="error != ''">
                    <p>{{ error }}</p>
                </div>
                <div class="message-status-box message-status-box-success" v-if="success != ''">
                    <p>{{ success }}</p>
                </div>
                <form v-on:submit.prevent="changePassword">
                    <input v-model="currentPassword" type="password" placeholder="Current password">
                    <input v-model="newPassword" type="password" placeholder="New password">
                    <input v-model="confirmNewPassword" type="password" placeholder="Confirm new password">
                    <button>Change password</button>
                </form>
            </div>

            <div class="profile-upload-avatar">
                <h3>Upload avatar</h3>
                <div class="message-status-box message-status-box-error" v-if="avatarError != ''">
                    <p>{{ avatarError }}</p>
                </div>
                <div class="message-status-box message-status-box-success" v-if="avatarSuccess != ''">
                    <p>{{ avatarSuccess }}</p>
                </div>
                <form v-on:submit.prevent="uploadAvatar" enctype="multipart/form-data">
                    <input name="avatar" type="file" @change="assignAvatar($event)">
                    <button>Upload avatar</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import UserService from '../UserService';
    export default {
        data() {
            return {
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
                error: '',
                success: '',
                avatarError: '',
                avatarSuccess: '',
                avatarFile: null
            }
        },
        methods: {
            changePassword() {
                if(!(this.currentPassword && this.newPassword && this.confirmNewPassword))
                {
                    this.error = 'All fields are required.';
                    return;
                }
                if(this.currentPassword.length < 6 || this.newPassword.length < 6 || this.confirmNewPassword.length < 6)
                {
                    this.error = 'Password must be at least 6 characters long.';
                    return;
                }
                if(this.newPassword != this.confirmNewPassword)
                {
                    this.error = 'Confirmation password is different.';
                    return;
                }
                this.error = '';

                UserService.changePassword(this.currentPassword, this.newPassword, this.confirmNewPassword)
                    .then(data => {
                        if(data.success) {
                            this.success = 'Password was changed.';
                        } else {
                            this.error = data.message;
                        }
                    }).catch(err => {
                        this.error = err;
                    });

                
            },
            assignAvatar(event) {
                this.avatarError = '';

                let fileRegex = /[A-z]+\.(jpg|jpeg|png)$/;
                let avatar = event.target.files[0];

                if(fileRegex.test(avatar.name)) {
                    this.avatarFile = avatar;
                } else {
                    this.avatarError = 'Selected file is not of image type.';
                }
            },
            uploadAvatar() {
                if(this.avatarFile == null) return;

                let formData = new FormData();
                formData.append('avatar', this.avatarFile);

                UserService.uploadAvatar(formData).then(response => {
                    console.log('Got respose from upload avatar:', response);
                    this.avatarSuccess = 'Uploaded avatar.';
                });
                console.log('Uploading avatar');
            }
        }
    }
</script>

<style>
    .profile-change-password {
        margin: 0 auto;
        width: 500px;
        margin-bottom: 50px;
    }

    .profile-change-password h3 {
        text-align: center;
    }

    .profile-change-password form {
        display: flex;
        flex-direction: column;
    }
    
    .profile-change-password form input {
        display: block;
        border: 1px solid #ccc;
        margin-bottom: 10px;
        height: 40px;
        width: 100%;
        padding: 0 10px 0 10px;
        border-radius: 4px;
    }

    .profile-change-password form button {
        background: #25b5fe;
        border: 0;
        border-radius: 6px;
        padding: 10px;
        color: #fff;
        font-size: 0.9em;
        text-transform: uppercase;
        font-family: Arial, Helvetica, sans-serif;
        width: calc(100% + 20px)
    }

    .profile-upload-avatar {
        width: 400px;
        margin: 0 auto;
    }

    .profile-upload-avatar h3 {
        text-align: center;
    }

    .message-status-box {
        margin-bottom: 30px;
        padding: 10px 10px;
        width: calc(100%);
        font-size: 0.9em;
        transition: 1.0s;
    }

    .message-status-box-error {
        border: 1px solid red;
    }

    .message-status-box-success {
        border: 1px solid green;
    }
</style>