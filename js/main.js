import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import initGlitter from "./glitter.js";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    // Initialize Glitter
    initGlitter();

    // --- Interactive Shimmer Effect ---
    // Add shimmer class to elements we want to shine
    const shimmerTargets = document.querySelectorAll('.btn-primary, .project-card, .skill-card, .h1.section-title');

    shimmerTargets.forEach(el => {
        el.classList.add('shimmer-element');

        // Define the shimmer animation (pseudo-element)
        // Note: we can't target pseudo-elements directly with GSAP easily in a timeline for hover without CSS variables or a helper.
        // A cleaner way for hover is using CSS variables or a separate element. 
        // But for "sweep across once", we can use `gsap.fromTo` on the pseudo element if we use CSSRulePlugin (extra weight).
        // Instead, let's use a standard GSAP tween on a CSS variable that controls the position.

        // BETTER APPROACH: Use GSAP to animate a mask or create a span for the shine if pseudo is hard.
        // But requested purely CSS/GSAP. Let's try controlling the `left` property via variable or just standard CSS transition.

        // Actually, the prompt asks for GSAP. Let's make it simple:
        // bind 'mouseenter' to animate a CSS variable `--shimmer-pos`.

        el.style.setProperty('--shimmer-pos', '-100%');

        el.addEventListener('mouseenter', () => {
            gsap.fromTo(el,
                { "--shimmer-pos": "-100%" },
                {
                    "--shimmer-pos": "200%",
                    duration: 0.8,
                    ease: "power2.inOut",
                    overwrite: true
                }
            );
        });
    });

    // --- Cinematic Intro Animation ---
    const introTl = gsap.timeline();

    // 1. Reveal Background Elements
    introTl.to(".ambient-glow", { opacity: 1, duration: 2, ease: "power2.out" })

        // 2. Name Reveal (Staggered Text)
        .from(".reveal-text", {
            yPercent: 100, // Text comes up from hidden overflow
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "power4.out"
        }, "-=1.5")

        // 3. Subtitle Fade In
        .to(".hero-subtitle", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.8")

        // 4. Description Fade In
        .to(".hero-desc", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.8")

        // 5. Buttons Pop In
        .to(".hero-btns", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
        }, "-=0.6");


    // --- Scroll Animations ---

    // Generic Section Reveal
    gsap.utils.toArray("section").forEach(section => {
        if (section.id === 'hero') return;

        const sectionTitle = section.querySelector(".section-title");
        if (sectionTitle) {
            gsap.fromTo(sectionTitle,
                { opacity: 0, x: -50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                    }
                }
            );
        }

        gsap.fromTo(section.querySelectorAll(".glass-card, .project-card, .skill-card"),
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1, // Stagger cards within the section
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                }
            }
        );
    });

    // --- Micro-interactions ---

    // Magnetic / Scale effect for Cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { scale: 1.02, duration: 0.4, ease: "power2.out" });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { scale: 1, duration: 0.4, ease: "power2.out" });
        });
    });

    // Button Hover
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(btn => {
        btn.addEventListener("mouseenter", () => {
            gsap.to(btn, { scale: 1.05, duration: 0.2, ease: "power1.out" });
        });
        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, { scale: 1, duration: 0.2, ease: "power1.out" });
        });
    });

    // Navbar Scroll Effect
    const header = document.querySelector("header");
    let lastScroll = 0;

    ScrollTrigger.create({
        start: "top top",
        end: 99999,
        onUpdate: (self) => {
            const currentScroll = self.scroll();

            // Show/Hide based on direction
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down - hide
                gsap.to(header, { yPercent: -100, duration: 0.3, ease: "power2.inOut" });
            } else {
                // Scrolling up - show
                gsap.to(header, { yPercent: 0, duration: 0.3, ease: "power2.inOut" });
            }
            lastScroll = currentScroll;
        }
    });

    // Parallax Effect for Ambient Glow (Subtle)
    window.addEventListener("mousemove", (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        gsap.to(".ambient-glow", {
            x: mouseX * 30,
            y: mouseY * 30,
            duration: 2,
            ease: "power1.out"
        });

        gsap.to(".glow-2", {
            x: -mouseX * 30,
            y: -mouseY * 30,
            duration: 2,
            ease: "power1.out"
        });
    });

    // Contact Section Animation
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
        gsap.from(contactSection, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: contactSection,
                start: "top 80%",
            }
        });
    }

});
