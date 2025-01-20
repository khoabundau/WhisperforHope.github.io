document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.querySelector(".sound-overlay");
  const audio = new Audio("assets/Khoi.mp3"); // Ensure correct file path and extension
  let fadeInterval;

  // Function to play sound with fade-in effect
  const playSound = () => {
    audio.loop = true;
    audio.volume = 0; // Start with volume at 0 (silent)
    audio.play().catch((error) => {
      console.log("Audio play failed: ", error);
    });

    // Gradually increase the volume to create the fade-in effect
    let volume = 0;
    fadeInterval = setInterval(() => {
      if (volume < 1) {
        volume += 0.05; // Increase volume by 0.05 each time
        audio.volume = volume;
      } else {
        clearInterval(fadeInterval); // Stop the fade when volume reaches 1
      }
    }, 50); // Adjust the duration of the fade-in
  };

  // Function to fade out sound (volume decreases to 0)
  const fadeOutSound = () => {
    clearInterval(fadeInterval); // Clear any ongoing fade-in
    let volume = audio.volume;
    fadeInterval = setInterval(() => {
      if (volume > 0) {
        volume -= 0.05; // Decrease volume by 0.05 each time
        audio.volume = volume;
      } else {
        clearInterval(fadeInterval); // Stop the fade when volume reaches 0
        audio.pause(); // Pause the audio when it's faded out
      }
    }, 50); // Adjust the duration of the fade-out
  };

  // Function to handle click to allow sound
  const allowSound = async () => {
    try {
      // Requesting microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop()); // Stop the microphone after granting permission
      console.log("Microphone access granted!");

      playSound(); // Play sound after permission is granted

      // Fade out the overlay
      overlay.style.opacity = 0;
      setTimeout(() => {
        overlay.style.display = "none"; // Remove it from the DOM
      }, 500); // Match the duration of the fade-out
    } catch (error) {
      console.log("Permission denied or failed:", error);
    }
  };

  // Trigger microphone permission request when the overlay is clicked
  overlay.addEventListener("click", allowSound);

  // Fade out sound when navigating to another page (on anchor link click)
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default anchor link behavior
      fadeOutSound(); // Fade out the sound
      setTimeout(() => {
        window.location.href = link.href; // Navigate to the target page after sound fades out
      }, 500); // Wait until fade-out completes before navigating
    });
  });
});

// Scroll-related functionality (for your other effects)
window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;

  // Calculate opacity based on scroll position
  const frameOpacity = Math.max(1 - scrollPosition / windowHeight, 10);
  const frame2Opacity = Math.min(scrollPosition / windowHeight, 1);

  // Apply opacity to frames
  const frame2 = document.querySelector(".frame2");

  frame2.style.opacity = frame2Opacity;
  frame2.style.pointerEvents = frame2Opacity > 0 ? "auto" : "none";
});

window.addEventListener("scroll", () => {
  const textWrapper = document.querySelector(".text-wrapper");
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
