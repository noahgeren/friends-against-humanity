<script>
    let players = ['Test 1', 'Test 2', 'Test 3 is a long one', 'Test 4', 'Test5'];
</script>
<div class="w-full max-w-sm">
    <div class="flex flex-col items-center my-3">
        <h3 class="text-2xl">Access Code:</h3>
        <h1 class="text-8xl font-semibold">ABCDE</h1>
    </div>
    <div class="card w-full h-card bg-gray-100 text-black mx-auto">
        <div class="card-body">
            <h3 class="card-title text-5xl mb-3">Lobby</h3>
            <!-- <h4 class="text-2xl underline">Players</h4> -->
            <div class="grid grid-cols-2 gap-2">
                {#each players as player}
                <p class="text-2xl">{player}</p>
                {/each}
            </div>
            <p></p>
            <div class="card-actions justify-center">
                {#if players.length > 2}
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
