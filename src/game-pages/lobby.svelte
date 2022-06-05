<script>
    /**
     * @type {any}
     */
    export let game;

    // TODO: Add start game functionality, hide start button if not admin
</script>
<div class="w-full max-w-sm">
    <div class="flex flex-col items-center my-3">
        <h3 class="text-2xl">Access Code:</h3>
        <h1 class="text-8xl font-semibold">{game.accessCode}</h1>
    </div>
    <div class="fah-card mx-auto">
        <div class="card-body">
            <h3 class="card-title text-5xl mb-3">Lobby</h3>
            <!-- <h4 class="text-2xl underline">Players</h4> -->
            <div class="grid grid-cols-2 gap-3">
                {#each Object.values(game.players || {}) as player}
                <p class="text-2xl">{player.nickname}</p>
                {/each}
            </div>
            <p></p>
            <div class="card-actions justify-center">
                {#if Object.keys(game.players).length > 2}
                <button class="btn btn-primary btn-lg text-white shadow-lg">
                    Start Game
                </button>
                {:else}
                <p class="text-center">Waiting on more players to join</p>
                {/if}
            </div>
        </div>
    </div>
</div>
