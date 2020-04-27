import axios from 'axios';

const url = '/api/stats/';

export default class StatsService {
    static getStats() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(url);
                if(response.status == 200) {
                    resolve(response.data);
                } else {
                    reject('Unable to retrieve statistics.');
                }
            } catch(err) {
                reject(err);
            }
        })
    }
}