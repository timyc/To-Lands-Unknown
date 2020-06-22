const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const path = require('path');
const auth = require('./core/routes/auth');
const paypal = require('./core/routes/paypal');
const getMobs = require('./core/game/moblist');
const dungeonStuff = require('./core/game/dungeons');
const purchase = require('./core/game/purchase');
const gameBattle = require('./core/game/battle');
const gameEquip = require('./core/game/equip');
const gameAug = require('./core/game/augment');
const getChat = require('./core/game/chat');
const getProfile = require('./core/game/profile');
const navigation = require('./core/game/navigation');
const quest = require('./core/game/quest');
const commands = require('./core/game/commands');
const guilds = require('./core/game/guilds');
const mithrilstuff = require('./core/game/mithrilupgrades');
const pageStructure = require('./core/routes/pagestructure');
const popup = require('./core/game/popup');
const rateLimit = require("express-rate-limit");
const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  skipSuccessfulRequests: true,
  message: 'Too many failed login attempts! Try again in 15 minutes!'
});
const {
	check,
	validationResult
} = require('express-validator');
const options = require('./config/mysqlconf');
const sessionStore = new MySQLStore(options);

const app = express();

const sPort = 3000;

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('trust proxy', 1);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	resave: false,
	saveUninitialized: false,
	store: sessionStore,
	secret: '|!kvrwvI5U[MV(Qp_0>}[|<X??=#gh',
	cookie: {
		maxAge: 3600000
	},
	rolling: true
}));

// Main Pages

app.get('/', pageStructure.gHome);
app.get('/terms', pageStructure.gToS);
app.get('/nojs', pageStructure.gNoJS);
app.get('/main', pageStructure.gBod);
app.get('/shop', pageStructure.gShop);

// Game functions

app.post('/loginAuth', loginLimit, auth.login);
app.get('/logoutAuth', auth.logout);
app.post('/regAuth', [check('email').isEmail()], function(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).send('<span class="text-danger">invalid email</span>')
	}
	next()
}, auth.register);
app.post('/moblist', getMobs);
app.post('/battle', gameBattle.battle);
app.post('/battleBeast', gameBattle.battleBeast);
app.post('/auto', gameBattle.autoBattle);
app.post('/chat', getChat.loadChat);
app.post('/input', getChat.sendChatMessage);
app.post('/equip', gameEquip);
app.post('/augment', gameAug);
app.post('/profile', getProfile.profile);
app.post('/settings', navigation.settings);
app.post('/inventory', navigation.inventory);
app.post('/milestones', navigation.milestones);
app.post('/guilds', guilds);
app.post('/teleporter', navigation.teleportList);
app.post('/teleportLoc', commands.teleportLoc);
app.post('/teleportBeast', commands.teleportBeast);
app.post('/move', navigation.mapMove);
app.post('/mithrilupgrades', mithrilstuff.upgrades);
app.post('/purchase', purchase);
app.post('/quest', quest.quest);
app.post('/story', quest.story);
app.post('/commands', commands.commands);
app.post('/dungeons', dungeonStuff.dungeonLayout);
app.post('/dungeons/battle', dungeonStuff.dungeonBattle);
app.post('/redeem', commands.redeemCode);
app.post('/mail', commands.mail);
app.post('/popup', popup);
app.post('/internal/ipn', paypal);
app.post('/toPlace', commands.toPlace);
app.post('/passwordUpdate', commands.passwordChange);
app.post('/market', commands.marketBuy);
app.post('/verify', commands.verify);
app.post('/replenish', commands.replenish);
app.post('/uploadAvatar', getProfile.uploadAvatar);

app.listen(sPort, function(){
	console.log('[SERVER] Express started on port ' + sPort);
});

process.on('uncaughtException', function (err) {
  console.error(err);
  console.log('Will not crash... for now.');
});
