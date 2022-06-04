<script>
    export let text = 'Loading';
</script>
<div class="self-center justify-self-center text-center h-48 mt-16">
    <div class="ball"></div>
</div>
<h1 class="text-5xl font-semibold mt-3">{text}</h1>
<style>
    .ball {
        @apply block w-16 h-16 rounded-full bg-primary mt-16 mx-auto;
        animation-name: bounce;
        animation-duration: 0.575s;
        animation-direction: alternate;
        animation-timing-function: cubic-bezier(0.6, 0.08, 0.8, 0.6);
        animation-iteration-count: infinite;
        box-shadow: 0 96px 16px rgba(0, 0, 0, 0.1);
    }
    
    @keyframes bounce {
        from {
            transform: translateY(-100%);
        }
    
        to {
            transform: translateY(100%);
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
        }
    }
</style>