// Gold Rain Effect
let isGoldRainActive = true;
let goldRainInterval;

function createGoldParticle() {
    const particle = document.createElement('div');
    particle.className = 'gold-particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = Math.random() * 2 + 2 + 's';
    document.body.appendChild(particle);
    
    particle.addEventListener('animationend', () => {
        particle.remove();
    });
}

function toggleGoldRain() {
    if (isGoldRainActive) {
        clearInterval(goldRainInterval);
        isGoldRainActive = false;
    } else {
        goldRainInterval = setInterval(createGoldParticle, 100);
        isGoldRainActive = true;
    }
}

// Start gold rain by default
goldRainInterval = setInterval(createGoldParticle, 100);

// Add click event listener to toggle button
document.getElementById('toggleGoldRain').addEventListener('click', toggleGoldRain);
