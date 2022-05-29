<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import Answer from '../game-pages/answer.svelte';
    import Vote from '../game-pages/vote.svelte';
    import Lobby from '../game-pages/lobby.svelte';

    /**
    * @type {string | null}
    */
    let code;
    onMount(() => {
        code = $page.url.searchParams.get('code');
    });

</script>
<div class="flex justify-center">
    <Lobby />
</div>