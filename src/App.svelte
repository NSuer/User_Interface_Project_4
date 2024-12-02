<script lang="ts">
  import { onMount } from "svelte";
  import {
    func_analyze_audio,
    func_stop_analyzing,
    current_volume,
    current_color,
    is_paused,
    current_count,
    goal,
    water_level,
    reset_bucket,
    is_bucket_full,
    resetting,
  } from "./stores";
  import ModeCreateEditAndSelect from "./lib/ModeCreateEditAndSelect.svelte";
  import Bucket from "./lib/Bucket.svelte";

  let unique_key = {};
  let reset_key = 0; // The key to force reload the component

  function start() {
    $is_paused = false;
  }

  function pause() {
    $is_paused = true;
  }

  // Button Colors and disable
  let start_button_color = "gray";
  let pause_button_color = "gray";
  let reset_button_color = "gray";
  let start_button_disabled = false;
  let pause_button_disabled = false;
  let current_status = "null";
  let status_color = "gray";

  $: {
    if ($resetting) {
      current_status = "Resetting";
      status_color = "blue";
      start_button_color = "gray";
      pause_button_color = "gray";
      reset_button_color = "blue";
      start_button_disabled = true;
      pause_button_disabled = true;
    } else {
      if ($is_paused) {
        current_status = "Paused";
        status_color = "red";
        start_button_color = "gray";
        pause_button_color = "red";
        reset_button_color = "gray";
        pause_button_disabled = true;
        start_button_disabled = false;
      } else {
        current_status = "Running";
        status_color = "green";
        start_button_color = "green";
        pause_button_color = "gray";
        reset_button_color = "gray";
        start_button_disabled = true;
        pause_button_disabled = false;
      }
    }
  }

  function reset() {
    // The way this is done may seems weird but it's the only way I could get it to work

    $reset_bucket = true;
    $is_paused = true;
    $reset_bucket = false;
    $is_bucket_full = false;
    $current_count = 0;
    $water_level = 50;
    unique_key = {}; // Create a new object to trigger re-render
    reset_key += 1; // Each time you increment, Svelte will remount the component

    // Wait ten seconds then do all this again only once
    $resetting = true;
    setTimeout(() => {
      $reset_bucket = true;
      $is_paused = true;
      $reset_bucket = false;
      $is_bucket_full = false;
      $current_count = 0;
      $water_level = 50;
      unique_key = {}; // Create a new object to trigger re-render
      reset_key += 1; // Each time you increment, Svelte will remount the component
      $resetting = false;
    }, 10000);
  }

  onMount(() => {
    func_analyze_audio();

    return () => func_stop_analyzing();
  });
</script>

<main>
  <div class="decibel_container">
    <div class="noise_level">Noise Level: {$current_volume}</div>
    <div
      class="indicator"
      style="background-color: {$current_color}; margin-left: 10px;"
    ></div>
  </div>
  {#key unique_key}
    <Bucket key={reset_key} />
  {/key}
  <div class="status_row">
    <div>Count: {$current_count}</div>
    <div>Goal: {$goal}</div>
  </div>
  <div class="status_indicator" style="background-color: {status_color};">Status: {current_status}</div>
  <div class="controls">
    <button
      on:click={start}
      style="background-color: {start_button_color};" disabled={start_button_disabled}
      >Start</button
    >
    <button
      on:click={pause}
      style="background-color: {pause_button_color};" disabled={pause_button_disabled}
      >Pause</button
    >
    <button on:click={reset} style="background-color: {reset_button_color}"
      >Reset</button
    >
  </div>
  <ModeCreateEditAndSelect />
</main>

<style>
  .status_row {
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 10px;
  }
  .status_indicator {
    text-align: center;
    font-size: 1.2rem;
    border-radius: 10px;
    padding: 10px;
  }
  .controls {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .controls button {
    margin: 5px;
  }
  .decibel_container {
    display: flex;
    align-items: center;
    margin-top: 5px;
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
  .noise_level {
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
  button {
    padding: 10px 50px;
    border: none;
    cursor: pointer;
    background-color: gray;
    outline: none;
    transition: background-color 0.3s ease;
  }
</style>
