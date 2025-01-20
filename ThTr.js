window.addEventListener("scroll", () => {
  const textWrapper = document.querySelector(".frame");
  const startFade = 0; // Starting scroll position for fading
  const endFade = 200; // Scroll position where the text fully fades out (adjust as needed)

  const scrollTop = window.scrollY;

  if (scrollTop >= startFade && scrollTop <= endFade) {
    // Calculate opacity as a linear fade-out between startFade and endFade
    const opacity = 1 - (scrollTop - startFade) / (endFade - startFade);
    textWrapper.style.opacity = opacity;
  } else if (scrollTop > endFade) {
    // Fully transparent after the fade-out range
    textWrapper.style.opacity = 0;
  } else {
    // Fully visible before the fade-out range
    textWrapper.style.opacity = 1;
  }
});

window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;

  // Calculate opacity based on scroll position
  const frameOpacity = Math.max(1 - scrollPosition / windowHeight, 0);
  const frame2Opacity = Math.min(scrollPosition / windowHeight, 1);

  // Apply opacity to frames
  const frame2 = document.getElementById("frame2");

  frame2.style.opacity = frame2Opacity;
  frame2.style.pointerEvents = frame2Opacity > 0 ? "auto" : "none";
});

document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.querySelector(".sound-overlay");
  let audio = null;
  let audioContext = null;
  let gainNode = null;

  // Function to hide the overlay and allow sound
  const allowSound = async () => {
    try {
      // Requesting microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop()); // Stop the microphone after granting permission
      console.log("Microphone access granted!");

      playSound(); // Play sound after permission is granted

      // Fade out the overlay
      overlay.style.opacity = 0;

      // Wait for the overlay to fully fade out before removing it
      setTimeout(() => {
        overlay.style.display = "none"; // Remove it from the DOM
      }, 500); // Match the duration of the fade-out
    } catch (error) {
      console.log("Permission denied or failed:", error);
    }
  };

  // Function to play sound with Web Audio API for volume control
  const playSound = () => {
    audio = new Audio("assets/STE-012.mp3"); // Ensure correct file path and extension
    audio.loop = true;

    // Create a new audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create a source node from the audio
    const source = audioContext.createMediaElementSource(audio);

    // Create a gain node (for controlling volume)
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5; // Initial volume, can be changed by mouse position

    // Connect the audio source to the gain node and then to the destination (speakers)
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Play the sound
    audio.play().catch((error) => {
      console.log("Audio play failed: ", error);
    });
  };

  // Function to change the volume based on mouse position
  const changeVolumeOnMouseMove = (e) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Get the mouse position relative to the window
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Determine the volume based on the mouse position
    if (mouseY < height / 3) {
      if (mouseX < width / 3) {
        // Top-left
        gainNode.gain.value = 0.2; // Max volume
      } else if (mouseX > (2 * width) / 3) {
        // Top-right
        gainNode.gain.value = 0.6; // Medium volume
      } else {
        // Top-middle
        gainNode.gain.value = 0.8; // Slightly lower volume
      }
    } else if (mouseY > (2 * height) / 3) {
      if (mouseX < width / 3) {
        // Bottom-left
        gainNode.gain.value = 0.4; // Lower volume
      } else if (mouseX > (2 * width) / 3) {
        // Bottom-right
        gainNode.gain.value = 0.2; // Very low volume
      } else {
        // Bottom-middle
        gainNode.gain.value = 0.9; // No sound
      }
    } else {
      // Middle area
      gainNode.gain.value = 0.5; // Default medium volume
    }
  };

  // Trigger microphone permission request when the overlay is clicked
  overlay.addEventListener("click", allowSound);

  // Add mousemove event listener to change volume based on mouse position
  window.addEventListener("mousemove", changeVolumeOnMouseMove);
});
