<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { auth, db } from '$lib/firebase';
    import { signInAnonymously } from 'firebase/auth';
    import { onValue, ref } from 'firebase/database';
    import SelectCard from '../game-pages/select-card.svelte';
    import Lobby from '../game-pages/lobby.svelte';
    import Rankings from '../game-pages/rankings.svelte';
    import Loading from '../game-pages/loading.svelte';

    let code, user, game;
    onMount(async () => {
        code = $page.url.searchParams.get('code');
        if(!code) {
            goto('/');
            return;
        }
        user = (await signInAnonymously(auth)).user;
        onValue(ref(db, 'games/' + code.toUpperCase()), (snapshot) => {
            if(!snapshot.exists()) {
                window.location.href = '/';
                return;
            }
            game = {
                ...snapshot.val(),
                accessCode: snapshot.key
            };
        });
    });

</script>
<div class="flex flex-col items-center">
    {#if !game}
    <Loading />
    {:else if game.state.value === 'LOBBY'}
    <Lobby {game} {user} />
    {:else if game.state.value === 'ANSWER'}
    <SelectCard />
    {:else if game.state.value === 'VOTE'}
    <SelectCard />
    {:else if game.state.value === 'RANKINGS'}
    <Rankings />
    {/if}
</div>