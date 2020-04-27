import Vue from 'vue'
import Vuex from 'vuex'
import {Decimal} from 'decimal.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		count: 0,
		verified: false,
		loggedIn: false,
		auth_token: '',
		username: '',
		balance: '',
		depositAddress: '',
		stats: {
			fetched: false,
			minimumDeposit: '0.0003',
			total24HrDeposits: '',
			games24Hr: '',
			biggestPot: ''
		},
		currentPot: {
			bets: []
		}
	},
	getters: {
		currentPotValue: state => () => {
			let total = new Decimal(0);
			state.currentPot.bets.forEach(bet => {
				total = total.plus(bet.amount);
			});
			return total.toString();
			
		},
		getBetsByUsername: (state) => (username) => {
			return state.currentPot.bets.filter(bet => bet.username == username);
		},
		getGroupedBets(state) {
			let bets = [];

			state.currentPot.bets.forEach(bet => {
				let groupedBetIndex = bets.findIndex(el => el.username == bet.username);
				if(groupedBetIndex == -1) {
					bets.push({
						username: bet.username,
						avatar: bet.avatar,
						amount: new Decimal(bet.amount)
					});
				} else {
					bets[groupedBetIndex].amount = bets[groupedBetIndex].amount.plus(bet.amount);
				}
			});

			return bets;
		}
	},
	mutations: {
		increment(state) {
			state.count ++
		},
		setLoggedIn(state, loggedIn) {
			state.loggedIn = loggedIn;
		},
		addBet(state, bet) {
			state.currentPot.bets.push({
				username: bet.username,
				amount: new Decimal(bet.amount),
				avatar: bet.avatar
			});
		},
		setBalance(state, balance) {
			state.balance = ((new Decimal(balance)).toFixed(6));
		},
		addBalance(state, add) {
			state.balance.plus(add);
		},
		subtractBalance(state, sub) {
			//console.log('subtracting', sub, 'from', state.balance);
			state.balance = ((new Decimal(state.balance)).minus(sub)).toFixed(5);
		}
	},
	actions: {
		
	}
})
