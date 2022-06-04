<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import SelectCard from '../game-pages/select-card.svelte';
    import Lobby from '../game-pages/lobby.svelte';
    import Rankings from '../game-pages/rankings.svelte';

    /**
    * @type {string | null}
    */
    let code;
    onMount(() => {
        code = $page.url.searchParams.get('code');
    });

</script>
<div class="flex flex-col items-center">
    <SelectCard />
</div>