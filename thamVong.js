document.addEventListener("DOMContentLoaded", () => {
  const frame = document.querySelector(".frame");
  const frame2 = document.querySelector(".frame2");
  const textWrapper = document.querySelector(".text-wrapper");
  const divElement = document.querySelector(".div");
  const textWrapper4 = document.querySelector(".text-wrapper-4");

  // Make sure frame is fully visible on load (remove opacity set to 0)
  frame.style.opacity = 1;
  frame.style.pointerEvents = "auto";

  // IntersectionObserver for adding/removing 'active' classes for text elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          textWrapper.classList.add("active");
          divElement.classList.add("active");
          textWrapper4.classList.add("active");
        } else {
          textWrapper.classList.remove("active");
          divElement.classList.remove("active");
          textWrapper4.classList.remove("active");
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  if (frame2) {
    observer.observe(frame2);
  }
});

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
  const frame2 = document.querySelector(".frame2");

  frame2.style.opacity = frame2Opacity;
  frame2.style.pointerEvents = frame2Opacity > 0 ? "auto" : "none";
});

document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.querySelector(".sound-overlay");

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
    const audio = new Audio("assets/thamVong.mp3"); // Ensure correct file path and extension
    audio.loop = true;

    // Create a new audio context
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Create a source node from the audio
    const source = audioContext.createMediaElementSource(audio);

    // Create a gain node (for controlling volume)
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.2; // Set volume to 20% of the original

    // Connect the audio source to the gain node and then to the destination (speakers)
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Play the sound
    audio.play().catch((error) => {
      console.log("Audio play failed: ", error);
    });
  };

  // Trigger microphone permission request when the overlay is clicked
  overlay.addEventListener("click", allowSound);
});
