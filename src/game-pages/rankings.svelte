<script>
    import { db } from '$lib/firebase';
    import { set, ref } from 'firebase/database';

    export let game, user;
    let rankings = [];
    $: {
        rankings = Object.entries(game.players)
                        .map(([uid, player]) => ({
                            ...player,
                            uid
                        })).sort((a, b) => b.points - a.points);
        for(let i = 0, place = 1; i < rankings.length; i++) {
            if(i > 0 && rankings[i].points < rankings[i - 1].points) {
                place++;
            } 
            rankings[i].place = getNumberWithOrdinal(place);
        }
    };
    let isPlayer = !localStorage.getItem('startedGame');
    
    function getPlace() {
        return rankings.find((player) => player.uid === user.uid).place;
    }

    function getNumberWithOrdinal(n) {
        let s = ["th", "st", "nd", "rd"],
            v = n % 100;
        return `${n}<sup>${s[(v - 20) % 10] || s[v] || s[0]}</sup>`;
    }

    async function next() {
        try {
            await set(ref(db, `games/${game.accessCode}/state`), 'ANSWER');
        } catch (e) {
            console.error(e);
            alert("Error going to next card");
        }
    }
</script>
<h1 class="text-5xl text-center font-semibold">{game.winner.nickname} won!</h1>
<h1 class="text-3xl w-full max-w-md text-center mb-3">{@html game.winner.selected}</h1>
<div class="fah-card mx-auto">
    <div class="card-body">
        <h3 class="text-5xl text-center font-semibold mb-3">Rankings</h3>
        {#if isPlayer}
        <h4 class="text-2xl text-center">You are in {@html getPlace()} place</h4>
        {/if}
        <table class="text-xl">
        {#each rankings as player}
        <tr>
            <td>{@html player.place}</td>
            <td>{player.nickname}</td>
            <td>{player.points}</td>
        </tr>
        {/each}
        </table>
        {#if game.admin === user.uid}
        <div class="text-center mt-3">
            <button class="btn btn-primary btn-lg text-white shadow" on:click={next}>
                Next Card
            </button>
        </div>
        {/if}
    </div>
</div>