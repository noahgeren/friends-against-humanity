<script>
    import { onMount } from 'svelte';
    import { cards } from '$lib/cards';
    import { db } from '$lib/firebase';
    import { ref, set, runTransaction } from 'firebase/database';
    import Loading from './loading.svelte';

    export let game, user;

    $: isAdmin = user.uid === game.admin;
    $: isCzar = user.uid === game.czar;
    // TODO: Change below to be all players but one have selected to account for czar
    $: isAnswer = game.state === 'ANSWER' && Object.values(game.players).some((player) => !player.selected);
    

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
            await set(ref(db, `games/${game.accessCode}/players/${user.uid}/selected`), showingCards[selected]);
            let cards = JSON.parse(localStorage.getItem('cards') || '[]');
            cards.splice(selected, 1);
            localStorage.setItem('cards', JSON.stringify(cards));
            submitted = true;
            selected = undefined;
        } catch (e) {
            console.error(e);
            alert('Error submitting answer')
        }
    }

    async function submitVote() {
        try {
            await runTransaction(ref('games/' + game.accessCode), (oldData) => {
                // TODO: Update winner, state, winner score, black card, czar, and selected cards
            });
        } catch (e) {
            console.error(e);
            alert('Error submitting vote');
        }
    }
</script>
{#if !submitted || !isAnswer}
    <h1 class="text-5xl font-semibold block w-full max-w-md mx-3 mb-6 text-center">
        {@html game.blackCard.replace('_', '_____')}
    </h1>
    <h2 class="text-4xl font-semibold text-center my-3">
        {#if isCzar}You are{:else}{game.players[game.czar].nickname} is{/if} the card czar this round
    </h2>
    {#if !((isAdmin || isCzar) && isAnswer)}
        <div
            class="flex flex-row flex-wrap gap-3 justify-center w-full"
            class:pointer-events-none={!isAnswer && !isCzar}
        >
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
{:else}
    <Loading msg="Waiting on all players to answer" />
{/if}