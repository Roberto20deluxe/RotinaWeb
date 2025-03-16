document.addEventListener("DOMContentLoaded", function () {
    function createGoldParticle() {
        const particle = document.createElement("div");
        particle.classList.add("gold-particle");

        // Randomize position and size
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.width = `${Math.random() * 8 + 3}px`;
        particle.style.height = particle.style.width;
        particle.style.animationDuration = `${Math.random() * 3 + 2}s`; // Between 2s to 5s

        document.body.appendChild(particle);

        // Remove the particle after it falls
        setTimeout(() => {
            particle.remove();
        }, 5000);
    }

    // Create new particles continuously
    setInterval(createGoldParticle, 100);
});
