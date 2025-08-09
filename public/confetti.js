function burstConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiColors = [
        '#ffffff', '#000000', '#445F87', '#C0C0C0'
    ];

    function createConfettiPiece() {
        const size = Math.random() * 5 + 5;
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        return {
            x: Math.random() * canvas.width,
            y: 0,
            size,
            color,
            rotation: Math.random() * 360,
            speed: Math.random() * 4 + 2,
            drift: Math.random() * 3 - 1.5,
        };
    }

    const confettiPieces = [];

    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const confetti of confettiPieces) {
            ctx.save();
            ctx.translate(confetti.x + confetti.size / 2, confetti.y + confetti.size / 2);
            ctx.rotate(confetti.rotation * (Math.PI / 180));
            ctx.translate(-(confetti.x + confetti.size / 2), -(confetti.y + confetti.size / 2));

            ctx.fillStyle = confetti.color;
            ctx.fillRect(confetti.x, confetti.y, confetti.size, confetti.size);

            ctx.restore();

            confetti.y += confetti.speed;
            confetti.x += confetti.drift;

            if (confetti.y > canvas.height) {
                confetti.y = 0;
            }
        }

        if (confettiPieces.length > 0) {
            requestAnimationFrame(drawConfetti);
        }
    }

    for (let i = 0; i < 100; i++) {
        confettiPieces.push(createConfettiPiece());
    }

    // Start the confetti animation
    setTimeout(() => {
        drawConfetti();

        // Stop the animation after 5 seconds
        setTimeout(() => {
            confettiPieces.length = 0;
            canvas.width = 0;
            canvas.height = 0;
        }, 7000);
    }, 0);
}

export { burstConfetti };
