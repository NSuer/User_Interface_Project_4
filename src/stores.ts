import { writable } from "svelte/store";
import { get } from 'svelte/store';

// Animation Stuff --------------------------------------------------------------
export let goal = writable(1000000);
export let current_count = writable(0);
export let water_level = writable(50); // Initial water level
export let is_paused = writable(false);
export let reset_bucket = writable(false);
export let is_bucket_full = writable(false);
export let resetting = writable(false);

current_count.subscribe(count => {
    if (count >= get(goal)) {
        is_bucket_full.set(true);
    } else {
        is_bucket_full.set(false);
    }
});

setInterval(() => {
    if (!get(is_paused)) {
        let value = get(current_volume);
        let mode: ModeObject = get(current_mode);
        if (value > mode.volume_limit) {
            current_count.update(n => n + 1);
            console.log("Current Count:", get(current_count));
        }
    }
}, 1000);

// ------------------------------------------------------------------------------

// Mode Stuff -------------------------------------------------------------------

export class ModeObject {
    id: number;
    name: string;
    volume_limit: number;
    count_threshold: number;

    constructor(id: number, name: string, volume_limit: number, count_threshold: number) {
        this.id = id;
        this.name = name;
        this.volume_limit = volume_limit;
        this.count_threshold = count_threshold;
    }
}

export let mode_list = writable([
    new ModeObject(0, "Silent", 10, 20),
    new ModeObject(1, "Quiet", 20, 15),
    new ModeObject(2, "Normal", 30, 25)
]);

export let current_mode = writable<ModeObject>(get(mode_list)[0]);
func_set_current_mode(0);

export function func_update_mode_list(mode_id: number, name?: string, volume_limit?: number, count_threshold?: number) {
    // If the mode already exists, update it
    let mode_list_array = get(mode_list);
    let mode_exists = false;
    let mode_index = -1;
    let i = 0;
    for (i = 0; i < mode_list_array.length; i++) {
        if (mode_list_array[i].id == mode_id) {
            mode_exists = true;
            mode_index = i;
        }
    }
    if (mode_exists) {
        if (name !== undefined) {
            mode_list_array[mode_index].name = name;
        }
        if (volume_limit !== undefined) {
            mode_list_array[mode_index].volume_limit = volume_limit;
        }
        if (count_threshold !== undefined) {
            mode_list_array[mode_index].count_threshold = count_threshold;
        }
    } else {
        // If the mode doesn't exist, add it
        mode_list_array.push(new ModeObject(mode_list_array.length, name || "Default", volume_limit || 0, count_threshold || 0));
    }
    mode_list.set(mode_list_array);
}

export function func_set_current_mode(mode_id) {
    let mode_list_array = get(mode_list);
    let i = 0;
    for (i = 0; i < mode_list_array.length; i++) {
        if (mode_list_array[i].id == mode_id) {
            current_mode.set(mode_list_array[i]);
            goal.set(mode_list_array[i].count_threshold);
        }
    }
}

export function func_delete_mode(mode_id) {
    let mode_list_array = get(mode_list);
    let i = 0;
    for (i = 0; i < mode_list_array.length; i++) {
        if (mode_list_array[i].id == mode_id) {
            mode_list_array.splice(i, 1);
        }
    }
    mode_list.set(mode_list_array);

    // Shift the mode IDs so that they are in order
    for (i = 0; i < mode_list_array.length; i++) {
        mode_list_array[i].id = i;
    }
}
// ------------------------------------------------------------------------------

// Microphone Stuff -------------------------------------------------------------
export let current_volume = writable(0.00);
export let current_color = writable("black"); // Color of the indicator

current_volume.subscribe(value => {
    let mode: ModeObject = get(current_mode);
    if (value > mode.volume_limit) {
        current_color.set("red");
    } else if (value < mode.volume_limit) {
        current_color.set("green");
    } else {
        current_color.set("blue");
    }
});

let interval_id: ReturnType<typeof setInterval> | null = null; // To manage `setInterval`
export const func_analyze_audio = async () => {
    try {
        console.log("Requesting microphone access...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone access granted.");

        const audio_context = new window.AudioContext();
        const analyser = audio_context.createAnalyser();

        // Connect microphone input to the analyser
        const source = audio_context.createMediaStreamSource(stream);
        source.connect(analyser);

        analyser.fftSize = 512; // Use a higher FFT size for more data points
        const data_array = new Uint8Array(analyser.frequencyBinCount);

        console.log("Starting audio analysis...");
        interval_id = setInterval(() => {
            analyser.getByteFrequencyData(data_array);

            // Log the raw data array for debugging
            // console.log("Audio Data Array:", data_array);

            // Calculate average noise level
            const avg_current_volume = data_array.reduce((sum, value) => sum + value, 0) / data_array.length;
            current_volume.set(parseFloat(avg_current_volume.toFixed(2))); // Update the reactive noise level

            // console.log(`Noise Level: ${current_volume}`);
        }, 100); // Update every 100ms
    } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Microphone access is required. Please enable it and try again.");
    }
};

export const func_stop_analyzing = () => {
    if (interval_id) clearInterval(interval_id);
    console.log("Stopped audio analysis.");
};
// ------------------------------------------------------------------------------
