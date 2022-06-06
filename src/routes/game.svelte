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

    let seenWhiteCards = new Set(), seenBlackCards = new Set();
    $: {
        if(game) {
            seenBlackCards.add(game.blackCard);
            Object.values(game.players || {}).forEach((player) => {
                seenWhiteCards.add(player.selected);
            });
            localStorage.setItem('seenWhiteCards', JSON.stringify(Array.from(seenWhiteCards)));
            localStorage.setItem('seenBlackCards', JSON.stringify(Array.from(seenBlackCards)));
        }
    };
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
        seenWhiteCards = new Set(JSON.parse(localStorage.getItem('seenWhiteCards') || '[]')), seenBlackCards = new Set(JSON.parse(localStorage.getItem('seenBlackCards') || '[]'));
    });

</script>
<div class="flex flex-col items-center">
    {#if !game}
    <Loading />
    {:else if game.state === 'LOBBY'}
    <Lobby {game} {user} />
    {:else if game.state === 'ANSWER'}
    <SelectCard {game} {user} {seenWhiteCards} {seenBlackCards} />
    {:else if game.state === 'RANKINGS'}
    <Rankings {game} {user} />
    {/if}
</div>