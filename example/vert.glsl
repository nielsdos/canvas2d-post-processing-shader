precision highp float;

attribute vec2 position;
varying vec2 texCoords;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
  texCoords = position * vec2(0.5, -0.5) + 0.5;
}
