<script lang="ts">
  import { onMount } from "svelte";
  import {
    func_analyze_audio,
    func_stop_analyzing,
    current_volume,
    current_color,
    isPaused,
    current_count,
    water_level,
    ResetBucket,
    isBucketFull,
    resetting,
  } from "./stores";
  import ModeCreateEditAndSelect from "./lib/ModeCreateEditAndSelect.svelte";
  import Bucket from "./lib/Bucket.svelte";

  let uniquekey = {};
  let resetKey = 0; // The key to force reload the component

  function start() {
    $isPaused = false;
  }

  function pause() {
    $isPaused = true;
  }

  function reset() {
    // The way this is done may seems weird but it's the only way I could get it to work

    $ResetBucket = true;
    $isPaused = true;
    $ResetBucket = false;
    $isBucketFull = false;
    $current_count = 0;
    $water_level = 50;
    uniquekey = {}; // Create a new object to trigger re-render
    resetKey += 1; // Each time you increment, Svelte will remount the component

    // Wait ten seconds then do all this again only once
    $resetting = true;
    setTimeout(() => {
      $ResetBucket = true;
      $isPaused = true;
      $ResetBucket = false;
      $isBucketFull = false;
      $current_count = 0;
      $water_level = 50;
      uniquekey = {}; // Create a new object to trigger re-render
      resetKey += 1; // Each time you increment, Svelte will remount the component
      $resetting = false;
    }, 10000);
  }

  onMount(() => {
    func_analyze_audio();

    return () => func_stop_analyzing();
  });
</script>

<main>
  <div class="decibelContainer">
    <div class="noise-level">Noise Level: {$current_volume}</div>
    <div
      class="indicator"
      style="background-color: {$current_color}; margin-left: 10px;"
    ></div>
  </div>
  {#key uniquekey}
    <Bucket key={resetKey} />
  {/key}
  <div>Count: {$current_count}</div>
  <div>Status: {$isPaused ? "Paused" : "Running"}</div>
  <div class="controls">
    <button on:click={start}>Start</button>
    <button on:click={pause}>Pause</button>
    <button on:click={reset}>Reset</button>
  </div>
  <ModeCreateEditAndSelect />
</main>

<style>
  .controls {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .controls button {
    margin: 5px;
  }
  .decibelContainer {
    display: flex;
    align-items: center;
    margin-top: 20px;
    justify-content: center;
  }
  .indicator {
    width: 20px;
    height: 20px;
    border-radius: 100%;
    background-color: var(--color, green);
    transition: background-color 0.3s ease;
    margin-left: 10px;
  }

  .noise-level {
    text-align: center;
    font-size: 1.2rem;
    margin-top: 0px;
  }
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
</style>
