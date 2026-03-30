document.addEventListener("DOMContentLoaded", function () {
  const video = document.querySelector(".top-video-file video");
  const content = document.querySelector(".main-content-section");
  let videoEnded = false;
  let videoStarted = false;

  // 🔒 Disable scroll globally until fade-in completes
  document.body.style.overflow = "hidden";

  // --- helper to mark element visible ---
  function markVisible(el, extraClass) {
    if (!el) return;
    if (extraClass) el.classList.add(extraClass);
    el.classList.add("visible");
  }

  // --- when video ends: fade background, then mark flow finished ---
  function onVideoEndedFlow() {
    if (!content) return;

    // step 1: trigger the background fade
    content.classList.add("visible");

    const bgTransitionMs = 1500;
    let handled = false;

    function onTransition(e) {
      if (
        e.target === content &&
        (e.propertyName === "opacity" || e.propertyName === "background-color")
      ) {
        handled = true;
        content.removeEventListener("transitionend", onTransition);
        videoEnded = true;

        // 🔓 Re-enable scroll after fade completes
        document.body.style.overflow = "auto";
      }
    }

    content.addEventListener("transitionend", onTransition);

    // Fallback in case transitionend doesn't fire
    setTimeout(() => {
      if (!handled) {
        videoEnded = true;
        document.body.style.overflow = "auto";
      }
    }, bgTransitionMs + 100);
  }

  // --- Handle video readiness and playback ---
  if (video && content) {
    // Try to play as soon as the video is ready to play through
    video.addEventListener("canplaythrough", () => {
      if (!videoStarted) {
        video.play().catch(() => {
          // Some browsers may block autoplay
          console.warn("Autoplay was blocked.");
        });
        videoStarted = true;
      }
    });

    // Handle video end
    video.addEventListener("ended", function () {
      setTimeout(onVideoEndedFlow, 300); // slight delay for transition effect
    });

    // Fallback: if video hasn't started after 5 seconds, skip it
    setTimeout(() => {
      if (!videoEnded && !videoStarted) {
        console.warn("Video load fallback triggered.");
        onVideoEndedFlow();
      }
    }, 5000);
  }

  // --- IntersectionObserver for content reveals ---
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      // Prevent reveal if inside main-content-section and video hasn't finished
      if (content && content.contains(el) && !videoEnded) return;

      // Special-case: team section
      if (el.classList && el.classList.contains("body-content-grid")) {
        el.querySelectorAll(".team-text.b").forEach(nameEl => {
          nameEl.classList.add("fade-zoom-out", "visible");
        });
        el.querySelectorAll(".text.b").forEach(descEl => {
          descEl.classList.add("fade-in", "visible");
        });
        obs.unobserve(el);
        return;
      }

      // Generic reveal
      markVisible(el);
      obs.unobserve(el);
    });
  }, { threshold: 0.3 });

  // Observe all animatable elements
  document.querySelectorAll(".fade-in, .fade-zoom-in, .fade-zoom-out, .body-content-grid")
    .forEach(el => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.querySelector(".menu");
  const categorySectionB = document.querySelector(".category-section.b");

  if (menuBtn && categorySectionB) {
    menuBtn.addEventListener("click", () => {
      categorySectionB.classList.toggle("show");
    });

    categorySectionB.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        categorySectionB.classList.remove("show");
      });
    });
  }
});
