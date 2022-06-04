<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { init } from '$lib/game';
    import SelectCard from '../game-pages/select-card.svelte';
    import Lobby from '../game-pages/lobby.svelte';
    import Rankings from '../game-pages/rankings.svelte';
    import Loading from '../game-pages/loading.svelte';

    /**
    * @type {string | null}
    */
    let code;
    onMount(() => {
        code = $page.url.searchParams.get('code');
        if(!code) {
            goto('/');
            return;
        }
        init(code);
    });

</script>
<div class="flex flex-col items-center">
    <Loading />
</div>