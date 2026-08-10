import React from 'react';

// Matches Data Dragon's splash art dimensions (see .flip-card in league.css)
const SOURCE_WIDTH = 308;
const SOURCE_HEIGHT = 560;
const MIN_CROP_FRACTION = 0.05;

// Renders only a small crop of the image blown up to fill the frame,
// zooming back out to the full picture as progress increases
// The crop stays centred on a fixed focus point (randomised once per mount)
// as it grows, clamped so it never samples outside the source image
class ZoomReveal extends React.Component {
  canvasRef = React.createRef();
  imgRef = React.createRef();
  focusX = Math.random() * SOURCE_WIDTH;
  focusY = Math.random() * SOURCE_HEIGHT;

  draw = () => {
    var img = this.imgRef.current;
    var canvas = this.canvasRef.current;
    if (!img || !canvas || !img.complete || img.naturalWidth === 0) {
      return;
    }

    var cropScale = MIN_CROP_FRACTION + this.props.progress * (1 - MIN_CROP_FRACTION);
    var cropWidth = SOURCE_WIDTH * cropScale;
    var cropHeight = SOURCE_HEIGHT * cropScale;
    var cropX = Math.min(Math.max(this.focusX - cropWidth / 2, 0), SOURCE_WIDTH - cropWidth);
    var cropY = Math.min(Math.max(this.focusY - cropHeight / 2, 0), SOURCE_HEIGHT - cropHeight);

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
    ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);
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
        />
      </React.Fragment>
    );
  }
}

// Ms to go from fully obscured to fully revealed
ZoomReveal.durationMs = 30000;

export default ZoomReveal;
