// Field types
const U_FIELD = 0;
const V_FIELD = 0.5;
const S_FIELD = 1.0;

export class FluidSimulator {
  density: number;
  h: number;
  numX: number;
  numY: number;
  u: number[][];
  v: number[][];
  p: number[][];
  s: number[][];
  m: number[][];
  inletMinJ: number;
  inletMaxJ: number;

  constructor(density: number, numX: number, numY: number, h: number) {
    this.density = density;
    this.h = h;
    this.numX = numX + 2;
    this.numY = numY + 2;

    const createGrid = (fill = 0.0) => 
        Array(this.numX).fill(0).map(() => Array(this.numY).fill(fill));
    
    this.u = createGrid();
    this.v = createGrid();
    this.p = createGrid();
    this.s = createGrid();
    this.m = createGrid(1.0);
    
    const pipeH = 0.8 * this.numY; // Increased from 0.2
    this.inletMinJ = Math.floor(0.5 * this.numY - 0.5 * pipeH);
    this.inletMaxJ = Math.floor(0.5 * this.numY + 0.5 * pipeH);

    // Setup walls
    for (let i = 0; i < this.numX; i++) {
        for (let j = 0; j < this.numY; j++) {
            if (i === 0 || j === 0 || j === this.numY - 1) {
                this.s[i][j] = 0.0; // Wall
            } else {
                this.s[i][j] = 1.0; // Fluid
            }
        }
    }
  }

  private integrate(dt: number, gravity: number) {
    for (let i = 1; i < this.numX; i++) {
      for (let j = 1; j < this.numY - 1; j++) {
        if (this.s[i][j] !== 0.0 && this.s[i][j - 1] !== 0.0) {
          this.v[i][j] += gravity * dt;
        }
      }
    }
  }

  private solveIncompressibility(numIters: number, dt: number, overRelaxation: number) {
    const cp = this.density * this.h / dt;

    for (let iter = 0; iter < numIters; iter++) {
      for (let i = 1; i < this.numX - 1; i++) {
        for (let j = 1; j < this.numY - 1; j++) {
          if (this.s[i][j] === 0.0) continue;

          const s_sum = this.s[i - 1][j] + this.s[i + 1][j] + this.s[i][j - 1] + this.s[i][j + 1];
          if (s_sum === 0.0) continue;

          const div = this.u[i + 1][j] - this.u[i][j] + this.v[i][j + 1] - this.v[i][j];
          const pressureChange = -div / s_sum * overRelaxation;
          
          this.p[i][j] += cp * pressureChange;

          this.u[i][j] -= this.s[i - 1][j] * pressureChange;
          this.u[i + 1][j] += this.s[i + 1][j] * pressureChange;
          this.v[i][j] -= this.s[i][j - 1] * pressureChange;
          this.v[i][j + 1] += this.s[i][j + 1] * pressureChange;
        }
      }
    }
  }
  
  private extrapolate() {
    for (let i = 0; i < this.numX; i++) {
        this.u[i][0] = this.u[i][1];
        this.u[i][this.numY - 1] = this.u[i][this.numY - 2];
    }
    for (let j = 0; j < this.numY; j++) {
        this.v[0][j] = this.v[1][j];
        this.v[this.numX - 1][j] = this.v[this.numX - 2][j];
    }
  }

  public sampleField(x: number, y: number, fieldType: number, fieldData: number[][]): number {
    const h1 = 1.0 / this.h, h2 = 0.5 * this.h;
    x = Math.max(Math.min(x, this.numX * this.h), this.h);
    y = Math.max(Math.min(y, this.numY * this.h), this.h);

    let dx = 0.0, dy = 0.0;
    if (fieldType === U_FIELD) dy = h2;
    else if (fieldType === V_FIELD) dx = h2;
    else if (fieldType === S_FIELD) { dx = h2; dy = h2; }

    const x0 = Math.min(Math.floor((x - dx) * h1), this.numX - 2);
    const tx = ((x - dx) - x0 * this.h) * h1;
    const x1 = Math.min(x0 + 1, this.numX - 2);
    
    const y0 = Math.min(Math.floor((y - dy) * h1), this.numY - 2);
    const ty = ((y - dy) - y0 * this.h) * h1;
    const y1 = Math.min(y0 + 1, this.numY - 2);

    const sx = 1.0 - tx, sy = 1.0 - ty;

    return (
        sx * sy * fieldData[x0][y0] + tx * sy * fieldData[x1][y0] +
        tx * ty * fieldData[x1][y1] + sx * ty * fieldData[x0][y1]
    );
  }

