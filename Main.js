document.addEventListener("DOMContentLoaded", () => {
  const scrollElements = document.querySelectorAll("[data-scroll]");
  const soundOverlay = document.getElementById("sound-overlay");
  let audio; // Store the audio object globally
  let fadeInterval; // For controlling the fade-in/out effect

  // Scroll functionality to scroll to the target section when the scrollXuong image is clicked
  document
    .getElementById("scrollButton")
    .addEventListener("click", function () {
      document.getElementById("target-section").scrollIntoView({
        behavior: "smooth", // This will make the scrolling smooth
      });
    });

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible"); // Add class when in view
        } else {
          entry.target.classList.remove("visible"); // Remove class when out of view
        }
      });
    },
    { threshold: 0.2 } // Trigger when 20% of the element is visible
  );

  scrollElements.forEach((el) => observer.observe(el));

  // Function to play sound with fade-in effect
  const playSound = () => {
    audio = new Audio("assets/beginning.mp3"); // Ensure correct file path and extension
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

  // Request permission for microphone access and play sound after
  const requestMicrophonePermission = async () => {
    try {
      // Requesting microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop()); // Stop the microphone after granting permission
      console.log("Microphone access granted!");

      playSound(); // Play sound after permission is granted
    } catch (error) {
      console.log("Permission denied or failed:", error);
    }
  };

  // Trigger microphone permission request on overlay click
  soundOverlay.addEventListener("click", async () => {
    await requestMicrophonePermission();

    // Hide the overlay with fade-out
    soundOverlay.classList.add("hidden");
  });

  // Handle navigation or other actions that should trigger sound fade-out
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
