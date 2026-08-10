import React from 'react';

// Matches Data Dragon's splash art dimensions (see .flip-card in league.css)
const SOURCE_WIDTH = 308;
const SOURCE_HEIGHT = 560;
const MAX_SWIRL_RADIANS = Math.PI * 3;

// Warps the image around its centre via inverse polar-coordinate remapping -
// each output pixel borrows from a source pixel rotated by an amount that
// tapers off with distance from centre, producing a whirlpool-style twist.
// Direction (clockwise/counterclockwise) is randomised once per mount.
class SpiraliseReveal extends React.Component {
  canvasRef = React.createRef();
  imgRef = React.createRef();
  direction = Math.random() < 0.5 ? 1 : -1;

  draw = () => {
    var img = this.imgRef.current;
    var canvas = this.canvasRef.current;
    if (!img || !canvas || !img.complete || img.naturalWidth === 0) {
      return;
    }

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
    ctx.drawImage(img, 0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    var source = ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
    var output = ctx.createImageData(SOURCE_WIDTH, SOURCE_HEIGHT);
    var srcData = source.data;
    var outData = output.data;

    var centreX = SOURCE_WIDTH / 2;
    var centreY = SOURCE_HEIGHT / 2;
    var maxRadius = Math.sqrt(centreX * centreX + centreY * centreY);
    var strength = MAX_SWIRL_RADIANS * (1 - this.props.progress);

    for (var y = 0; y < SOURCE_HEIGHT; y++) {
      for (var x = 0; x < SOURCE_WIDTH; x++) {
        var dx = x - centreX;
        var dy = y - centreY;
        var radius = Math.sqrt(dx * dx + dy * dy);
        var angle = Math.atan2(dy, dx);

        var falloff = Math.max(0, 1 - radius / maxRadius);
        var swirledAngle = angle + strength * falloff * this.direction;

        var srcX = Math.round(centreX + radius * Math.cos(swirledAngle));
        var srcY = Math.round(centreY + radius * Math.sin(swirledAngle));
        srcX = Math.min(SOURCE_WIDTH - 1, Math.max(0, srcX));
        srcY = Math.min(SOURCE_HEIGHT - 1, Math.max(0, srcY));

        var srcIndex = (srcY * SOURCE_WIDTH + srcX) * 4;
        var outIndex = (y * SOURCE_WIDTH + x) * 4;
        outData[outIndex] = srcData[srcIndex];
        outData[outIndex + 1] = srcData[srcIndex + 1];
        outData[outIndex + 2] = srcData[srcIndex + 2];
        outData[outIndex + 3] = srcData[srcIndex + 3];
      }
    }

    ctx.putImageData(output, 0, 0);
  }

  componentDidMount = () => {
    this.draw();
  }

  componentDidUpdate = () => {
    this.draw();
  }

  render() {
    return (
      <React.Fragment>
        <img
          ref={this.imgRef}
          src={this.props.proxyUrl}
          alt={this.props.alt}
          onLoad={this.draw}
          crossOrigin="anonymous"
          style={{ display: 'none' }}
        />
        <canvas
          ref={this.canvasRef}
          width={SOURCE_WIDTH}
          height={SOURCE_HEIGHT}
          className={this.props.className}
        />
      </React.Fragment>
    );
  }
}

// Ms to go from fully obscured to fully revealed
SpiraliseReveal.durationMs = 30000;

export default SpiraliseReveal;
