import Effect from "../effect.js";

let effect;

async function onLoad() {
    const image = document.getElementById('image_example');

    const vs = await fetch('vert.glsl').then(r => r.text());
    const fs = await fetch('frag.glsl').then(r => r.text());

    // Example effect application.
    try {
        effect = new Effect(image, vs, fs);
    } catch(e) {
        console.error(e);
        return;
    }
    document.body.appendChild(effect.domElement); // You can also now just hide your original if you want to
    effect.render();
}

window.addEventListener('load', onLoad);
