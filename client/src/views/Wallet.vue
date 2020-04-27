<template>
    <div class="wallet-view">
        <div class="panel panel-padded">
            <div class="panel-title">Wallet</div>
            <div class="wallet-view-balance wallet-subview">
                <h3>Balance</h3>
                <p>Your current balance is: <b>{{ $store.state.balance }}</b></p>
            </div>
            <div class="wallet-view-deposit wallet-subview">
                <h3>Deposit</h3>
                <p v-if="$store.state.depositAddress != '' && $store.state.depositAddress != null">
                    Your <b>bitcoin</b> deposit address is: {{ $store.state.depositAddress }}
                </p>
                <div class="wallet-view-deposit-generate-address" v-if="$store.state.depositAddress == ''">
                    <p>You currently do not have a deposit address.</p>
                    <button @click="generateAddress">Generate deposit address</button>
                </div>
            </div>
            <div class="wallet-view-withdraw wallet-subview">
                <h3>Withdraw</h3>
                <form v-on:submit.prevent="withdraw">
                    <input type="text" v-model="withdrawAddress" placeholder="Address">
                    <input type="number" v-model="withdrawAmount" min="0.0003" step="0.0001" max="5">
                    <button>Withdraw</button>
                </form>
            </div>
            <div class="wallet-view-transactions wallet-subview">
                <h3>Transactions</h3>
            </div>
        </div>
    </div>
</template>

<script>

import WalletService from '../WalletService';
import store from '../store';

export default {
    data() {
        return {
            withdrawAddress: '',
            withdrawAmount: 0.0003
        }
    },
    methods: {
        generateAddress() {
            WalletService.generateAddress().then(res => {
                console.log(res);
                if(res.hasOwnProperty('address')) {
                    store.state.depositAddress = res.address;
                }
            }).catch(err => {
                console.log('Failed generating address with error: ' + err);
            });
        },
        withdraw() {
            console.log(`Withdraw ${this.withdrawAmount} to ${this.withdrawAddress}`);
            WalletService.withdraw(this.withdrawAddress, this.withdrawAmount).then(res => {
                console.log(res);
            });
        }
    }
}
</script>

<style>
    .wallet-subview {
        margin: 0 auto;
        width: 500px;
        margin-bottom: 50px;
    }

    .wallet-subview h3 {
        text-align: center;
    }

    .wallet-view-balance p {
        text-align: center;
    }

    .wallet-view-deposit button {
        background: #25b5fe;
        border: 0;
        border-radius: 6px;
        padding: 10px;
        color: #fff;
        font-size: 0.8em;
        text-transform: uppercase;
        font-family: Arial, Helvetica, sans-serif;
        width: 500px;
        margin: 0 auto;
    }

    .wallet-view-deposit-generate-address button {
        margin: 0 auto;
        width: 500px;
    }

    .wallet-view-deposit p {
        text-align: center;
    }

    .wallet-view-withdraw form {
        width: 500px;
        margin: 0 auto;
    }

    .wallet-view-withdraw form input {
        display: block;
        border: 1px solid #ccc;
        margin-bottom: 10px;
        height: 40px;
        width: calc(100% - 20px);
        padding: 0 10px 0 10px;
        border-radius: 4px;
    }

    .wallet-view-withdraw form button {
        background: #25b5fe;
        border: 0;
        border-radius: 6px;
        padding: 10px;
        color: #fff;
        font-size: 0.9em;
        text-transform: uppercase;
        font-family: Arial, Helvetica, sans-serif;
        width: 100%;
    }

    .wallet-view-withdraw form > * {
        display: block;
    }
</style>