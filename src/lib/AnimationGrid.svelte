<script lang="ts">
    import { goal, current_count } from "../stores";

    const gridWidth = 100; // Width of the grid in cells
    const gridHeight = 100; // Height of the grid in cells

    // Bucket boundaries (defined as coordinate ranges)
    const bucketXStart = 10; // Start X-coordinate of the bucket
    const bucketXEnd = 90; // End X-coordinate of the bucket
    const bucketYStart = 10; // Top Y-coordinate of the bucket
    const bucketYEnd = 70; // Bottom Y-coordinate of the bucket

    // Derived water level based on count and goal
    $: waterLevel = Math.min($current_count / $goal, 1) * (bucketYEnd - bucketYStart);
    // Dynamic styles for grid items
    import { onMount } from "svelte";

    let parentWidth = 0;
    let parentHeight = 0;

    onMount(() => {
        const parentElement = document.querySelector('.grid-container');
        if (parentElement) {
            parentWidth = parentElement.clientWidth;
            parentHeight = parentElement.clientHeight;
        }
    });

    $: cellWidth = `${parentWidth / gridWidth}px`;
    $: cellHeight = `${parentHeight / gridHeight}px`; // Each cell takes a fraction of parent height
</script>

<div class="grid-container">
    {#each Array(gridHeight) as _, y}
        {#each Array(gridWidth) as _, x}
            <div
                class="grid-item"
                style="width: {cellWidth}; height: {cellHeight};"
                class:bucket={x >= bucketXStart && x <= bucketXEnd && y >= bucketYStart && y <= bucketYEnd}
                class:water={x >= bucketXStart && x <= bucketXEnd && y > bucketYEnd - waterLevel && y <= bucketYEnd}
                class:overflow={$current_count > $goal && x >= bucketXStart && x <= bucketXEnd && y > bucketYEnd - waterLevel}
            ></div>
        {/each}
    {/each}
</div>

<style>
    .grid-container {
        display: grid;
        grid-template-columns: repeat(100, 1fr);
        width: 100%;
        height: 100vh; /* Fit the viewport height */
        overflow: auto; /* Enable scrolling for the large grid */
    }

    .grid-item {
        background-color: lightgray; /* Default color for cells */
    }

    .bucket {
        background-color: #444; /* Bucket boundary color */
        border-radius: 0 0 10px 10px; /* Rounded bottom corners for bucket shape */
    }

    .water {
        background-color: lightblue; /* Water filling color */
    }

    .overflow {
        background-color: red; /* Overflow color */
        animation: flash 0.5s infinite alternate;
    }

    @keyframes flash {
        0% {
            background-color: red;
        }
        100% {
            background-color: orange;
        }
    }
</style>
