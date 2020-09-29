import React, { Component } from "react";
import "react-image-crop/lib/ReactCrop.scss";
import { IMAGE_DIMENSIONS } from "../../constants/ImageDimensions";
import { storage, database } from "../../config";
import ImageCropper from "./ImageCropper";
import "./ImageUploader.scss";

export default class ImageUploader extends Component {
  state = {
    croppedImages: {
      i1: null,
      i2: null,
      i3: null,
      i4: null,
    },
    imgValidFlag: null,
    imgSrc: null,
    isValidDimension: null,
    crop: {
      unit: "px", // default, can be 'px' or '%'
      x: 0,
      y: 0,
    },
    url: null,
    progress: null,
  };
  fileRef = React.createRef();

  updateCroppedImages = (imageStateKey, croppedImageBlob, width, height) => {
    let croppedImages = this.state.croppedImages;
    croppedImages[imageStateKey] = croppedImageBlob;
    this.setState({
      croppedImages,
    });
  };

  handleChange = (e) => {
    const file = e.target.files[0];
    const imgSrc = URL.createObjectURL(file);
    let imgValidFlag = true;
    if (!/^image\//.test(file.type)) {
      imgValidFlag = false;
    }
    this.setState({
      imgSrc,
      imgValidFlag,
      isValidDimension: null,
      progress: null,
    });
  };

  onImgLoad = ({ target: img }) => {
    const height = img.offsetHeight;
    const width = img.offsetWidth;
    if (height >= 1024 && height <= 1025 && width >= 1024 && width <= 1025) {
      this.setState({ isValidDimension: true });
    } else {
      this.setState({ isValidDimension: false });
    }
  };
  uploadImageToFirebase = async (id, imgFile, key) => {
    const uploadTask = storage.ref(`images/${id}/${imgFile.name}`).put(imgFile);
    await uploadTask.on(
      "state_changed",
      (snapshot) => {
        this.setState({ progress: true });
      },
      (error) => {
        console.log(error);
        this.setState({ progress: false });
      },
      () => {
        storage
          .ref("images")
          .child(id)
          .child(imgFile.name)
          .getDownloadURL()
          .then((url) => {
            const dbEndPoint = `images/${id}`;
            const imgObj = {
              id,
              name: imgFile.name,
              url,
              width: imgFile.width,
              height: imgFile.height,
            };
            database.ref().child(dbEndPoint).push(imgObj);
          });
          return;
      }
    );
  };

  handleSubmit = async () => {
    const id = new Date().getTime().toString();
    for (let [key, value] of Object.entries(this.state.croppedImages)) {
      await this.uploadImageToFirebase(id, value, key);
    }
  };
  render() {
    const { imgValidFlag, imgSrc, isValidDimension, progress } = this.state;
    return (
      <div className="row imageUploader-container">
        <div className="col-12">
          <h1>Image Uploader</h1>
          <label>Choose a picture with dimension 1024x1024 to upload:</label>
          <br />
          <input
            ref={this.fileRef}
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={this.handleChange}
          />
          {imgValidFlag === false && <p>Invalid image type</p>}
          {imgSrc && (
            <>
              <div className="row mb-5 imagePreview">
                <div className="col-12">
                  <p>Original Image Preview:</p>
                </div>
                <div style={{ margin: "auto" }}>
                  <img
                    onLoad={this.onImgLoad}
                    src={imgSrc}
                    className={isValidDimension === false ? "hide" : "show"}
                    alt="preview"
                  />
                </div>
              </div>
            </>
          )}
          {isValidDimension === false && <p>Not a valid image dimension</p>}
        </div>
        {isValidDimension && (
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <p>Crop Images to below 4 dimensions:</p>
              </div>
              {IMAGE_DIMENSIONS.map((imageAttribute, key) => {
                const { width, height, imgKey } = imageAttribute;
                return (
                  <div className="col-3" key={key}>
                    <ImageCropper
                      imgSrc={imgSrc}
                      width={width}
                      height={height}
                      imageKey={imgKey}
                      croppedImageBlob={this.state.croppedImages[imgKey]}
                      updateCroppedImages={this.updateCroppedImages}
                    />
                  </div>
                );
              })}
              <div className="col-12 mt-5">
                <button onClick={this.handleSubmit}>Upload images</button>
                {progress === true && <p>Images uploaded successfully.</p>}
                {progress === false && <p>Image upload failed.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
