import axios from 'axios';
import store from './store';

const url = '/api/wallet/';

export default class WalletService {
    static generateAddress() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(url + 'generateaddress', {
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

    static withdraw(address, amount) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post(url + 'withdraw', {
                    address,
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
}