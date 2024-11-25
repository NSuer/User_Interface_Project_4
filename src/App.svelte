<script lang="ts">
  import { onMount } from "svelte";
  import {
    func_analyze_audio,
    func_stop_analyzing,
    current_volume,
    current_color,
  } from "./stores";
  import ModeCreateEditAndSelect from "./lib/ModeCreateEditAndSelect.svelte";
  import AnimationGrid from "./lib/AnimationGrid.svelte";

  onMount(() => {
    func_analyze_audio();

    return () => func_stop_analyzing();
  });
</script>

<main>
  <AnimationGrid />
  <ModeCreateEditAndSelect />
  <div class="indicator" style="--color: {$current_color}"></div>
  <div class="noise-level">Noise Level: {$current_volume}</div>
</main>

<style>
  .indicator {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 20px auto;
    background-color: var(--color, green);
    transition: background-color 0.3s ease;
  }

  .noise-level {
    text-align: center;
    font-size: 1.2rem;
    margin-top: 10px;
  }
</style>
