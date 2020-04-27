var bunyan = require('bunyan');

function formattedRawStream() {}
formattedRawStream.prototype.write = function (rec) {
    console.log('[%s] %s: %s',
        rec.time.toISOString(),
        bunyan.nameFromLevel[rec.level],
        rec.msg);
}

module.exports = {
    logger: bunyan.createLogger({
        name: 'httpserver',
        streams: [
            {
                level: 'debug',
                path: 'logs/debug.log'
            },
            {
                level: 'info',
                path: 'logs/log.log'
            },
            {
                level: 'debug',
                stream: new formattedRawStream(),
                type: 'raw'
            }
        ]
    })
};