<script>
    import { onMount } from 'svelte';
    import { cards } from '$lib/cards';
    import Loading from './loading.svelte';

    export let game, user;

    $: isAdmin = user.uid === game.admin;
    $: isCzar = user.uid === game.czar;
    $: isAnswer = game.state === 'ANSWER';
    

    let players = [];
    let showingCards = [];
    let selected;
    let submitted = false;

    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    $: {
        if(isAnswer) {
            showingCards = JSON.parse(localStorage.getItem('cards') || '[]');
            while(showingCards.length < 7) {
                showingCards.push(cards.whiteCards[Math.floor(Math.random() * cards.whiteCards.length)]);
            }
            localStorage.setItem('cards', JSON.stringify(showingCards));
        } else {
            players = shuffle(Object.entries(game.players).map(([uid, player]) => ({
                uid,
                selected: player.selected
            })));
            showingCards = players.map((player) => player.selected);
        }
    };

    function submit() {
        if(isAnswer) {
            submitAnswer();
        } else {
            submitVote();
        }
    }

    async function submitAnswer() {
        try {

            submitted = true;
        } catch (e) {
            console.error(e);
            alert('Error submitting answer')
        }
    }

    async function submitVote() {

    }
</script>
{#if !submitted}
    <h1 class="text-5xl font-semibold block w-full max-w-md mx-3 mb-6">I went to the desert and ate of the peyote cactus. Turns out my spirit animal is _____.</h1>
    {#if (isAdmin || isCzar) && isAnswer}
        <h2 class="text-4xl font-semibold text-center my-3">
            {#if isCzar}You are{:else}{game.players[game.czar].nickname} is{/if} the card czar this round
        </h2>
        <p class="text-center">Waiting on all players to answer</p>
    {:else}
        <div class="flex flex-row flex-wrap gap-3 justify-center w-full">
            {#each showingCards as card, idx}
            <div class="w-full max-w-sm relative">
                <div
                    class="fah-card h-card cursor-pointer absolute"
                    class:selected={selected === idx}
                    on:click={() => selected = (selected === idx ? undefined : idx)}
                    tabindex="0"
                >
                    <div class="card-body pt-3">
                        <div class="card-title text-4xl">{@html card}</div>
                    </div>
                </div>
                <div class="card-body pt-3 invisible pb-3" class:h-card={idx === showingCards.length - 1}>
                    <div class="card-title text-4xl">{@html card}</div>
                </div>
            </div>
            {/each}
        </div>
        <!-- TODO: Add logic to write your own answers 
        {#if isAnswer}
        <div>
            <button class="btn btn-lg btn-link">Write your own answer<br/>(3 left)</button>
        </div>
        {/if} -->
        {#if selected !== undefined}
            <div class="fixed bottom-4 w-full flex justify-center pointer-events-none">
                <button
                    class="btn btn-lg btn-primary shadow-xl text-white pointer-events-auto"
                    on:click={submit}   
                >
                    Submit
                </button>
            </div>
        {/if}
    {/if}
{:else if isAnswer}
<Loading msg="Waiting on all players to answer" />
{/if}