document.addEventListener("DOMContentLoaded", function () {
    function createGoldParticle() {
        const particle = document.createElement("div");
        particle.classList.add("gold-particle");
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.width = `${Math.random() * 8 + 3}px`;
        particle.style.height = particle.style.width;
        particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
        document.body.appendChild(particle);
        setTimeout(() => {
            particle.remove();
        }, 5000);
    }


    setInterval(createGoldParticle, 100);
});
