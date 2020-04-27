import axios from 'axios';
import store from './store';

const url = '/api/game/';

export default class GameService {
    static deposit(amount) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post(url + 'deposit', {
                    amount
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

    static getCurrentPot() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(url + 'currentpot', {
                    headers: {
                        'Authorization': store.state.auth_token
                    }
                });

                if(response.status == 200) {
                    if(response.data.success) {
                        resolve(response.data);
                    } else {
                        reject("Not successful, " + response.data.message);
                    }
                } else {
                    reject('getCurrentPot request failed with status ' + response.status);
                }
            } catch(err) {
                reject(err);
            }
        });
    }
}