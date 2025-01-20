document.addEventListener("DOMContentLoaded", () => {
  const scrollElements = document.querySelectorAll("[data-scroll]");
  const soundOverlay = document.getElementById("sound-overlay");
  const overlay = document.querySelector(".sound-overlay");

  let audioElement;
  let audioSource;
  let pannerNode;
  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let fadeInterval; // For controlling the fade-in/out effect

  const frame2 = document.querySelector(".frame2");
  const textWrapper = document.querySelector(".text-wrapper");
  const textWrapper5 = document.querySelector(".text-wrapper-5");
  const ellipses = document.querySelectorAll(
    ".ellipse, .ellipse-2, .ellipse-3, .ellipse-4"
  );
  const textWrapper3 = document.querySelector(".text-wrapper-3");
  const textWrapper4 = document.querySelector(".text-wrapper-4");
  const textWrapper6 = document.querySelector(".text-wrapper-6");
  const textWrapper7 = document.querySelector(".text-wrapper-7");

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          textWrapper.classList.add("active");
          textWrapper5.classList.add("active");
          textWrapper3.classList.add("active");
          textWrapper4.classList.add("active");
          textWrapper6.classList.add("active");
          textWrapper7.classList.add("active");
          ellipses.forEach((ellipse) => ellipse.classList.add("active"));
        } else {
          textWrapper.classList.remove("active");
          textWrapper5.classList.remove("active");
          textWrapper3.classList.remove("active");
          textWrapper4.classList.remove("active");
          textWrapper6.classList.remove("active");
          textWrapper7.classList.remove("active");
          ellipses.forEach((ellipse) => ellipse.classList.remove("active"));
        }
      });
    },
    { threshold: 0.5 } // Trigger when 50% of frame2 is visible
  );

  if (frame2) {
    observer.observe(frame2);
  }

  // Function to play sound with panner node
  const playSound = () => {
    audioElement = new Audio("assets/STE-012.mp3"); // Ensure correct file path and extension
    audioElement.loop = true;

    // Create a source from the audio element
    audioSource = audioContext.createMediaElementSource(audioElement);

    // Create a panner node
    pannerNode = audioContext.createPanner();
    pannerNode.panningModel = "HRTF"; // Head-related transfer function for natural panning

    // Connect the source to the panner and the panner to the destination (speakers)
    audioSource.connect(pannerNode);
    pannerNode.connect(audioContext.destination);

    // Play the sound
    audioElement.play().catch((error) => {
      console.log("Audio play failed: ", error);
    });
  };

  // Function to calculate panning based on cursor position
  let targetPanX = 0; // Store target pan X position
  let currentPanX = 0; // Store current pan X position
  let smoothingFactor = 0.1; // Smoothing factor for pan movement (0 to 1)

  const updatePanning = (event) => {
    // Get the position of the cursor relative to the window
    const mouseX = event.clientX;
    const windowWidth = window.innerWidth;

    // Calculate the pan value based on cursor position (scale between -1 and 1)
    targetPanX = (mouseX / windowWidth) * 2 - 1; // Pan from -1 (left) to 1 (right)

    // Smoothly transition to the target pan value
    currentPanX += (targetPanX - currentPanX) * smoothingFactor;

    // Update the panner node with the smoothed pan value
    pannerNode.setPosition(currentPanX, 0, 0); // Set horizontal pan (left-right) based on mouseX
  };

  // Scroll functionality for fading text
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

  // Scroll functionality for frame2 opacity
  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    // Calculate opacity based on scroll position
    const frameOpacity = Math.max(1 - scrollPosition / windowHeight, 3);
    const frame2Opacity = Math.min(scrollPosition / windowHeight, 2);

    // Apply opacity to frames
    if (frame2) {
      frame2.style.opacity = frame2Opacity;
      frame2.style.pointerEvents = frame2Opacity > 0 ? "auto" : "none";
    }
  });

  // Request permission for microphone access and play sound after
  const requestMicrophonePermission = async () => {
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

  // Trigger microphone permission request when the overlay is clicked
  overlay.addEventListener("click", requestMicrophonePermission);

  // Add event listener to update panning when the mouse moves
  window.addEventListener("mousemove", updatePanning);

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

  // Function to fade out sound (volume decreases to 0)
  const fadeOutSound = () => {
    clearInterval(fadeInterval); // Clear any ongoing fade-in
    let volume = audioElement.volume;
    fadeInterval = setInterval(() => {
      if (volume > 0) {
        volume -= 0.05; // Decrease volume by 0.05 each time
        audioElement.volume = volume;
      } else {
        clearInterval(fadeInterval); // Stop the fade when volume reaches 0
        audioElement.pause(); // Pause the audio when it's faded out
      }
    }, 50); // Adjust the duration of the fade-out
  };
});
