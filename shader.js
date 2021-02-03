export default class Shader {
    /**
     * Creates a new Shader
     * @param {WebGLRenderingContext} gl The WebGL context
     * @param {string} vs The vertex shader source code
     * @param {string} fs The fragment shader source code
     */
    constructor(gl, vs, fs) {
        this._gl = gl;
        this.program = this.createShaderProgram(vs, fs);
        this.position = gl.getAttribLocation(this.program, "position");
        this.canvasDimensions = gl.getUniformLocation(this.program, "canvasDimensions");
    }

    /**
     * Initializes the shader
     * @param {string} vs The vertex shader source code
     * @param {string} fs The fragment shader source code
     * @return {WebGLProgram} The shader program
     */
    createShaderProgram(vs, fs) {
        const vertexShader = this._gl.createShader(this._gl.VERTEX_SHADER);
        const fragmentShader = this._gl.createShader(this._gl.FRAGMENT_SHADER);

        this._gl.shaderSource(vertexShader, vs);
        this._gl.shaderSource(fragmentShader, fs);

        this._gl.compileShader(vertexShader);
        if(!this._gl.getShaderParameter(vertexShader, this._gl.COMPILE_STATUS))
            throw new Error("compiling vertex shader" + this._gl.getShaderInfoLog(vertexShader));

        this._gl.compileShader(fragmentShader);
        if(!this._gl.getShaderParameter(fragmentShader, this._gl.COMPILE_STATUS))
            throw new Error("compiling fragment shader" + this._gl.getShaderInfoLog(fragmentShader));

        const program = this._gl.createProgram();
        this._gl.attachShader(program, vertexShader);
        this._gl.attachShader(program, fragmentShader);
        this._gl.linkProgram(program);

        if(!this._gl.getProgramParameter(program, this._gl.LINK_STATUS))
            throw new Error("linking program" + this._gl.getProgramInfoLog(program));

        this._gl.validateProgram(program);
        if(!this._gl.getProgramParameter(program, this._gl.VALIDATE_STATUS))
            throw new Error("validating program" + this._gl.getProgramInfoLog(program));

        return program;
    }

    /**
     * Activates this shader
     */
    activate() {
        this._gl.useProgram(this.program);
    }
}
