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
    <!-- Each Mode will have it's Name and Volume Limit -->
    <div class="Mode_List">
        {#each $mode_list as mode (mode.id)}
            <div class="mode-item">
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
    .mode-item {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
        padding: 10px;
        border-bottom: 1px solid #ccc;
    }
    .Mode_List {
        padding: 20px;
        background-color: white;
        max-height: 80vh;
        overflow-y: auto;
    }
</style>
