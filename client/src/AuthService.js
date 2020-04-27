import axios from 'axios';

const url = '/api/auth/';

export default class AuthService {
    static logout(store) {
        store.state.loggedIn = false;
        store.state.username = '';
        store.state.auth_token = '';
        localStorage.token = '';
    }

    static verify(token) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(url + 'verify', {
                    headers: {
                        'Authorization': token
                    }
                });
                if(response.status == 200) {
                    resolve(response.data);
                } else {
                    reject('Request failed with status ' + response.status);
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    static login(username, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post(url + 'login', {
                    username,
                    password
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

    static register(username, email, password, password_confirm) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post(url + 'register', {
                    username,
                    email,
                    password,
                    password_confirm
                });
                console.log('Response', response);
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