
/* ==========================================
   MISS BAM APPRECIATION WEBSITE
   Main JavaScript
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ==========================================
       ELEMENTS
    ========================================== */

    const welcomeScreen = document.getElementById("welcomeScreen");
    const openSurprise = document.getElementById("openSurprise");
    const websiteContent = document.getElementById("websiteContent");

    const backgroundMusic = document.getElementById("backgroundMusic");

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    const surpriseButton = document.getElementById("surpriseButton");
    const finalMessageContent = document.getElementById("finalMessageContent");

    const heartfeltLetter = document.getElementById("heartfeltLetter");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let websiteOpened = false;
    let particleTimer = null;
    let typewriterStarted = false;


    /* ==========================================
       OPENING SURPRISE
    ========================================== */

    function openWebsite() {
        if (websiteOpened) return;

        websiteOpened = true;

        if (websiteContent) {
            websiteContent.hidden = false;
            websiteContent.inert = false;
        }

        document.body.classList.remove("no-scroll");

        if (welcomeScreen) {
            welcomeScreen.classList.add("opening");

            window.setTimeout(() => {
                welcomeScreen.hidden = true;
            }, 850);
        }

        // Browsers generally allow audio after a user click.
        if (backgroundMusic) {
            backgroundMusic.volume = 0.35;

            const playPromise = backgroundMusic.play();

            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {
                    console.info(
                        "Music could not start automatically. " +
                        "The visitor can start it using the browser's audio controls."
                    );
                });
            }
        }

        if (!reduceMotion) {
            startRomanticEffects();
        }

        revealVisibleSections();

        console.log("Miss Bam's appreciation website is open. 💗");
    }

    if (openSurprise) {
        openSurprise.addEventListener("click", openWebsite);
    } else {
        console.warn("The opening button #openSurprise was not found.");
    }


    /* ==========================================
       FLOATING HEARTS AND ROSE PETALS
    ========================================== */

    const particleSymbols = [
        "💗", "♡", "♥", "🌸", "🌹", "✦", "✨", "💕"
    ];

    function createRomanticParticle() {
        if (document.hidden || !websiteOpened) return;

        const particle = document.createElement("span");

        particle.className = "romantic-particle";

        particle.setAttribute("aria-hidden", "true");

        particle.textContent = particleSymbols[
            Math.floor(Math.random() * particleSymbols.length)
        ];

        particle.style.setProperty(
            "--left",
            `${Math.random() * 96 + 2}%`
        );

        particle.style.setProperty(
            "--size",
            `${14 + Math.random() * 17}px`
        );

        const duration = 7 + Math.random() * 5;

        particle.style.setProperty(
            "--duration",
            `${duration}s`
        );

        document.body.appendChild(particle);

        particle.addEventListener("animationend", () => {
            particle.remove();
        }, { once: true });

        // Backup cleanup.
        window.setTimeout(() => {
            particle.remove();
        }, (duration + 2) * 1000);
    }

    function startRomanticEffects() {
        if (reduceMotion || particleTimer) return;

        for (let i = 0; i < 5; i++) {
            window.setTimeout(createRomanticParticle, i * 300);
        }

        particleTimer = window.setInterval(
            createRomanticParticle,
            900
        );
    }

    function stopRomanticEffects() {
        if (particleTimer) {
            window.clearInterval(particleTimer);
            particleTimer = null;
        }
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopRomanticEffects();
        } else if (websiteOpened && !reduceMotion) {
            startRomanticEffects();
        }
    });


    /* ==========================================
       MOBILE NAVIGATION
    ========================================== */

    function closeNavigation() {
        if (!menuToggle || !navLinks) return;

        navLinks.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");

        menuToggle.textContent = "☰";
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeNavigation);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeNavigation();
            }
        });
    }


    /* ==========================================
       TYPEWRITER LETTER
    ========================================== */

    function startTypewriter() {
        if (!heartfeltLetter || typewriterStarted) return;

        typewriterStarted = true;

        // Keep the full letter readable when reduced motion is enabled.
        if (reduceMotion) return;

        const paragraphs = Array.from(
            heartfeltLetter.querySelectorAll("p")
        );

        if (!paragraphs.length) return;

        const originalParagraphs = paragraphs.map(paragraph => {
            const text = paragraph.textContent.trim();

            paragraph.textContent = "";

            return {
                element: paragraph,
                text
            };
        });

        let paragraphIndex = 0;
        let characterIndex = 0;

        heartfeltLetter.classList.add("typing");

        function typeCharacter() {
            if (paragraphIndex >= originalParagraphs.length) {
                heartfeltLetter.classList.remove("typing");
                return;
            }

            const current = originalParagraphs[paragraphIndex];

            if (characterIndex < current.text.length) {
                current.element.textContent +=
                    current.text.charAt(characterIndex);

                const character = current.text.charAt(characterIndex);

                characterIndex++;

                let delay = 20;

                if (/[.!?]/.test(character)) {
                    delay = 260;
                } else if (character === ",") {
                    delay = 120;
                }

                window.setTimeout(typeCharacter, delay);
            } else {
                paragraphIndex++;
                characterIndex = 0;

                window.setTimeout(typeCharacter, 350);
            }
        }

        typeCharacter();
    }


    /* ==========================================
       SCROLL REVEAL ANIMATIONS
    ========================================== */

    function revealVisibleSections() {
        const revealItems = document.querySelectorAll(
            ".reveal:not(.visible)"
        );

        if (reduceMotion || !("IntersectionObserver" in window)) {
            revealItems.forEach(item => {
                item.classList.add("visible");
            });

            startTypewriter();
            return;
        }

        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("visible");

                if (
                    entry.target.classList.contains("heartfelt-letter")
                ) {
                    startTypewriter();
                }

                currentObserver.unobserve(entry.target);
            });
        }, {
            threshold: 0.12
        });

        revealItems.forEach(item => observer.observe(item));
    }


    /* ==========================================
       FINAL SURPRISE MESSAGE
    ========================================== */

    if (surpriseButton && finalMessageContent) {
        surpriseButton.addEventListener("click", () => {
            const isHidden = finalMessageContent.hidden;

            finalMessageContent.hidden = !isHidden;

            surpriseButton.textContent = isHidden
                ? "Close My Message ♡"
                : "Open One Last Message 💌";

            surpriseButton.setAttribute(
                "aria-expanded",
                String(isHidden)
            );

            if (isHidden && !reduceMotion) {
                finalMessageContent.classList.add("heartfelt-letter");

                createRomanticParticle();
                createRomanticParticle();
                createRomanticParticle();
            }
        });
    }


    /* ==========================================
       IMAGE FALLBACK
    ========================================== */

    document.querySelectorAll(".photo-gallery img").forEach(image => {
        image.addEventListener("error", () => {
            image.classList.add("image-unavailable");

            const figure = image.closest("figure");

            if (figure && !figure.querySelector(".image-error")) {
                const message = document.createElement("p");

                message.className = "image-error";
                message.textContent =
                    "Add the correct photo to your assets folder.";

                figure.appendChild(message);
            }

            console.warn("Image could not be loaded:", image.src);
        }, { once: true });
    });


    /* ==========================================
       INITIAL SETUP
    ========================================== */

    // The main page stays hidden until the Start button is clicked.
    if (websiteContent && !websiteOpened) {
        websiteContent.hidden = true;
        websiteContent.inert = true;
    }

    if (welcomeScreen) {
        welcomeScreen.hidden = false;
    }

    console.log("Miss Bam website JavaScript loaded successfully. 🌹");
});
