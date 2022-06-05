<script>
    import { db } from "$lib/firebase";
    import { cards } from '$lib/cards'; 
    import { ref, runTransaction } from "firebase/database";

    export let game, user;

    async function start() {
        try {
            await runTransaction(ref(db, 'games/' + game.accessCode), (data) => {
                return {
                    ...data,
                    blackCard: cards.blackCards[Math.floor(Math.random() * cards.blackCards.length)],
                    czar: Object.keys(game.players)[0],
                    state: 'ANSWER'
                }
            });
        } catch (e) {
            console.error(e);
            alert('Error starting game');
        }
    }
</script>
<div class="w-full max-w-sm">
    <div class="flex flex-col items-center my-3">
        <h3 class="text-2xl">Access Code:</h3>
        <h1 class="text-8xl font-semibold">{game.accessCode}</h1>
    </div>
    <div class="fah-card mx-auto">
        <div class="card-body">
            <h3 class="card-title text-5xl mb-3">Lobby</h3>
            <div class="grid grid-cols-2 gap-3">
                {#each Object.values(game.players || {}) as player}
                <p class="text-2xl">{player.nickname}</p>
                {/each}
            </div>
            <p></p>
            <div class="card-actions justify-center">
                {#if Object.keys(game.players || {}).length > 2}
                    {#if user.uid === game.admin}
                    <button
                        class="btn btn-primary btn-lg text-white shadow-lg"
                        on:click={start}
                    >
                        Start Game
                    </button>
                    {:else}
                    <p class="text-center">Waiting on the admin to start game</p>
                    {/if}
                {:else}
                <p class="text-center">Waiting on more players to join</p>
                {/if}
            </div>
        </div>
    </div>
</div>
