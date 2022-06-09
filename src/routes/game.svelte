<script>
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { auth, db } from '$lib/firebase';
    import { cards } from '$lib/cards';
    import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
    import { onValue, ref } from 'firebase/database';
    import SelectCard from '../game-pages/select-card.svelte';
    import Lobby from '../game-pages/lobby.svelte';
    import Rankings from '../game-pages/rankings.svelte';
    import Loading from '../game-pages/loading.svelte';

    let code, user, game, unsubscribe;

    let seenWhiteCards = new Set(), seenBlackCards = new Set();
    $: {
        if(game) {
            seenBlackCards.add(game.blackCard);
            Object.values(game.players || {}).forEach((player) => {
                seenWhiteCards.add(player.selected);
            });
            if(seenBlackCards.size >= cards.blackCards.length) {
                seenBlackCards = new Set();
            }
            if(seenWhiteCards.size >= cards.whiteCards.length) {
                seenWhiteCards = new Set();
            }
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
        user = await new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                unsubscribe();
                if(user) {
                    resolve(user);
                } else {
                    resolve((await signInAnonymously(auth)).user);
                }
            });
        });
        unsubscribe = onValue(ref(db, 'games/' + code.toUpperCase()), (snapshot) => {
            game = {
                ...snapshot.val(),
                accessCode: snapshot.key
            };
            if(!snapshot.exists() ||
                (game.players && user.uid !== game.admin &&
                    !Object.keys(game.players).some((uid) => user.uid === uid))) {
                window.location.href = '/';
                return;
            }
        });
        seenWhiteCards = new Set(JSON.parse(localStorage.getItem('seenWhiteCards') || '[]')), seenBlackCards = new Set(JSON.parse(localStorage.getItem('seenBlackCards') || '[]'));
    });
    onDestroy(() => {
        unsubscribe && unsubscribe();
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