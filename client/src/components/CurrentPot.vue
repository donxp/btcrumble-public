<template>
    <div class="current-pot">
        <div class="game-panel-title">Current pot</div>
        <input type="text" class="dial" disabled>
        <div>
            <p class="text-center" v-if="state == 0">Waiting for players.</p>
            <div style="margin-bottom: 50px;" v-else></div>
            <div class="deposit-group">
                <input type="number" class="deposit-amount-input" v-model="depositAmount" :min="$store.state.stats.minimumDeposit" step="0.0001">
                <button class="button" @click="deposit">Deposit</button>
            </div>
        </div>
    </div>
</template>

<script>
import store from '../store';
import GameService from '../GameService';
import Big from 'big.js'
import { setInterval, clearInterval } from 'timers';

export default {
    data() {
        return {
            depositAmount: store.state.stats.minimumDeposit,
            modals: {
                deposit: false
            },
            potAmount: 10,
            timeleft: 90,
            timer: null,
            state: 0,
            isCountingDown: false
        };
    },
    created() {
        store.state.currentPot.bets = [];
        GameService.getCurrentPot().then(data => {
            for(let i = 0; i < data.bets.length; i++) {
                store.commit('addBet', data.bets[i]);
            }
            console.log('Got current pot', store.state.currentPot.bets, data.bets, data.bets.length);

            this.state = data.state;
            this.timeleft = data.timeleft;
            this.isCountingDown = data.isCountingDown;

            this.updateDialTime();

            if(this.isCountingDown) {
                this.initPotTimer();
            } else { 
                console.log('Countdown restricted');
            }
        }).catch(err => {
            console.log('Unable to fetch current pot, error:', err);
        });
        
        this.$nextTick(() => {
            window.dial = window.$('.dial').knob({
                min: 0,
                max: 90,
                readOnly: true,
                fgColor: "#313e57",
                width: 256,
                height: 256,
                thickness: .3,
                inline: false,
                format() {
                    return store.getters.currentPotValue() + ' Ƀ';
                },
                draw() {
                    window.$('.dial').css('font-size', '26px');
                    window.$('.dial').parent().addClass('dial-parent');
                }
            });
        });
        
    },
    methods: {
        deposit() {
            console.log('Deposit', this.depositAmount);
            GameService.deposit(this.depositAmount).then(() => {
                //store.state.balance -= this.depositAmount;
                store.commit('subtractBalance', this.depositAmount)
            });
        },
        updateDialTime() {
            window.$('.dial').val(this.timeleft).trigger('change');
            console.log('Updating timer to ' + this.timeleft);
        },
        currentPotValue() {
			console.log('Begin currentPotValue');
			let total = new Big(0);
			store.state.currentPot.bets.forEach(bet => {
				total = total.plus(bet.amount);
				console.log('Adding', bet.amount, 'current total:', total.toString());
			});
			console.log('Returning currentPotValue:', total.toString());
			return total.toString();
        },
        initPotTimer() {
            this.timer = setInterval(() => {
                if(this.timeleft <= 0) {
                    clearInterval(this.timer);
                } else {
                    this.timeleft -= 1;
                    this.updateDialTime();
                }
            }, 1000);
        }
    },
    socket: {
        events: {
            jackpotBet(bet) {
                console.log('Received bet event', bet);
                store.commit('addBet', {
                    username: bet.username,
                    avatar: bet.avatar,
                    amount: bet.amount
                });
                this.timeleft = bet.timeleft;
                this.updateDialTime();
            }
        }
    }
}
</script>

<style>
.dial-parent {
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
}

.button {
    background: #189f22;
    border: 0;
    padding: 10px 25px;
    color: #fff;
    font-weight: bold;
    font-family: Arial, Helvetica, sans-serif;
    border-radius: 4px;
    transition: 0.5s;
}

.button:hover {
    background: #1fd12b;
}

.center-element {
    display: block;
    margin: 0 auto;
}

.text-center {
    text-align: center;
}

.deposit-group {
    margin: 0 auto;
    width: 60%;
}

.deposit-group button {
    width: 50%;
    margin: 10px auto 0 auto;
    display: block;
}

.deposit-amount-input {
    border: 1px solid #ccc;
    padding: 10px 15px;
    border-radius: 5px;
    margin-top: 10px;
    width: calc(100% - 30px);
}

.current-pot-deposit-modal-buttons button {
    margin-right: 10px;
}
</style>
