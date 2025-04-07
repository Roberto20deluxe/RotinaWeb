// Game logic
let targetNumber = generateNumber();
let attempts = [];

function generateNumber() {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const number = [];
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        number.push(digits[randomIndex]);
        digits.splice(randomIndex, 1);
    }
    return number.join('');
}

function checkGuess(guess) {
    let bulls = 0;
    let cows = 0;
    
    for (let i = 0; i < 4; i++) {
        if (guess[i] === targetNumber[i]) {
            bulls++;
        } else if (targetNumber.includes(guess[i])) {
            cows++;
        }
    }
    
    return { bulls, cows };
}

function updateGuessesList(guess, result) {
    const guessesList = document.getElementById('guessesList');
    const guessItem = document.createElement('div');
    guessItem.className = 'guess-item';
    guessItem.innerHTML = `
        <span class="guess-number">${guess}</span>
        <span class="guess-result">${result.bulls} Bulls, ${result.cows} Cows</span>
    `;
    guessesList.insertBefore(guessItem, guessesList.firstChild);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submitGuess');
    const guessInput = document.getElementById('guessInput');
    const showAnswerButton = document.getElementById('showAnswer');
    const answerDisplay = document.getElementById('answerDisplay');
    
    submitButton.addEventListener('click', () => {
        const guess = guessInput.value;
        
        if (guess === '') {
            alert('Por favor, insira um número');
            return;
        }
        
        if (guess.length !== 4 || !/^\d+$/.test(guess)) {
            alert('Por favor, insira um número de 4 dígitos');
            return;
        }
        
        const result = checkGuess(guess);
        updateGuessesList(guess, result);
        
        if (result.bulls === 4) {
            answerDisplay.textContent = 'Parabéns! Você venceu!';
            answerDisplay.style.display = 'block';
            submitButton.disabled = true;
            guessInput.disabled = true;
        }
        
        guessInput.value = '';
        guessInput.focus();
    });
    
    showAnswerButton.addEventListener('click', () => {
        answerDisplay.textContent = `A resposta é: ${targetNumber}`;
        answerDisplay.style.display = 'block';
        submitButton.disabled = true;
        guessInput.disabled = true;
    });
    
    // Initialize scroll animations
    handleScrollAnimations();
});

// Scroll Animations
function handleScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const projectCards = document.querySelectorAll('.project-card');
    const aboutContent = document.querySelector('.about-content');
    const skillsGrid = document.querySelector('.skills-grid');
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Add hidden class initially
    sections.forEach(section => section.classList.add('hidden'));
    projectCards.forEach(card => card.classList.add('hidden'));
    if (aboutContent) aboutContent.classList.add('hidden');
    if (skillsGrid) {
        skillsGrid.querySelectorAll('.skill-item').forEach(item => item.classList.add('hidden'));
    }
    timelineItems.forEach(item => item.classList.add('hidden'));

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('hidden');
            }
        });
    }, observerOptions);

    // Observe sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observe project cards
    projectCards.forEach(card => {
        observer.observe(card);
    });

    // Observe about content
    if (aboutContent) {
        observer.observe(aboutContent);
    }

    // Observe skills grid
    if (skillsGrid) {
        observer.observe(skillsGrid);
    }

    // Observe timeline items
    timelineItems.forEach(item => {
        observer.observe(item);
    });
} 