<template>
	<div id="app">
		<div class="container">
			<div class="header">
				<div id="logo">
					<img src="http://localhost:5000/img/logo.png" alt="">
				</div>
				<div id="nav">
					<router-link to="/">Home</router-link>
					<router-link to="/faq">FAQ</router-link>
					<router-link v-if="!$store.state.loggedIn" to="/login">Login</router-link>
					<router-link v-if="!$store.state.loggedIn" to="/register">Register</router-link>
					<router-link v-if="$store.state.loggedIn" to="/profile">{{ $store.state.username }} (<span title="Actual">{{ $store.state.balance }}</span>)</router-link>
					<router-link v-if="$store.state.loggedIn" to="/wallet">Wallet</router-link>
					<a href="#" v-if="$store.state.loggedIn" @click="logout">Logout</a>
				</div>
			</div>
			
			<router-view/>
		</div>
	</div>
</template>

<script>
	import store from './store';
	import AuthService from './AuthService';
	import StatsService from './StatsService';

	export default {
		created() {
			if(localStorage.token) {
				AuthService.verify(localStorage.token).then(res => {
					if(res.success) {
						store.state.loggedIn = true;
						store.state.auth_token = localStorage.token;
						store.state.username = res.data.username;
						store.state.depositAddress = res.data.depositAddress;
						store.commit('setBalance', res.data.balance);
					}
					store.state.verified = true;
				}).catch(err => {
					console.log('Unable to verify token, error:', err);
				})
			}

			// Fetch stats
			StatsService.getStats().then(res => {
				if(res.success) {
					store.state.stats.total24HrDeposits = res.stats.total24HrDeposits;
					store.state.stats.games24Hr = res.stats.games24Hr;
					store.state.stats.biggestPot = res.stats.biggestPot;
				}
				store.state.stats.fetched = true;
			}).catch(err => {
				console.log('Unable to fetch statistics:', err);
			});
		},
		updated() {
			
		},
		methods: {
			logout() {
				AuthService.logout(store);
			}
		}
	}
</script>

<style>
#app {
	font-family: Helvetica, Arial, sans-serif;
	color: #fff;
	padding: 0;
	margin-top: 5%;
}

#logo img {
	width: 251px;
	height: 78px;
}

.container {
	width: 70%;
	margin: 0 auto;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.panel {
	background: #fff;
	color: #3f4953;
	border-radius: 3px;
	margin-bottom: 50px;
	box-shadow: 10px 10px 21px -10px rgba(0,0,0,0.75);
}

.panel-title {
	text-align: center;
	font-size: 1.5em;
}

.panel-padded {
	padding: 5px;
}

.panel-divider {
	width: 1px;
	background: #ccc;
}

#nav a {
	color: #fff;
	text-decoration: none;
}

#nav a:not(:last-child) {
	margin-right: 40px;
}

#nav a.router-link-exact-active {
	color: #42b983;
}
</style>
