import React from 'react';

// Matches Data Dragon's splash art dimensions (see .flip-card in league.css)
const SOURCE_WIDTH = 308;
const SOURCE_HEIGHT = 560;
const MAX_BLOCK_SIZE = 80;

// Same block grid as PixellateReveal, but each block takes the colour of a
// single random pixel sampled from within it
class MosaicReveal extends React.Component {
  canvasRef = React.createRef();
  imgRef = React.createRef();

  draw = () => {
    var img = this.imgRef.current;
    var canvas = this.canvasRef.current;
    if (!img || !canvas || !img.complete || img.naturalWidth === 0) {
      return;
    }

    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

    var sourceData = ctx.getImageData(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT).data;
    var blockSize = Math.max(1, Math.round(MAX_BLOCK_SIZE * (1 - this.props.progress)));

    for (var blockY = 0; blockY < SOURCE_HEIGHT; blockY += blockSize) {
      var blockHeight = Math.min(blockSize, SOURCE_HEIGHT - blockY);
      for (var blockX = 0; blockX < SOURCE_WIDTH; blockX += blockSize) {
        var blockWidth = Math.min(blockSize, SOURCE_WIDTH - blockX);

        var sampleX = blockX + Math.floor(Math.random() * blockWidth);
        var sampleY = blockY + Math.floor(Math.random() * blockHeight);
        var sampleIndex = (sampleY * SOURCE_WIDTH + sampleX) * 4;

        ctx.fillStyle = `rgb(${sourceData[sampleIndex]}, ${sourceData[sampleIndex + 1]}, ${sourceData[sampleIndex + 2]})`;
        ctx.fillRect(blockX, blockY, blockWidth, blockHeight);
      }
    }
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
MosaicReveal.durationMs = 30000;

export default MosaicReveal;
