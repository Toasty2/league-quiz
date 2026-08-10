import React from 'react';

// Matches Data Dragon's splash art dimensions (see .flip-card in league.css)
const SOURCE_WIDTH = 308;
const SOURCE_HEIGHT = 560;
const GRID_SPACING = 20;
const MAX_DISPLACEMENT_PX = 200;

function buildDisplacementGrid() {
  var cols = Math.ceil(SOURCE_WIDTH / GRID_SPACING) + 1;
  var rows = Math.ceil(SOURCE_HEIGHT / GRID_SPACING) + 1;
  var dx = [];
  var dy = [];

  for (var i = 0; i < cols * rows; i++) {
    dx.push(Math.random() * 2 - 1);
    dy.push(Math.random() * 2 - 1);
  }

  return { cols, rows, dx, dy };
}

// Warps the image via inverse remapping like SpiraliseReveal, but the
// displacement comes from a coarse grid of random vectors (randomised once
// per mount) bilinearly interpolated per pixel, rather than a clean polar
// swirl
class LiquidReveal extends React.Component {
  canvasRef = React.createRef();
  imgRef = React.createRef();
  grid = buildDisplacementGrid();

  sampleGrid = (values, gx0, gy0, tx, ty) => {
    var cols = this.grid.cols;
    var topLeft = values[gy0 * cols + gx0];
    var topRight = values[gy0 * cols + gx0 + 1];
    var bottomLeft = values[(gy0 + 1) * cols + gx0];
    var bottomRight = values[(gy0 + 1) * cols + gx0 + 1];

    var top = topLeft + (topRight - topLeft) * tx;
    var bottom = bottomLeft + (bottomRight - bottomLeft) * tx;
    return top + (bottom - top) * ty;
  }

  draw = () => {
    var img = this.imgRef.current;
    var canvas = this.canvasRef.current;
    if (!img || !canvas || !img.complete || img.naturalWidth === 0) {
      return;
    }

    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    var source = ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
    var output = ctx.createImageData(SOURCE_WIDTH, SOURCE_HEIGHT);
    var srcData = source.data;
    var outData = output.data;

    var strength = MAX_DISPLACEMENT_PX * (1 - this.props.progress);

    for (var y = 0; y < SOURCE_HEIGHT; y++) {
      var gy0 = Math.min(Math.floor(y / GRID_SPACING), this.grid.rows - 2);
      var ty = y / GRID_SPACING - gy0;

      for (var x = 0; x < SOURCE_WIDTH; x++) {
        var gx0 = Math.min(Math.floor(x / GRID_SPACING), this.grid.cols - 2);
        var tx = x / GRID_SPACING - gx0;

        var displaceX = this.sampleGrid(this.grid.dx, gx0, gy0, tx, ty) * strength;
        var displaceY = this.sampleGrid(this.grid.dy, gx0, gy0, tx, ty) * strength;

        var srcX = Math.min(SOURCE_WIDTH - 1, Math.max(0, Math.round(x + displaceX)));
        var srcY = Math.min(SOURCE_HEIGHT - 1, Math.max(0, Math.round(y + displaceY)));

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
LiquidReveal.durationMs = 30000;

export default LiquidReveal;
