<template>
	<div class="home">
		<div class="panel panel-stats" v-if="$store.state.stats.fetched">
			<div class="stats-panel-stat">
				Minimum deposit
				<div class="stats-panel-content">
					{{ $store.state.stats.minimumDeposit }}
				</div>
			</div>
			<div class="panel-divider"></div>
			<div class="stats-panel-stat">
				Total (24hr)
				<div class="stats-panel-content">
					{{ $store.state.stats.total24HrDeposits }}
				</div>
			</div>
			<div class="panel-divider"></div>
			<div class="stats-panel-stat">
				Games (24hr)
				<div class="stats-panel-content">
					{{ $store.state.stats.games24Hr }}
				</div>
			</div>
			<div class="panel-divider"></div>
			<div class="stats-panel-stat">
				Biggest pot
				<div class="stats-panel-content">
					{{ $store.state.stats.biggestPot }}
				</div>
			</div>
		</div>
		<jackpot-roll-component></jackpot-roll-component>
		<div class="panel game-panel">
			<!-- 
			<current-pot-component v-if="$store.state.verified"></current-pot-component>
			-->
			<current-pot-component></current-pot-component>
			<div class="panel-divider"></div>
			<participants-component></participants-component>
			<div class="panel-divider"></div>
			<chatbox-component></chatbox-component>
		</div>
	</div>
</template>

<script>
	import ChatboxComponent from '../components/Chatbox';
	import CurrentPotComponent from '../components/CurrentPot';
	import ParticipantsComponent from '../components/Participants';
	import JackpotRollComponent from '../components/JackpotRoll';

	export default {
		components: {
			ChatboxComponent,
			CurrentPotComponent,
			ParticipantsComponent,
			JackpotRollComponent
		}
	}
</script>

<style>


.game-panel {
	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	height: 500px;
}

.panel-stats {
	display: flex;
	padding: 20px;
	justify-content: space-around;
}

.stats-panel-stat {
	display: flex;
	align-items: center;
	font-weight: bold;
}

.stats-panel-content {
	background: #2ed1ff;
	color: white;
	font-weight: bold;
	padding: 5px;
	border-radius: 4px;
	margin-left: 10px;
}

.current-pot {
	flex-basis: 33%;
}

.participants {
	flex-basis: 33%;
}

.chatbox {
	flex-basis: 33%;
}

.game-panel-title {
	text-align: center;
	font-size: 1.5em;
	font-weight: bold;
	text-transform: uppercase;
	height: 30px;
}

.chat-form {
	align-self: flex-end;
	height: 50px;
	display: flex;
}

.chat-form input {
	height: 100%;
	border: 1px solid #ccc;
	margin: 0;
	padding: 0;
	flex-grow: 1;
}

.chat-form button {
	height: calc(100% + 2px);
	background: #25b5fe;
	border: 0;
	color: #fff;
	font-weight: bold;
	text-transform: uppercase;
	width: 80px;
	font-size: 0.73em;
	transition: 0.6s;
}

.chat-form button:hover {
	background: #2196d2;
}


</style>