  private advectVel(dt: number) {
    const newU = this.u.map(row => [...row]);
    const newV = this.v.map(row => [...row]);
    const h2 = 0.5 * this.h;

    for (let i = 1; i < this.numX - 1; i++) {
      for (let j = 1; j < this.numY - 1; j++) {
        if (this.s[i][j] !== 0.0 && this.s[i - 1][j] !== 0.0) {
          const avgV = (this.v[i - 1][j] + this.v[i][j] + this.v[i - 1][j + 1] + this.v[i][j + 1]) * 0.25;
          let posX = i * this.h;
          let posY = j * this.h + h2;
          posX -= dt * this.u[i][j];
          posY -= dt * avgV;
          newU[i][j] = this.sampleField(posX, posY, U_FIELD, this.u);
        }
        if (this.s[i][j] !== 0.0 && this.s[i][j - 1] !== 0.0) {
            const avgU = (this.u[i][j - 1] + this.u[i][j] + this.u[i + 1][j - 1] + this.u[i + 1][j]) * 0.25;
            let posX = i * this.h + h2;
            let posY = j * this.h;
            posX -= dt * avgU;
            posY -= dt * this.v[i][j];
            newV[i][j] = this.sampleField(posX, posY, V_FIELD, this.v);
        }
      }
    }
    this.u = newU;
    this.v = newV;
  }

  private advectSmoke(dt: number) {
    const newM = this.m.map(row => [...row]);
    const h2 = 0.5 * this.h;

    for (let i = 1; i < this.numX - 1; i++) {
        for (let j = 1; j < this.numY - 1; j++) {
            if (this.s[i][j] !== 0.0) {
                const avgU = (this.u[i][j] + this.u[i + 1][j]) * 0.5;
                const avgV = (this.v[i][j] + this.v[i][j + 1]) * 0.5;
                const x = i * this.h + h2 - dt * avgU;
                const y = j * this.h + h2 - dt * avgV;
                newM[i][j] = this.sampleField(x, y, S_FIELD, this.m);
            }
        }
    }
    this.m = newM;
  }

  simulate(dt: number, gravity: number, numIters: number, overRelaxation: number, flowVelocity: number, currentTime: number) {
    // Reset inlet velocity
    for(let j=1; j<this.numY - 1; j++) this.u[1][j] = 0.0;

    const inletCenterJ = (this.inletMinJ + this.inletMaxJ) / 2.0;
    const inletHalfWidth = (this.inletMaxJ - this.inletMinJ) / 2.0;

    // Use a cosine function to create a wave-like pulse for the inlet velocity
    const waveFrequency = 2.0; // Controls how fast the waves pulse
    const waveAmplitude = 0.4; // Controls how strong the pulses are
    const timeBasedVelocity = flowVelocity * (1.0 + waveAmplitude * Math.cos(currentTime * waveFrequency));

    if (inletHalfWidth > 0) {
        for (let j = this.inletMinJ; j < this.inletMaxJ; j++) {
            const relativePos = (j - inletCenterJ) / inletHalfWidth;
            // The speed profile is parabolic, but its magnitude pulses over time
            const speed = timeBasedVelocity * (1 - relativePos * relativePos);
            this.u[1][j] = Math.max(0.0, speed);
        }
    }

    for (let j = this.inletMinJ; j < this.inletMaxJ; j++) {
        this.m[1][j] = 0.0;
    }

    this.integrate(dt, gravity);
    
    // Reset pressure
    for(let i=0; i<this.numX; i++) for(let j=0; j<this.numY; j++) this.p[i][j] = 0.0;
    
    this.solveIncompressibility(numIters, dt, overRelaxation);
    this.extrapolate();
    this.advectVel(dt);
    this.advectSmoke(dt);
  }
}