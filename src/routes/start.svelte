<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { auth, db } from "$lib/firebase";
    import { signInAnonymously } from "firebase/auth";
    import { serverTimestamp, ref, set } from "firebase/database";
    import Loading from "../game-pages/loading.svelte";
    
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    onMount(async () => {
        let accessCode = '';
        for (let i = 0; i < 5; i++) {
            accessCode += charSet.charAt(Math.floor(Math.random() * charSet.length));
        }

        let user = (await signInAnonymously(auth)).user;

        try {
            await set(ref(db, 'games/' + accessCode), {
                admin: user.uid,
                state: {
                    value: 'LOBBY',
                    timestamp: serverTimestamp()
                }
            });
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
