<script>
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { auth, db } from '$lib/firebase';
    import { get, set, ref } from 'firebase/database';
    import { signInAnonymously, onAuthStateChanged, signOut } from 'firebase/auth';

    let accessCode = '', nickname = '', loading = false, user;

    let unsubscribe;

    onMount(() => {
        accessCode = localStorage.getItem('accessCode') || '';
        nickname = localStorage.getItem('nickname') || '';
        
        unsubscribe = onAuthStateChanged(auth, (newUser) => {
            user = newUser;
        })
    });

    onDestroy(() => {
        unsubscribe && unsubscribe();
    });

    async function join() {
        loading = true;
        const gameSnapshot = await get(ref(db, 'games/' + accessCode.trim().toUpperCase()));
        if(!gameSnapshot.exists()) {
            alert('No game exists with that access code');
            loading = false;
            return;
        }
        const game = gameSnapshot.val();
        if(!user) {
            user = (await signInAnonymously(auth)).user;
        }

        const matchingPlayers = Object.entries(game.players || {}).filter(entry => entry[1].nickname.toUpperCase() === nickname.toUpperCase());

        if(matchingPlayers.length > 0) {
            if(matchingPlayers[0][0] !== user.uid) {
                alert('That nickname is already taken');
                loading = false;
                return;
            }
            goto(`/game/?code=${accessCode.trim()}`);
            loading = false;
            return;
        }

        try {
            await set(ref(db, `games/${accessCode.trim().toUpperCase()}/players/${user.uid}`), {
                nickname,
                points: 0
            });
            localStorage.clear();
            localStorage.setItem('accessCode', accessCode);
            localStorage.setItem('nickname', nickname);
            goto(`/game/?code=${accessCode}`);
        } catch (e) {
            console.error(e);
            alert('Error joining game');
        }
        loading = false;
    }

    function logout() {
        signOut(auth);
    }
</script>
<div class="flex justify-end">
    {#if !user?.email}
    <a href='/login/' class="btn btn-link">Login</a>
    {:else}
    <button class="btn btn-link" on:click={logout}>Logout</button>
    {/if}
</div>
<div class="fah-card mx-auto">
    <form on:submit|preventDefault={join} class="card-body">
        <h1 class="card-title text-6xl">Friends<br/>Against<br/>Humanity</h1>
        <div class="my-2 text-xl">An online clone of Cards Against Humanity</div>
        <input
            placeholder="Access Code"
            class="input input-lg text-white w-full"
            autocomplete="off"
            autocorrect="off"
            spellcheck="off"
            bind:value={accessCode}
            required
        />
        <input
            placeholder="Nickname"
            class="input input-lg text-white w-full"
            maxlength="15"
            bind:value={nickname}
            required
            />
        <div class="flex justify-center mt-3">
            <button
                type="submit"
                class="btn btn-lg btn-primary text-white shadow"
                class:loading
                disabled={loading}
            >Join Game</button>
            {#if user?.email}
            <a href="/start/" class="btn btn-lg btn-link">
                Start Game
            </a>
            {/if}
        </div>
    </form>
</div>
