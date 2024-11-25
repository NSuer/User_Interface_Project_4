<script>
    import { onMount } from "svelte";
  
    let noiseLevel = 0; // Reactive variable to store the noise level
    let color = "green"; // Color of the indicator
    let intervalId = null; // To manage `setInterval`
  
    const analyzeAudio = async () => {
      try {
        console.log("Requesting microphone access...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone access granted.");
  
        const audioContext = new window.AudioContext();
        const analyser = audioContext.createAnalyser();
  
        // Connect microphone input to the analyser
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
  
        analyser.fftSize = 512; // Use a higher FFT size for more data points
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
  
        console.log("Starting audio analysis...");
        intervalId = setInterval(() => {
          analyser.getByteFrequencyData(dataArray);
  
          // Log the raw data array for debugging
          console.log("Audio Data Array:", dataArray);
  
          // Calculate average noise level
          const avgNoiseLevel = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          noiseLevel = parseFloat(avgNoiseLevel.toFixed(2)); // Update the reactive noise level
  
          // Change color based on noise level
          color = avgNoiseLevel > 50 ? "red" : "green";
  
          console.log(`Noise Level: ${noiseLevel}, Color: ${color}`);
        }, 100); // Update every 100ms
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Microphone access is required. Please enable it and try again.");
      }
    };
  
    // Clean up when the component is destroyed
    const stopAnalyzing = () => {
      if (intervalId) clearInterval(intervalId);
      console.log("Stopped audio analysis.");
    };
  
    onMount(() => {
      analyzeAudio();
  
      return () => stopAnalyzing();
    });
  </script>
  
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
  
  <div class="indicator" style="--color: {color}"></div>
  <div class="noise-level">Noise Level: {noiseLevel}</div>
  
