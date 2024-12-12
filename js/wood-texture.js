export function createWoodTexture(isFloor = false) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    ctx.fillStyle = '#5c3a21';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isFloor) {
        for (let i = 0; i < 8; i++) {
            const y = i * (canvas.height / 8);
            ctx.fillStyle = `rgba(42, 24, 16, 0.1)`;
            ctx.fillRect(0, y, canvas.width, 2);
            
            for (let j = 0; j < 20; j++) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${42 + Math.random() * 20}, ${24 + Math.random() * 16}, ${16 + Math.random() * 10}, 0.3)`;
                ctx.lineWidth = 1 + Math.random() * 2;
                const x = Math.random() * canvas.width;
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.random() * 100 - 50, y + canvas.height/8);
                ctx.stroke();
            }
        }
    } else {
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${42 + Math.random() * 20}, ${24 + Math.random() * 16}, ${16 + Math.random() * 10}, 0.3)`;
            ctx.lineWidth = 1 + Math.random() * 3;
            const x = Math.random() * canvas.width;
            ctx.moveTo(x, 0);
            ctx.bezierCurveTo(
                x + Math.random() * 50 - 25, canvas.height * 0.3,
                x + Math.random() * 50 - 25, canvas.height * 0.6,
                x + Math.random() * 100 - 50, canvas.height
            );
            ctx.stroke();
        }

        for (let i = 0; i < 3; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 10 + Math.random() * 10);
            gradient.addColorStop(0, 'rgba(42, 24, 16, 0.8)');
            gradient.addColorStop(1, 'rgba(92, 58, 33, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    return canvas;
}
