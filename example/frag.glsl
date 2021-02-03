precision highp float;

varying vec2 texCoords;
uniform sampler2D texture;
uniform vec2 canvasDimensions;

void main() {
  vec2 redShift = vec2(-5.0, -5.0);
  vec2 greenShift = vec2(10.0, -10.0);
  vec2 blueShift = vec2(5.0, 5.0);

  redShift /= canvasDimensions * 2.0;
  greenShift /= canvasDimensions * 2.0;
  blueShift /= canvasDimensions * 2.0;

  vec4 redSample = texture2D(texture, texCoords + redShift);
  vec4 greenSample = texture2D(texture, texCoords + greenShift);
  vec4 blueSample = texture2D(texture, texCoords + blueShift);

  gl_FragColor = vec4(
    redSample.r,
    greenSample.g,
    blueSample.b,
    (redSample.a+greenSample.a+blueSample.a)/3.0
  );
}
