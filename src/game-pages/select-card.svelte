<script>
    export let game, user;

    let whiteCards = ["Seizing control of the means of production.","The new Radiohead album.","A moist towlette.","Walking into a glass door.","A nugget of poo roughly the size and shape of a crouton.","Adderall&trade;.","Getting killed and dragged up a tree by a leopard."];

    let selected = null;
</script>
<h1 class="text-5xl font-semibold block w-full max-w-md mx-3 mb-4">I went to the desert and ate of the peyote cactus. Turns out my spirit animal is _____.</h1>
{#if (user.uid === game.admin || user.uid === game.czar) && game.state.value === 'ANSWER'}
<h2 class="text-4xl font-semibold text-center my-3">
    {#if user.uid === game.czar}You are{:else}{game.players[game.czar].nickname} is{/if} the card czar this round
</h2>
<p class="text-center">Waiting on all players to answer</p>
{:else}
<div class="flex flex-row flex-wrap gap-3 justify-center w-full">
    {#each whiteCards as card, idx}
    <div class="w-full max-w-sm relative">
        <div
            class="fah-card h-card cursor-pointer absolute"
            class:selected={selected === idx}
            on:click={() => selected = (selected === idx ? null : idx)}
            tabindex="0"
        >
            <div class="card-body pt-3">
                <div class="card-title text-4xl">{@html card}</div>
            </div>
        </div>
        <div class="card-body pt-3 invisible pb-3" class:h-card={idx === whiteCards.length - 1}>
            <div class="card-title text-4xl">{@html card}</div>
        </div>
    </div>
    {/each}
</div>
{#if game.state.value === 'ANSWER'}
<div>
    <button class="btn btn-lg btn-link">Write your own answer<br/>(3 left)</button>
</div>
{/if}
{#if selected !== null}
<div class="fixed bottom-4 w-full flex justify-center pointer-events-none">
    <button class="btn btn-lg btn-primary shadow-xl text-white pointer-events-auto">Submit</button>
</div>
{/if}
{/if}