<template>
    <div class="panel panel-padded panel-jackpot-roll">
        <div class="spinner">
            <div class="inner">
                <div class="entrylist">
                    <!-- <div class="img" v-for="(entry, i) in entries" v-bind:key="i" :class="entry">
                        {{i}}
                    </div> -->
                    <img class="img" v-for="(entry, i) in entries" v-bind:key="i" v-bind:src="getAvatarUrl(entry)">
                </div>
            </div>
            <!-- <div class="line"></div> -->
        </div>
        <div class="new-line"></div>
        <button @click="roll">Spin</button>
    </div>
</template>

<script>
import _ from 'lodash';

export default {
    data() {
        return {
            rolling: true,
            entries: new Array(100)
        }
    },
    mounted() {
        _.fill(this.entries, 'default.png', 0, 50);
        _.fill(this.entries, 'donshius.png', 50, 100);

        let winner = 'donshius.png';

        this.entries = _.shuffle(this.entries);
        this.entries[89] = winner;
    },
    methods: {
        getAvatarUrl(avatar) {
            return 'http://localhost:5000/avatars/' + avatar;
        },
        roll() {
            console.log('rolling');
            this.rolling = true
      
            this.$nextTick(() => {

            window.$('.entrylist').attr('style', '')

            let entriesCount = this.entries.length
            let entryWidth = window.$('.entrylist .img').outerWidth()
            let winnerEntry = 89
            let animLength = 10000

            // differ winner from surrounding entries
            //this.entries[winnerEntry] = 'purple'
            this.$forceUpdate()

            // generate animation to land on center of entry
            let offset = (entryWidth * winnerEntry - 1)

            // generate random offset
            let minOffset = 10
            let maxOffset = entryWidth - 10
            let randomNum = Math.random() * (maxOffset - minOffset) + minOffset;
            console.log(randomNum)
            offset += randomNum

            window.$('.entrylist').width(entryWidth * entriesCount)
            
            // animate
            window.$('.entrylist').css({
            transition: 'transform ' + animLength + 'ms cubic-bezier(0.19, 1, 0.22, 1)',
            transform: `translate(-${offset}px)`
            })

            setTimeout(() => {
                window.$('.entrylist').attr('style', '')
                this.rolling = false
            }, animLength)});
        }
    }
}
</script>

<style>
.panel-jackpot-roll {
	margin-bottom: 20px;
}

.spinner {
  height: 100px;
}
.spinner .inner {
  width: 100%;
  position: relative;
  height: 98%;
  overflow: hidden;
}
.spinner .inner .entrylist {
  z-index: 1;
  position: absolute;
  top: 0;
  height: 100px;
  width: 100%;
  left: 50%;
}
.spinner .inner .entrylist .img {
  float: left;
  display: inline-flex;
  width: 100px;
  height: 100px;
}
.spinner .inner .entrylist .img.red {
  background: red;
}
.spinner .inner .entrylist .img.blue {
  background: blue;
}
.spinner .inner .entrylist .img.purple {
  background: purple;
}
.spinner .inner .entrylist .img.green {
  background: green;
}
.spinner .inner .entrylist .img.yellow {
  background: yellow;
}
.line {
  width: 2px;
  height: 120px;
  border-right: 2px solid black;
  transform: translate(-50%);
  position: absolute;
  top: 300px;
  left: 50%;
  z-index: 2;
}

.new-line {
    width: 2px;
    /* background: black; */
    border-right: 2px solid black;
    height: 6px;
    margin: 0 auto;
}
</style>

