/**
 * Premium Subtle Glitter Effect
 * Renders soft, floating particles on a canvas behind the content.
 */

const initGlitter = () => {
    const canvas = document.createElement('canvas');
    canvas.id = 'glitter-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    const particleCount = window.innerWidth < 768 ? 30 : 60; // Fewer on mobile
    const colors = ['rgba(121, 192, 255, ', 'rgba(210, 168, 255, ', 'rgba(255, 255, 255, ']; // Blue, Violet, White

    // Resize handling
    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight; // Use full doc height or viewport? Fixed viewport is better for performance
        canvas.width = width;
        canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Particle Class
    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.2; // Slow horizontal drift
            this.vy = (Math.random() - 0.5) * 0.2; // Slow vertical drift
            this.size = Math.random() * 1.5 + 0.5; // Tiny sizes
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.fadingIn = Math.random() > 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around screen
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Twinkle effect
            if (this.fadingIn) {
                this.opacity += this.fadeSpeed;
                if (this.opacity >= 0.7) this.fadingIn = false;
            } else {
                this.opacity -= this.fadeSpeed;
                if (this.opacity <= 0.1) this.fadingIn = true;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    };

    // Check for Reduced Motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches) {
        animate();
    }
};

export default initGlitter;
