import Effect from "../effect.js";

let effect, canvasCtx;

async function onLoad() {
    const canvas = document.getElementById('canvas_example');
    canvasCtx = canvas.getContext('2d');

    const vs = await fetch('vert.glsl').then(r => r.text());
    const fs = await fetch('frag.glsl').then(r => r.text());

    // Example effect application.
    try {
        effect = new Effect(canvas, vs, fs);
    } catch(e) {
        console.error(e);
        return;
    }
    document.body.appendChild(effect.domElement); // You can also now just hide your original if you want to
    frame();
}

function frame() {
    // Random animation for demo purposes.
    renderCanvas();

    // Render effect
    effect.render();

    requestAnimationFrame(frame);
}

function renderCanvas() {
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);

    const R = 100;
    const angle = 0.002 * performance.now();
    const co = R*Math.cos(angle);
    const si = R*Math.sin(angle);

    canvasCtx.fillStyle = '#ffcc99';
    canvasCtx.fillRect(150 + co, 150 + si, 50, 50);
}

window.addEventListener('load', onLoad);
