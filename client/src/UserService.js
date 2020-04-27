import axios from 'axios';
import store from './store';

const url = '/api/user/';

export default class UserService {
    static changePassword(currentPassword, newPassword, confirmNewPassword) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post(url + 'changepassword', {
                    currentPassword,
                    newPassword,
                    confirmNewPassword
                }, {
                    headers: {
                        'Authorization': store.state.auth_token
                    }
                });

                if(response.status == 200) {
                    resolve(response.data);
                } else {
                    reject('Request failed with status ' + response.status);
                }
            } catch(err) {
                reject(err);
            }
        });
    }

    static uploadAvatar(formData) {
        return new Promise(async(resolve, reject) => {
            try {
                const response = await axios.post(url + 'uploadavatar', formData, {
                    headers: {
                        'Authorization': store.state.auth_token,
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                if(response.status == 200) {
                    resolve(response.data);
                } else {
                    reject('Request failed with status ' + response.status);
                }
            } catch(err) {
                reject(err);
            }
        });
    }
}