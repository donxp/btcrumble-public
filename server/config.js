module.exports = {
    jwt_secret: 'secret',
    socket_service_port: 3000,
    socket_service_url: 'http://localhost',
    socket_service_api_port: 5001,
    socket_service_secret: 'SaG9PXm1Aoy4NQmnufFU',
    jackpot_round_time: 90,
    jackpot_round_bet_add_time: 2,
    pot_check_time: 4000,
    random_org_api_key: 'secret',
    jackpot_hash_algorithm: 'aes-256-ctr',
    jackpot_hash_secret: 'secret',
    jackpot_min_bet: 0.0003, // this must be divisible by the token cost
    jackpot_min_bet_token_cost: 0.0001,
    block_io_api_key: 'secret',
    block_io_pin: 'secret'
};