<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { auth, db } from "$lib/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import { ref, set, get } from "firebase/database";
    import Loading from "../game-pages/loading.svelte";
    
    // const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    onMount(async () => {
        localStorage.clear();
        let user;
        try {
            user = await new Promise((resolve, reject) => {
                const unsubscribe = onAuthStateChanged(auth, async (user) => {
                    unsubscribe();
                    if(user && user.email) {
                        resolve(user);
                    } else {
                        reject();
                    }
                });
            });
        } catch (e) {
            goto('/');
            return;
        }

        // let accessCode = '';
        // for (let i = 0; i < 5; i++) {
        //     accessCode += charSet.charAt(Math.floor(Math.random() * charSet.length));
        // }
        let accessCode = (await get(ref(db, 'accessCodes/' + user.uid))).val();

        if(!accessCode) {
            goto('/');
            return;
        }

        const isPlayer = confirm('Do you also want to play from this device?');
        try {
            const game = {
                admin: user.uid,
                state: 'LOBBY',
            };
            if(isPlayer) {
                game.players = {};
                game.players[user.uid] = {
                    nickname: prompt('Please enter the nickname you want to use:'),
                    points: 0
                };
            } else {
                localStorage.setItem('startedGame', 'true');
            }
            await set(ref(db, 'games/' + accessCode), game);
            
            goto(`/game/?code=${accessCode}`);
        } catch (e) {
            console.error(e);
            alert("Error starting game");
        }
    });
</script>
<div class="flex flex-col items-center">
    <Loading msg="Starting game..." />
</div>
