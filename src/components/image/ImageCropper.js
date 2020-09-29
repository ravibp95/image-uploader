import React, { PureComponent } from "react";
import ReactCrop from "react-image-crop";
import "./ImageCropper.scss";

export default class ImageCropper extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      crop: {
        unit: "px", // default, can be 'px' or '%'
        x: 0,
        y: 0,
        width: props.width,
        height: props.height,
      },
    };
  }

  imageRef = React.createRef();

  onImageLoaded = (image) => {
    this.imageRef = image;
  };
  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };
  async makeClientCrop(crop) {
    const { width, height, imageKey } = this.props;
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageBlob = await this.getCroppedImg(
        this.imageRef,
        crop,
        `newFile-${width}x${height}.jpeg`
      );
      this.props.updateCroppedImages(imageKey, croppedImageBlob, width, height);
    }
  }
  getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          blob.name = fileName;
          blob.width = crop.width;
          blob.height = crop.height;
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  };
  computeImageUrl = () => {
    return URL.createObjectURL(this.props.croppedImageBlob)
  }
  render() {
    const { imgSrc, width, height, croppedImageBlob } = this.props;
    const { crop } = this.state;

    return (
      <div className="imageCropper-container">
        <ReactCrop
          src={imgSrc}
          crop={crop}
          keepSelection={true}
          locked={true}
          onChange={(newCrop) => {
            this.setState({
              crop: newCrop,
            });
          }}
          onImageLoaded={this.onImageLoaded}
          onComplete={this.onCropComplete}
        />
        {croppedImageBlob && (
          <>
            <div className="col-12">
              <p>{`Crop Preview: ${width} x ${height}`}</p>
            </div>
            <div>
              <img
                className="cropped-image"
                src={this.computeImageUrl()}
                alt="preview"
              />
            </div>
          </>
        )}
      </div>
    );
  }
}
