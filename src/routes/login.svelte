<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { auth } from '$lib/firebase';
    import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
    let email, password, loading = false, error = false;

    onMount(() => {
        let unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            if(user.email) {
                goto('/');
            }
        });
    });

    async function login() {
        loading = true;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            goto('/');
        } catch (e) {
            error = true;
        }
        loading = false;
    }
</script>
<div class="flex justify-end">
    <a href='/' class="btn btn-link">Home</a>
</div>
<div class="fah-card mx-auto">
    <form on:submit|preventDefault={login} class="card-body">
        <h1 class="card-title text-6xl">Friends<br/>Against<br/>Humanity</h1>
        <div class="my-2 text-xl">An online clone of Cards Against Humanity</div>
        {#if error}
        <div class="alert alert-error shadow-lg text-white">
        Incorrect username and/or password.
        </div>
        {/if}
        <input
            type="email"
            placeholder="Email Address"
            class="input input-lg text-white w-full"
            bind:value={email}
            required
        />
        <input
            type="password"
            placeholder="Password"
            class="input input-lg text-white w-full"
            bind:value={password}
            required
            />
        <div class="flex justify-center mt-3">
            <button
                type="submit"
                class="btn btn-lg btn-primary text-white shadow"
                class:loading
                disabled={loading}
            >Login</button>
        </div>
    </form>
</div>