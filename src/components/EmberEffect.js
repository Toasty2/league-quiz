import React from 'react';

// Rising embers rather than literal flame shapes - a lot more achievable
// convincingly than simulating actual fire turbulence. Intensity escalates
// per streak tier via spawn rate/speed/size/colour.
const TIER_CONFIG = {
  1: { spawnRate: 0.3, speed: 0.4, size: [1.5, 3], colors: ['#C89B3C', '#E0A64A'], life: 90 },
  2: { spawnRate: 1.1, speed: 0.9, size: [2.5, 4.5], colors: ['#E0823C', '#FFAA32'], life: 75 },
  3: { spawnRate: 2.5, speed: 1.4, size: [3, 6], colors: ['#FF6414', '#FFD070', '#FF3C14'], life: 60 }
};

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 545;

class EmberEffect extends React.Component {
  canvasRef = React.createRef();
  particles = [];

  componentDidMount = () => {
    this.frameId = requestAnimationFrame(this.tick);
  }

  componentWillUnmount = () => {
    cancelAnimationFrame(this.frameId);
  }

  spawnParticle = () => {
    var config = TIER_CONFIG[this.props.tier];
    var color = config.colors[Math.floor(Math.random() * config.colors.length)];

    return {
      x: Math.random() * CANVAS_WIDTH,
      y: CANVAS_HEIGHT + 4,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(config.speed + Math.random() * config.speed * 0.5),
      size: config.size[0] + Math.random() * (config.size[1] - config.size[0]),
      life: 0,
      maxLife: config.life + Math.random() * 20,
      color
    };
  }

  tick = () => {
    var canvas = this.canvasRef.current;
    if (!canvas) {
      return;
    }

    var ctx = canvas.getContext('2d');
    var config = TIER_CONFIG[this.props.tier];

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // spawnRate can exceed 1 (guaranteed spawns per frame), with the
    // fractional remainder spawning probabilistically
    var guaranteedSpawns = Math.floor(config.spawnRate);
    for (var i = 0; i < guaranteedSpawns; i++) {
      this.particles.push(this.spawnParticle());
    }
    if (Math.random() < config.spawnRate - guaranteedSpawns) {
      this.particles.push(this.spawnParticle());
    }

    this.particles = this.particles.filter(p => p.life < p.maxLife);

    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life += 1;

      var progress = p.life / p.maxLife;
      var alpha = progress < 0.7 ? 1 : 1 - ((progress - 0.7) / 0.3);

      ctx.globalAlpha = Math.max(alpha, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 - progress * 0.4), 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    this.frameId = requestAnimationFrame(this.tick);
  }

  render() {
    return (
      <canvas
        ref={this.canvasRef}
        className="ember-effect"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
    );
  }
}

export default EmberEffect;
