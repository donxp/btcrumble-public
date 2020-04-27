const express = require('express');
const logger = require('./util').logger;
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload({
    safeFileNames: true,
    preserveExtension: true
}));

const postsRoute = require('./routes/api/posts');
app.use('/api/posts', postsRoute);
const authRoute = require('./routes/api/auth');
app.use('/api/auth', authRoute);
const statsRoute = require('./routes/api/stats');
app.use('/api/stats', statsRoute);
const gameRoute = require('./routes/api/game');
app.use('/api/game', gameRoute);
const userRoute = require('./routes/api/user');
app.use('/api/user', userRoute);
const walletRoute = require('./routes/api/wallet');
app.use('/api/wallet', walletRoute);

app.use(express.static(__dirname + '/public/'));
app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));

const port = process.env.PORT || 5000;

app.listen(port, () => logger.info(`Server started on port ${port}`));