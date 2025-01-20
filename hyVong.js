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

  // Function to play sound
  const playSound = () => {
    const audio = new Audio("assets/beginning.mp3"); // Ensure correct file path and extension
    audio.loop = true;

    // Play the sound
    audio.play().catch((error) => {
      console.log("Audio play failed: ", error);
    });
  };

  // Trigger microphone permission request when the overlay is clicked
  overlay.addEventListener("click", allowSound);

  // Scroll fade effect
  const textWrapper = document.querySelector(".frame");
  const startFade = 0; // Starting scroll position for fading
  const endFade = 200; // Scroll position where the text fully fades out (adjust as needed)

  window.addEventListener("scroll", () => {
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

  // Scroll visibility animation
  const scrollElements = document.querySelectorAll("[data-scroll-element]");

  const handleScrollAnimation = () => {
    scrollElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      const viewportHeight = window.innerHeight;

      // Check if the element is in the viewport
      if (elementTop < viewportHeight && elementBottom > 0) {
        element.classList.add("visible");
      } else {
        element.classList.remove("visible");
      }
    });
  };

  // Initial call to handle visibility on page load
  handleScrollAnimation();

  // Event listener for scroll and load events
  window.addEventListener("scroll", handleScrollAnimation);
  window.addEventListener("load", handleScrollAnimation);

  // Rotating images logic (already part of your previous code)
  const frame2 = document.querySelector(".frame2");
  const frame3 = document.querySelector(".frame3");

  // Get the elements inside frameVong
  const r1st = document.querySelector(".r1st");
  const r2nd = document.querySelector(".r2nd");
  const r3rd = document.querySelector(".r3rd");
  const r4th = document.querySelector(".r4th");
  const r5th = document.querySelector(".r5th");

  window.onload = function () {
    // Add the rotating class to each image to start the rotation
    const images = document.querySelectorAll(".frameVong img");
    images.forEach((image) => {
      image.classList.add("rotating");
    });

    // Request permission for microphone access and play sound after
    const requestMicrophonePermission = async () => {
      try {
        // Requesting microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop()); // Stop the microphone after granting permission
        console.log("Microphone access granted!");

        playSound(); // Play sound after permission is granted
      } catch (error) {
        console.log("Permission denied or failed:", error);
      }
    };

    // Trigger microphone permission request on user click
    document.body.addEventListener("click", requestMicrophonePermission);
  };
});
