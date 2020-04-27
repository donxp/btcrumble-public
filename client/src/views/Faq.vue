<template>
    <div class="faq-view">
        <div class="panel panel-padded">
            <div class="faq-view-title">Frequently Asked Questions</div>
            <div class="faq-view-questions">
                <div class="question">
                    <div class="question-title">How does BTCRUMBLE work?</div>
                    <div class="faq-answer">
                        <ul>
                            <li>Firstly, you need to deposit bitcoin into your BTCRUMBLE wallet.</li>
                            <li>After you have bitcoin in your BTCRUMBLE wallet you are able to participate in games, for this example Jackpot.</li>
                            <li>On the jackpot page you are able to deposit bitcoin into the 'pot'. Each game has a minimum deposit amount.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style>
    .faq-view-title {
        font-size: 1.5em;
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 30px;
    }

    .faq-view-questions {
        width: 70%;
        padding: 10px 20px;
    }

    .question .question-title {
        font-weight: bold;
        font-family: Arial, Helvetica, sans-serif;
    }

    .question .faq-answer {
        font-size: 0.95em;
        font-family: Arial, Helvetica, sans-serif;
    }
</style>