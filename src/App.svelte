<script lang="ts">
  import { onMount } from "svelte";
  import {
    func_analyze_audio,
    func_stop_analyzing,
    current_volume,
    current_color,
  } from "./stores";
  import ModeCreateEditAndSelect from "./lib/ModeCreateEditAndSelect.svelte";
  import Bucket from "./lib/Bucket.svelte";
  import Egg from "./lib/Egg.svelte";

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
  <Bucket />
  <ModeCreateEditAndSelect />
</main>

<style>
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
    color: black;
  }
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: lightgray;
  }
</style>
