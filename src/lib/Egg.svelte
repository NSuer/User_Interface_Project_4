<script lang="ts">
    import { goal, current_count } from "../stores";

    // Calculate the number of cracks to show based on current_count and goal
    $: cracksToShow = Math.min(Math.floor(($current_count / $goal) * 5), 5);

    // Break the egg when the count exceeds the goal
    $: isBroken = $current_count > $goal;
</script>

<div class="egg" class:isBroken>
    <div class="top"></div>
    <div class="bottom"></div>
    <div class="cracks">
        {#each Array(cracksToShow) as _, i}
            <div class="crack crack-{i}"></div>
        {/each}
    </div>
    {#if isBroken}
        <div class="crack-line"></div>
    {/if}
</div>

<style>
    .egg {
        position: relative;
        width: 100px;
        height: 130px;
        background: white;
        border-radius: 50% / 60%;
        border: 2px solid #000;
        margin: 1rem auto;
        overflow: hidden;
        transition: transform 0.5s ease;
    }

    .egg.isBroken {
        transform: scale(0.8) rotate(10deg);
        background: #f5e6cc;
    }

    .top,
    .bottom {
        position: absolute;
        width: 100%;
        height: 50%;
        background: white;
        border: 2px solid #000;
    }

    .top {
        top: 0;
        border-bottom: none;
    }

    .bottom {
        bottom: 0;
        border-top: none;
    }

    .egg.isBroken .top {
        transform: translateY(-10px) rotate(-10deg);
        background: #ffe0b3;
        transition: all 0.5s ease;
    }

    .egg.isBroken .bottom {
        transform: translateY(10px) rotate(10deg);
        background: #ffe0b3;
        transition: all 0.5s ease;
    }

    .cracks {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .crack {
        position: absolute;
        width: 2px;
        height: 30px;
        background: #000;
        transform: scaleY(0);
        animation: growCrack 0.3s ease forwards;
    }

    /* Dynamic crack positions */
    .crack-0 {
        top: 30%;
        left: 25%;
        transform-origin: top;
    }

    .crack-1 {
        top: 40%;
        left: 50%;
        transform-origin: top;
    }

    .crack-2 {
        top: 35%;
        left: 70%;
        transform-origin: top;
    }

    .crack-3 {
        top: 50%;
        left: 40%;
        transform-origin: top;
    }

    .crack-4 {
        top: 60%;
        left: 60%;
        transform-origin: top;
    }

    .egg.isBroken .crack {
        background: transparent; /* Cracks disappear when the egg breaks */
    }

    /* Crack Line */
    .crack-line {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 2px;
        background: black;
        z-index: 2;
    }

    @keyframes growCrack {
        from {
            transform: scaleY(0);
        }
        to {
            transform: scaleY(1);
        }
    }
</style>


