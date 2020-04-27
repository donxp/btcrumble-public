<template>
    <div class="participants">
        <div class="game-panel-title">Participants</div>
        <div class="participant" v-for="bet in $store.getters.getGroupedBets" v-bind:key="bet.username">
            <div class="participant-avatar">
                <img v-bind:src="getAvatarUrl(bet)">
            </div>
            <div class="participant-user-info">
                <div class="participant-user-info-username">
                    {{bet.username}}
                </div>
                <div class="participant-user-info-amount">
                    bet worth {{getAmountInMbtc(bet.amount.toString())}} mBTC
                </div>
            </div>
            <div class="participant-chance">
                <div>{{getPercentChance(bet.amount.toString())}}%</div>
            </div>
        </div>
    </div>
</template>

<script>
import Big from 'big.js'
import {Decimal} from 'decimal.js'
import store from '../store';

export default {
    methods: {
        getAvatarUrl(bet) {
            return 'http://localhost:5000/avatars/' + ((bet.avatar == 1) ? bet.username : 'default') + '.png';
        },
        getPercentChance(amount) {
            return (new Decimal('' + amount)).dividedBy(store.getters.currentPotValue()).times(100).toFixed(1).toString();
        },
        /*getTotalPotValue() {
            const bets = store.state.currentPot.bets;
            console.log('Begin currentPotValuebbb, bets:', bets.length);
            for(let i = 0; i < bets.length; i++) {
                console.log(bets[i].amount);
            }
            let total = new Decimal(0);
            console.log(store.state.currentPot.bets);
			store.state.currentPot.bets.forEach(bet => {
				//total += Number(bet.amount);
				console.log('Adding', bet.amount.toString(), 'current total:', total.toString());
				total = total.plus(bet.amount.toString());
			});
			console.log('Returning currentPotValue:', total.toString());
			return total.toString();
        },*/
        getAmountInMbtc(amount) {
            let a = new Big(amount);
            return a.mul(1000).toString();
        }
    }
}
</script>

<style>
    .participants img {
        width: 40px;
        height: 40px;
    }

    .participant {
        display: flex;
    }

    .participant {
        margin-bottom: 10px;
    }

    .participant-avatar {
        flex-basis: 10%;
    }

    .participant-user-info {
        margin-left: 10px;
        flex-basis: 70%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }

    .participant-user-info-username {
        color: #373e51;
        font-weight: bold;
    }

    .participant-user-info-amount {
        font-size: 0.7em;
    }

    .participant-chance {
        flex-basis: 20%;
        font-family: Arial, Helvetica, sans-serif;
        color: #373e51;
        font-weight: bold;
        font-size: 1.4em;
        display: flex;
        justify-content: center;
    }
</style>