import { Filter, GlProgram } from 'pixi.js';

// Minimal passthrough vertex shader
const sobelVertex = `
attribute vec2 aPosition;
varying vec2 vTextureCoord;
void main(void) {
    vTextureCoord = aPosition;
    gl_Position = vec4((aPosition * 2.0 - 1.0), 0.0, 1.0);
}
`;

// GLSL code for Sobel edge detection
const sobelFragment = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 uResolution;

void main(void) {
    vec2 texel = 1.0 / uResolution;
    float kernelX[9];
    float kernelY[9];
    kernelX[0] = -1.0; kernelX[1] = 0.0; kernelX[2] = 1.0;
    kernelX[3] = -2.0; kernelX[4] = 0.0; kernelX[5] = 2.0;
    kernelX[6] = -1.0; kernelX[7] = 0.0; kernelX[8] = 1.0;
    kernelY[0] = -1.0; kernelY[1] = -2.0; kernelY[2] = -1.0;
    kernelY[3] =  0.0; kernelY[4] =  0.0; kernelY[5] =  0.0;
    kernelY[6] =  1.0; kernelY[7] =  2.0; kernelY[8] =  1.0;
    float sumX = 0.0;
    float sumY = 0.0;
    int i = 0;
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 offset = vec2(float(x), float(y)) * texel;
            vec3 color = texture2D(uSampler, vTextureCoord + offset).rgb;
            float intensity = dot(color, vec3(0.299, 0.587, 0.114));
            sumX += intensity * kernelX[i];
            sumY += intensity * kernelY[i];
            i++;
        }
    }
    float edge = sqrt(sumX * sumX + sumY * sumY);
    gl_FragColor = vec4(vec3(edge), 1.0);
}
`;

const program = new GlProgram({ vertex: sobelVertex, fragment: sobelFragment });

export function createSobelFilter(width: number, height: number): Filter {
  return new Filter({
    glProgram: program,
    resources: {
      uResolution: [width, height],
    },
  });
} 