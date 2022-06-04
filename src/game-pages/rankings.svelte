<script>
    let players = [
        {
            nickname: 'TestOne',
            points: 5
        },
        {
            nickname: 'Teeeest Thr33',
            points: 3
        },
        {
            nickname: 'xTest Twox',
            points: 5
        },
    ];

    
    /**
    * @type {any[]}
    */
    let rankings = [];
    $: {
        rankings = players.sort((a, b) => b.points - a.points);
        for(let i = 0, place = 1; i < rankings.length; i++) {
            if(i > 0 && rankings[i].points < rankings[i - 1].points) {
                place++;
            } 
            rankings[i].place = getNumberWithOrdinal(place);
        }
    };
    /**
     * 
     * @param {number} n
     */
    function getNumberWithOrdinal(n) {
        let s = ["th", "st", "nd", "rd"],
            v = n % 100;
        return `${n}<sup>${s[(v - 20) % 10] || s[v] || s[0]}</sup>`;
    }
</script>
<div class="fah-card mx-auto">
    <div class="card-body">
        <h3 class="card-title text-5xl mb-3">Rankings</h3>
        <table class="text-xl">
        {#each rankings as player}
        <tr>
            <td>{@html player.place}</td>
            <td>{player.nickname}</td>
            <td>{player.points}</td>
        </tr>
        {/each}
        </table>
    </div>
</div>