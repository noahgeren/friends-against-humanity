<script>
    import { goto } from '$app/navigation';
    import { auth } from '$lib/firebase';
    import { signInWithEmailAndPassword } from 'firebase/auth';
    let email, password, loading = false, error = false;

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
<div class="fah-card mx-auto mt-3">
    <form on:submit|preventDefault={login} class="card-body">
        <a href="/" class="card-title text-6xl mb-5">Friends<br/>Against<br/>Humanity</a>
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