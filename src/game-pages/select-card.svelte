<script>
    import { cards } from '$lib/cards';
    import { db } from '$lib/firebase';
    import { ref, set, runTransaction } from 'firebase/database';
    import Loading from './loading.svelte';

    export let game, user, seenWhiteCards, seenBlackCards;

    $: isAdmin = user.uid === game.admin;
    $: isCzar = user.uid === game.czar;
    $: isAnswer = game.state === 'ANSWER' && Object.entries(game.players).some(([uid, player]) => !player.selected && game.czar !== uid);
    $: submitted = !!game.players[user.uid]?.selected;
    $: waitingOn = Object.entries(game.players)
                        .filter(([uid, player]) => uid !== game.czar && !player.selected)
                        .map(([_, player]) => player.nickname);

    let players = [];
    let showingCards = [];
    let selected;

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
                let availableWhiteCards = cards.whiteCards.filter((whiteCard) => !seenWhiteCards.has(whiteCard) && !showingCards.includes(whiteCard));
                showingCards.push(availableWhiteCards[Math.floor(Math.random() * availableWhiteCards.length)]);
            }
            localStorage.setItem('cards', JSON.stringify(showingCards));
        } else {
            players = shuffle(Object.entries(game.players).map(([uid, player]) => ({
                uid,
                selected: player.selected
            })).filter((player) => game.czar !== player.uid));
            showingCards = players.map((player) => player.selected);
        }
    };

    function writeAnswer() {
        const answer = prompt('Write your own answer:');
        if(answer) {
            submitAnswer(answer);
        }
    }

    async function submit() {
        if(isAnswer) {
            await submitAnswer(showingCards[selected]);
            let cards = JSON.parse(localStorage.getItem('cards') || '[]');
            cards.splice(selected, 1);
            localStorage.setItem('cards', JSON.stringify(cards));
            selected = undefined;
        } else {
            submitVote();
        }
    }

    async function submitAnswer(answer) {
        try {
            await set(ref(db, `games/${game.accessCode}/players/${user.uid}/selected`), answer);
        } catch (e) {
            console.error(e);
            alert('Error submitting answer')
        }
    }

    async function submitVote() {
        try {
            await runTransaction(ref(db, 'games/' + game.accessCode), (data) => {
                // Increment winner's points
                data.players[players[selected].uid].points++;
                // Select the winner
                data.winner = {...data.players[players[selected].uid]};
                // Switch to rankings page
                data.state = 'RANKINGS';
                // Draw new black card
                let availableBlackCards = cards.blackCards.filter((blackCard) => !seenBlackCards.has(blackCard));
                data.blackCard = availableBlackCards[Math.floor(Math.random() * availableBlackCards.length)];
                // Set last czar
                data.lastCzar =  data.czar;
                // Select next czar
                const playerUids = Object.keys(data.players);
                data.czar = playerUids[(playerUids.indexOf(data.czar) + 1) % playerUids.length];
                // Reset players' selected cards
                playerUids.forEach((uid) => {
                    delete data.players[uid].selected;
                });
                return data;
            });
        } catch (e) {
            console.error(e);
            alert('Error submitting vote');
        }
    }

    async function skip() {
        if(!confirm('Already selected white cards will be forfeited. Are you sure you want to continue?')) {
            return;
        }
        try {
            await runTransaction(ref(db, 'games/' + game.accessCode), (data) => {
                // Draw new black card
                let availableBlackCards = cards.blackCards.filter((blackCard) => !seenBlackCards.has(blackCard));
                data.blackCard = availableBlackCards[Math.floor(Math.random() * availableBlackCards.length)];
                // Reset players' selected cards
                const playerUids = Object.keys(data.players);
                playerUids.forEach((uid) => {
                    delete data.players[uid].selected;
                });
                return data;
            });
        } catch (e) {
            console.error(e);
            alert('Error skipping black card');
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
    {#if isAdmin && isAnswer}
    <h2 class="text-4xl text-center my-3 underline">Waiting On</h2>
    <div class="flex flex-wrap justify-center w-full max-w-3xl">
        {#each waitingOn as player}
        <h2 class="text-4xl text-center w-1/3">{player}</h2>
        {/each}
    </div>
    <button class="btn btn-link mt-8" on:click={skip}>Skip Black Card</button>
    {/if}
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
                <div
                    class="card-body pt-3 invisible pb-3"
                    class:h-card={idx === showingCards.length - 1}
                    style="margin-left: 2px;"
                >
                    <div class="card-title text-4xl">{@html card}</div>
                </div>
            </div>
            {/each}
        </div>
        {#if isAnswer}
        <div>
            <button class="btn btn-lg btn-link" on:click={writeAnswer}>Write your own answer</button>
        </div>
        {/if}
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