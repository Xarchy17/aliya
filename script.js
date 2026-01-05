// Initial Setup: background hearts
function createHearts() {
    const container = document.getElementById('hearts-container');
    const heartCount = 15;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart-bg');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        container.appendChild(heart);
    }
}

createHearts();

// Navigation Functions
function nextScreen(targetId) {
    const current = document.querySelector('.screen.active');
    const target = document.getElementById(targetId);

    if (current && target) {
        current.classList.remove('active');
        // Add a small delay for exit animation if needed, but simple display toggle is fine for now
        setTimeout(() => {
            target.classList.add('active');
        }, 100);
    }

    // Attempt to play music on first interaction (navigation)
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic && bgMusic.paused) {
        // Only play if the video is NOT playing currently
        const video = document.querySelector('.special-video');
        if (!video || video.paused) {
            bgMusic.play().catch(e => console.log("Audio autplay prevented", e));
        }
    }
}

// "No" Button Interaction (Run away)
function moveButton(btn) {
    // Get container dimensions to keep button inside
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    // Calculate new random position
    // We want to keep it relatively close but random, or jump to opposite side
    // Simplest approach: Random X/Y within container padding constraints

    const maxX = containerRect.width - btnRect.width - 40; // 40px padding buffer
    const maxY = containerRect.height - btnRect.height - 40;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    // Check if we are using flex/grid layout adjustments or absolute positioning
    // Since buttons are in a flow, setting position: absolute might break layout temporarily
    // Best trick: set position absolute to the button just before moving

    btn.style.position = 'absolute';
    // Position needs to be relative to the closest positioned ancestor (container)
    // But button starts in flow.

    btn.style.left = randomX + 'px';
    btn.style.top = randomY + 'px';
}

// "Yes" Button Interaction
function handleYes() {
    // Trigger Confetti
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ffccd5', '#ffffff']
    });

    // Go to success screen
    nextScreen('screen-success');

    // Optional: specific continuous confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
    }, 250);
}

// Restart
function restart() {
    // Reset pages
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-intro').classList.add('active');

    // Reset interactions
    const btnNo = document.getElementById('btn-no');
    if (btnNo) {
        btnNo.style.position = 'static'; // Return to flow
    }
}


// Background Music Control
document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    const video = document.querySelector('.special-video');

    if (bgMusic) {
        bgMusic.volume = 0.5; // Set volume to 50%
    }

    if (video && bgMusic) {
        video.addEventListener('play', () => {
            bgMusic.pause();
        });

        video.addEventListener('pause', () => {
            bgMusic.play().catch(e => console.log("Audio resume failed", e));
        });

        video.addEventListener('ended', () => {
            bgMusic.play().catch(e => console.log("Audio resume failed", e));
        });
    }
});
