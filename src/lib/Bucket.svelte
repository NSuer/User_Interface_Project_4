<script lang="ts">
    import { goal, current_count } from "../stores";
</script>

<div class="bucket">
    <div
        class="water"
        style="height: {Math.min(($current_count / $goal) * 100, 100)}%;"
    ></div>
    {#if $current_count > $goal}
        <div class="overflow">💧 Overflow!</div>
    {/if}
</div>

<style>
    .bucket {
        position: relative;
        width: 100px;
        height: 150px;
        border: 2px solid #000;
        border-radius: 10px;
        overflow: hidden;
        margin: 0 auto;
    }
    .water {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: blue;
        transition: height 0.5s ease;
    }
    .overflow {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        color: red;
        font-size: 1rem;
        animation: bounce 1s infinite;
    }
    @keyframes bounce {
        0%,
        100% {
            transform: translateX(-50%) translateY(-10px);
        }
        50% {
            transform: translateX(-50%) translateY(0);
        }
    }
</style>
