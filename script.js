document.addEventListener("DOMContentLoaded", function () {
    // --- 1. CONFETTI ANIMATION (Standard) ---
    var confettiSettings = { 
        target: 'confetti-canvas',
        max: 100, // Reduced count to share screen with mimosas
        size: 1.5,
        animate: true,
        props: ['circle', 'square', 'triangle', 'line'],
        colors: [
            [255, 192, 203], // Pink
            [255, 105, 180], // Hot Pink
            [255, 215, 0],   // Gold
            [255, 255, 255]  // White
        ],
        clock: 30,
        rotate: true,
        start_from_edge: true,
        respawn: true
    };
    var confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();

    // --- 2. MIMOSA ANIMATION (Custom) ---
    const canvas = document.getElementById('mimosa-canvas');
    const ctx = canvas.getContext('2d');
    let animationId; // To stop the loop later
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mimosa Particles
    const mimosas = [];
    const mimosaImage = new Image();
    mimosaImage.src = 'mimosa.svg'; 

    class Mimosa {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height; 
            this.size = Math.random() * 20 + 20; 
            this.speedY = Math.random() * 2 + 1; 
            this.speedX = Math.random() * 2 - 1; 
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            // Reset if goes off screen
            if (this.y > canvas.height) {
                this.y = -50;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.drawImage(mimosaImage, -this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }

    // Initialize mimosas
    function initMimosas() {
        for (let i = 0; i < 30; i++) { // 30 mimosas mixed with confetti
            mimosas.push(new Mimosa());
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        mimosas.forEach(mimosa => {
            mimosa.update();
            mimosa.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    // Start animation once image is loaded
    mimosaImage.onload = function() {
        initMimosas();
        animate();
    };

    // --- 3. STOP ANIMATIONS AFTER 30 SECONDS ---
    setTimeout(function() {
        // Stop Confetti
        confetti.clear(); // confetti-js method to stop and clear
        
        // Stop Mimosas
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear mimosa canvas
        
    }, 30000); // 30000 ms = 30 seconds

    // --- 4. SCROLL ANIMATIONS (Apple Style) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If this is the "Sorriso" card, start the typing animation
                if (entry.target.querySelector('#dynamic-text')) {
                    startTypingAnimation();
                }
                
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.card, .intro-text');
    hiddenElements.forEach((el) => observer.observe(el));

    // --- 5. TYPING ANIMATION (Triggered by Scroll) ---
    function startTypingAnimation() {
        // ... (existing code) ...
        // Delay slightly to ensure user is looking
        setTimeout(function() {
            var element = document.getElementById('dynamic-text');
            if (!element) return;
            
            var textToDelete = "Sorriso";
            var textToType = "Viso";
            var deleteSpeed = 150; 
            var typeSpeed = 200;   
            
            var isDeleting = true;

            function typeWriter() {
                var currentText = element.textContent;

                if (isDeleting) {
                    // Deleting
                    if (currentText.length > 0) {
                        element.textContent = currentText.substring(0, currentText.length - 1);
                        setTimeout(typeWriter, deleteSpeed);
                    } else {
                        isDeleting = false;
                        setTimeout(typeWriter, 500); // Pause before typing
                    }
                } else {
                    // Typing
                    if (currentText.length < textToType.length) {
                        element.textContent = textToType.substring(0, currentText.length + 1);
                        setTimeout(typeWriter, typeSpeed);
                    } else {
                        // Done
                        element.style.borderRight = "none";
                    }
                }
            }
            
            typeWriter();
        }, 1000);
    }

    // --- 6. APPLE-STYLE ZOOM ON SCROLL ---
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const heroTitle = document.querySelector('#hero h1');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        // Stop calculating if we're way past the hero (optimization)
        if (scrollPosition > window.innerHeight * 1.5) return;

        // Calculate Scale, Opacity and Blur
        // Zoom in: start at 1, go up more dramatically
        const scale = 1 + scrollPosition * 0.003; 
        
        // Blur effect for that "depth" feel
        const blur = Math.min(10, scrollPosition * 0.01);

        // Fade out: start fading after 100px, fully gone by 80% of screen height
        const opacity = 1 - Math.max(0, scrollPosition - 100) / (window.innerHeight * 0.7);

        // Apply styles
        if (heroTitle) {
            heroTitle.style.transform = `scale(${scale})`;
            heroTitle.style.opacity = opacity > 0 ? opacity : 0;
            heroTitle.style.filter = `blur(${blur}px)`;
        }

        // Hide scroll indicator gradually as you scroll down
        if (scrollIndicator) {
            // Fade out between 0px and 300px scroll
            const indicatorOpacity = 1 - scrollPosition / 300;
            
            if (indicatorOpacity <= 0) {
                scrollIndicator.style.opacity = 0;
                scrollIndicator.style.visibility = 'hidden';
            } else {
                scrollIndicator.style.opacity = indicatorOpacity;
                scrollIndicator.style.visibility = 'visible';
            }
        }
    });
});