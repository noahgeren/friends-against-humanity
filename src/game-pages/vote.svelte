<script>
    let whiteCards = ["Seizing control of the means of production.","The new Radiohead album.","A moist towlette.","Walking into a glass door.","A nugget of poo roughly the size and shape of a crouton.","Adderall&trade;.","Getting killed and dragged up a tree by a leopard."];
    /**
     * @type {null | number}
     */
    let selected = null;
</script>
<div class="w-full max-w-sm">
    <h1 class="text-4xl mx-3 mb-4 font-semibold">I went to the desert and ate of the peyote cactus. Turns out my spirit animal is _____.</h1>
    {#each whiteCards as card, idx}
    <div
        class="card bg-gray-100 border border-gray-400 text-black shadow shadow-black btn-pop cursor-pointer"
        class:h-card={idx === whiteCards.length - 1}
        class:-mt-8={idx !== 0}
        class:bg-primary={selected === idx}
        class:text-white={selected === idx}
        on:click={() => selected = idx}
    >
        <div class="card-body pt-3" class:mb-4={idx !== whiteCards.length - 1}>
            <div class="card-title text-4xl">{@html card}</div>
        </div>
    </div> 
    {/each}
</div>
{#if selected !== null}
<div class="fixed bottom-4 w-full flex justify-center">
    <button class="btn btn-lg btn-primary shadow-xl outline outline-2 text-white">Submit</button>
</div>
{/if}