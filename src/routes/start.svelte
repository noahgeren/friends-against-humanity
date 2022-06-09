<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { auth, db } from "$lib/firebase";
    import { onAuthStateChanged } from "firebase/auth";
    import { ref, set, get } from "firebase/database";
    import Loading from "../game-pages/loading.svelte";
    
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    onMount(async () => {
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
            
        try {
            await set(ref(db, 'games/' + accessCode), {
                admin: user.uid,
                state: 'LOBBY',
            });
            localStorage.clear();
            localStorage.setItem('startedGame', 'true');
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
