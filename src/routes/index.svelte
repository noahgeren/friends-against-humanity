<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { auth, db } from '$lib/firebase';
    import { get, set, ref } from 'firebase/database';
    import { signInAnonymously } from 'firebase/auth';

    let accessCode = '', nickname = '';

    onMount(() => {
        accessCode = localStorage.getItem('accessCode') || '';
        nickname = localStorage.getItem('nickname') || '';
    });

    async function join() {
        const gameSnapshot = await get(ref(db, 'games/' + accessCode.toUpperCase()));
        if(!gameSnapshot.exists()) {
            alert('No game exists with that access code');
            return;
        }
        const game = gameSnapshot.val();
        const user = (await signInAnonymously(auth)).user;

        const matchingPlayers = Object.entries(game.players || {}).filter(entry => entry[1].nickname.toUpperCase() === nickname.toUpperCase());

        if(matchingPlayers.length > 0) {
            if(matchingPlayers[0][0] !== user.uid) {
                alert('That nickname is already taken');
                return;
            }
            goto(`/game/?code=${accessCode}`);
            return;
        }

        try {
            await set(ref(db, `games/${accessCode.toUpperCase()}/players/${user.uid}`), {
                nickname,
                points: 0
            });
            localStorage.setItem('accessCode', accessCode);
            localStorage.setItem('nickname', nickname);
            goto(`/game/?code=${accessCode}`);
        } catch (e) {
            console.error(e);
            alert('Error joining game');
        }
    }

</script>
<div class="fah-card mx-auto mt-3">
    <form on:submit|preventDefault={join} class="card-body">
        <h1 class="card-title text-6xl">Friends<br/>Against<br/>Humanity</h1>
        <div class="my-2 text-xl">An online clone of Cards Against Humanity</div>
        <input
            placeholder="Access Code"
            class="input input-lg text-white w-full"
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
            <button type="submit" class="btn btn-lg btn-primary text-white shadow">Join Game</button>
        </div>
    </form>
</div>
