import Shader from "./shader.js";

export default class Effect {
    /**
     * Creates a new post-processing effect.
     * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} target
     * @param {string} vs
     * @param {string} fs
     */
    constructor(target, vs, fs) {
        this._textureSource = target;
        this._canvas = document.createElement('canvas');
        this._canvas.width = target.videoWidth || target.width;
        this._canvas.height = target.videoHeight || target.height;
        this._gl = this._canvas.getContext('webgl', {premultipliedAlpha: false});
        if(!this._gl) {
            throw new Error("no WebGL context could be created");
        }
        //this._gl.enable(this._gl.BLEND);
        //this._gl.blendFunc(this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA);
        this._shader = new Shader(this._gl, vs, fs);
        this._quad = this._createQuad();
        this._texture = this._createTexture();
    }

    /**
     * @returns {Shader}
     */
    get shader() {
        return this._shader;
    }

    /**
     * @returns {HTMLCanvasElement}
     */
    get domElement() {
        return this._canvas;
    }

    _createTexture() {
        const tex = this._gl.createTexture();
        this._gl.bindTexture(this._gl.TEXTURE_2D, tex);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);
        this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, this._textureSource);
        this._gl.bindTexture(this._gl.TEXTURE_2D, null);
        return tex;
    }

    _createQuad() {
        const verts = new Float32Array([
            1, 1,
            -1, 1,
            -1, -1,
            -1, -1,
            1, -1,
            1, 1,
        ]);
        const quad = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, quad);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, verts, this._gl.STATIC_DRAW);
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
        return quad;
    }

    _updateTexture() {
        this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
        this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, this._textureSource);
    }

    _setAdditionalShaderData() {
        // You can override this in a subclass if you want to pass additional data to your shaders.
    }

    render() {
        this._shader.activate();
        this._gl.uniform2f(this._shader.canvasDimensions, this._canvas.width, this._canvas.height);
        this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
        this._gl.clearColor(0, 0, 0, 1);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
        this._updateTexture();
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._quad);
        this._gl.enableVertexAttribArray(this._shader.position);
        this._gl.vertexAttribPointer(this._shader.position, 2, this._gl.FLOAT, false, 0, 0);
        this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
    }
}
