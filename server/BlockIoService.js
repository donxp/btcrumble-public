const BlockIo = require('block_io');
const config = require('./config');

class BlockIoService {
    static getBlockIo() {
        return new BlockIo(config.block_io_api_key, config.block_io_pin);
    }

    static generateNewAddress(label) {
        return new Promise((resolve) => {
            BlockIoService.getBlockIo().get_new_address({'label': label}, function(err, res, body) {
                resolve(res);
            });
        });
    }

    static getAddressBalance(address) {
        return new Promise((resolve) => {
            BlockIoService.getBlockIo().get_address_balance({address}, resolve);
        });
    }

    static estimateFee(address, amount) {
        return new Promise((resolve) => {
            BlockIoService.getBlockIo().get_network_fee_estimate({'amounts': amount, 'to_addresses': address}, resolve);
        });
    }
}

module.exports = BlockIoService;