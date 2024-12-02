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
        <div class="mode-item header">
            <div class="label">Name</div>
            <div class="label">Volume Limit</div>
            <div class="label">Count Threshold</div>
            <div class="label">Actions</div>
        </div>
    </div>
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
                <input
                    type="number"
                    bind:value={mode.count_threshold}
                    on:change={() =>
                        func_update_mode_list(mode.count_threshold)}
                />
                <div class="actions">
                    <button on:click={() => func_set_current_mode(mode.id)}
                        >Select</button
                    >
                    <button on:click={() => func_delete_mode(mode.id)}
                        >Delete</button
                    >
                </div>
            </div>
        {/each}
    </div>
    <div class="add-mode">
        <button on:click={() => func_update_mode_list(-1)}>Add New Mode</button>
    </div>
</main>

<style>
    .label {
        flex: 1;
        font-weight: bold;
    }
    .mode-item input {
        flex: 1;
        margin-right: 10px;
    }
    .mode-item .actions {
        display: flex;
        gap: 10px;
    }
    .mode-item button {
        margin-left: 10px;
    }
    button {
        padding: 5px 10px;
        border: none;
        cursor: pointer;
        background-color: gray;
    }
    .mode-item {
        display: flex;
        justify-content: space-between;
        margin: 10px 0;
        padding: 10px;
        border-bottom: 1px solid #ccc;
    }
    .mode-item.selected {
        background-color: blue;
        font-weight: bold;
    }
    .Mode_List {
        max-height: 80vh;
        overflow-y: auto;
    }
    .header {
        font-weight: bold;
    }
</style>
