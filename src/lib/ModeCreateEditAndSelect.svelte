<script lang="ts">
    import {
        mode_list,
        current_mode,
        func_update_mode_list,
        func_set_current_mode,
        func_delete_mode,
    } from "../stores";
</script>

<main>
    <!-- A Scrollable list of Modes, where you can edit, delete, and add new modes -->
    <!-- Each Mode will have its Name and Volume Limit -->
    <div class="Mode_List">
        {#each $mode_list as mode (mode.id)}
            <div
                class="mode-item"
                class:selected={mode.id === $current_mode.id}
            >
                <input
                    type="text"
                    bind:value={mode.name}
                    on:change={() => func_update_mode_list(mode.id)}
                />
                <input
                    type="number"
                    bind:value={mode.volume_limit}
                    on:change={() => func_update_mode_list(mode.id)}
                />
                <button on:click={() => func_set_current_mode(mode.id)}
                    >Select</button
                >
                <button on:click={() => func_delete_mode(mode.id)}
                    >Delete</button
                >
            </div>
        {/each}
    </div>

    

    <div class="add-mode">
        <button on:click={() => func_update_mode_list(-1)}>Add New Mode</button>
    </div>
</main>

<style>
    button {
        padding: 5px 10px;
        border: none;
        cursor: pointer;
    }
    .mode-item {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
        padding: 10px;
        border-bottom: 1px solid #ccc;
    }
    .mode-item.selected {
        background-color: lightblue;
        outline: 2px solid blue;
        font-weight: bold;
    }
    .Mode_List {
        max-height: 80vh;
        overflow-y: auto;
    }
</style>
