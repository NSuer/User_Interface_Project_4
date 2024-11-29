<!-- Credit to 2D water simulation by Christopher Yann Moussaba (https://codepen.io/ymoussaba/pen/jRXrGq)
I used this as a reference for my water. It was heavily referenced for my water physics but I made changes. -->
<script lang="ts">
    export let key: number;
    import {
        goal,
        current_count,
        water_level,
        ResetBucket,
        isBucketFull,
        isPaused,
        resetting,
    } from "../stores";
    import { onMount } from "svelte";

    console.log("Bucket", key);

    let canvas;
    let ctx;
    let drops = [];
    let water = [];
    let shower = null;

    function resetDroplets() {
        // Destroy all droplets
        drops = [];

        // Reset water level and other related states
        $water_level = 50; // Reset water level to the initial state

        // Reset all springs (water points) to their initial height
        water.forEach((spring) => {
            spring.height = h - $water_level; // Reset spring height based on the water level
            spring.speed = 0; // Reset speed to prevent previous momentum
        });

        // Optionally reset other state variables if needed
        previous_count = $current_count; // Reset previous_count to current_count
    }

    const res = 50;
    const k = 0.0025;
    const tension = 0.005;
    const dampen = 0.02;

    let w;
    let h;
    let previous_count = 0;

    function updateCanvasSize() {
        w = window.innerWidth;
        h = window.innerHeight + 200;
        canvas.width = w;
        canvas.height = h;
    }

    class Droplet {
        x: number;
        y: number;
        vel: number;
        col: number;

        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vel = Math.random() * 10 - 5;
            this.col = Math.floor((res / w) * this.x);
        }

        update() {
            this.vel *= 0.7;
            this.y += Math.random() * 1.5 + 1;
            this.x += this.vel;
            this.col = Math.floor((res / w) * this.x);

            if (
                this.x <= 0 ||
                this.x >= w ||
                this.y <= h ||
                this.y <= water[this.col]?.height
            ) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = "#28d9e2";
                ctx.fill();
            } else {
                this.destroy();
                if (this.col >= 0 && this.col < water.length) {
                    if ($water_level === h) {
                        $water_level = h - 1;
                    } else {
                        $water_level +=
                            (h - $water_level) / ($goal - previous_count);
                    }

                    water[this.col].speed = 1;
                }
            }
        }

        destroy() {
            drops = drops.filter((d) => d !== this);
        }
    }

    class Spring {
        height: number;
        speed: number;
        constructor() {
            this.height = h - $water_level;
            this.speed = 0;
        }

        update() {
            const x = h - $water_level - this.height;
            this.speed += tension * x - this.speed * dampen;
            this.height += this.speed;
            if (this.height > h) this.height = h;
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);

        drops.forEach((d) => d.update());
        water.forEach((s) => s.update());

        let ldelta = Array(water.length).fill(0);
        let rdelta = Array(water.length).fill(0);

        for (let j = 0; j < 8; j++) {
            for (let i = 0; i < water.length; i++) {
                if (i > 0) {
                    ldelta[i] = k * (water[i].height - water[i - 1].height);
                    water[i - 1].speed += ldelta[i];
                }
                if (i < water.length - 1) {
                    rdelta[i] = k * (water[i].height - water[i + 1].height);
                    water[i + 1].speed += rdelta[i];
                }
            }
            for (let i = 0; i < water.length; i++) {
                if (i > 0) water[i - 1].height += ldelta[i];
                if (i < water.length - 1) water[i + 1].height += rdelta[i];
            }
        }

        const lingrad = ctx.createLinearGradient(0, 0, 0, h);
        lingrad.addColorStop(0, "#28d9e2");
        lingrad.addColorStop(1, "#116691");

        ctx.fillStyle = lingrad;
        ctx.beginPath();
        ctx.moveTo(0, water[0].height);
        water.forEach((s, i) => ctx.lineTo((i + 1) * (w / res), s.height));
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.fill();
    }

    $: {
        if ($current_count > previous_count) {
            const increment = $current_count - previous_count;
            for (let i = 0; i < increment; i++) {
                drops.push(
                    new Droplet(w / 2 + ((Math.random() * w) / 4 - w / 8), 0),
                );
            }
            previous_count = $current_count;
        }
    }

    onMount(() => {
        updateCanvasSize();
        ctx = canvas.getContext("2d");

        for (let i = 0; i < res; i++) {
            water.push(new Spring());
        }

        window.addEventListener("resize", updateCanvasSize);

        setInterval(animate, 1000 / 60);

        return () => {
            window.removeEventListener("resize", updateCanvasSize);
        };
    });
</script>

<div class="container">
    <div class="bucket">
        <canvas bind:this={canvas}></canvas>
        {#if $isBucketFull === true}
            <div class="alert">Goal Reached!</div>
        {/if}
        {#if $resetting === true}
            <div class="alert">Resetting...</div>
        {/if}
    </div>
</div>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 70vw;
        height: 60vh;
    }
    .bucket {
        position: relative;
        width: 100%;
        height: 100%;
        border: 5px solid #8b4513;
        overflow: hidden;
        background: linear-gradient(to bottom, #8b4513 0%, #a0522d 100%);
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
    }

    canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .alert {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        background-color: #28d9e2;
        color: white;
        font-size: 24px;
        border-radius: 10px;
        animation: fadeInOut 2s infinite;
    }

    @keyframes fadeInOut {
        0%,
        100% {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
    }
</style>
