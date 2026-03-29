document.addEventListener("DOMContentLoaded", function () {
    // Component Loader
    async function loadComponent(selector, file) {
        const container = document.querySelector(selector);
        if (!container) return;

        try {
            if (window.location.protocol === 'file:') {
                console.warn(`[Component Loader] Loading ${file} via file:// protocol may be blocked by browser security. Use a local server (e.g., Live Server) for best results.`);
            }

            const response = await fetch(file);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            container.innerHTML = html;

            // Immediately force visibility for dynamic items with animation classes
            const animatable = container.querySelectorAll(".fade-in, .fade-zoom-in, .fade-zoom-out");
            animatable.forEach(el => {
                el.classList.add("visible");
                el.style.opacity = "1";
                el.style.transform = "none";
                el.style.animation = "none";
            });

            // Initialize interactions for special components
            if (selector === ".main-navbar") {
                initNavbarInteractions();
            }
        } catch (error) {
            console.error(`[Component Loader] Error loading ${file}:`, error);
        }
    }

    function initNavbarInteractions() {
        const menuBtn = document.querySelector(".menu");
        const categorySectionB = document.querySelector(".category-section.b");

        if (menuBtn && categorySectionB) {
            menuBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                categorySectionB.classList.toggle("show");
            });

            // Close menu when clicking outside
            document.addEventListener("click", () => {
                categorySectionB.classList.remove("show");
            });

            categorySectionB.addEventListener("click", (e) => {
                e.stopPropagation();
            });

            categorySectionB.querySelectorAll("a").forEach(link => {
                link.addEventListener("click", () => {
                    categorySectionB.classList.remove("show");
                });
            });
        }
    }

    // Load registered components
    loadComponent(".main-navbar", "navbar.html");
    loadComponent(".footer-component", "footer.html");
});
