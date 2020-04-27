const axios = require('axios');
const config = require('./config');
const url = config.socket_service_url + ':' + config.socket_service_api_port + '/';
const serviceSecret = config.socket_service_secret;

class SocketService {
    static broadcastBet(username, avatar, amount, potTimeleft) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post(url + 'jackpot/broadcastbet', {
                    username,
                    avatar,
                    amount,
                    potTimeleft
                }, {
                    headers: {
                        'Authorization': serviceSecret
                    }
                });

                if(response.status == 200) {
                    resolve(response.data);
                } else {
                    reject('Bad status code from broadcastbet');
                }
            } catch(err) {
                reject(err);
            }
        })
    }
}

module.exports = SocketService;