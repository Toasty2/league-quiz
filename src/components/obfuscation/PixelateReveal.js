import React from 'react';

// Matches Data Dragon's splash art dimensions (see .flip-card in league.css)
const SOURCE_WIDTH = 308;
const SOURCE_HEIGHT = 560;
const MAX_BLOCK_SIZE = 40;

// Low-res draw scaled back up with smoothing off - the standard pixelation trick.
class PixelateReveal extends React.Component {
  canvasRef = React.createRef();
  imgRef = React.createRef();

  draw = () => {
    var img = this.imgRef.current;
    var canvas = this.canvasRef.current;
    if (!img || !canvas || !img.complete || img.naturalWidth === 0) {
      return;
    }

    var ctx = canvas.getContext('2d');
    var blockSize = Math.max(1, Math.round(MAX_BLOCK_SIZE * (1 - this.props.progress)));
    var scaledWidth = Math.max(1, Math.round(SOURCE_WIDTH / blockSize));
    var scaledHeight = Math.max(1, Math.round(SOURCE_HEIGHT / blockSize));

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
    ctx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight, 0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
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
          style={{ display: 'none' }}
        />
        <canvas
          ref={this.canvasRef}
          width={SOURCE_WIDTH}
          height={SOURCE_HEIGHT}
          className={this.props.className}
          style={{ imageRendering: 'pixelated' }}
        />
      </React.Fragment>
    );
  }
}

// Ms to go from fully obscured to fully revealed
PixelateReveal.durationMs = 30000;

export default PixelateReveal;
