import React, { Component } from "react";
import "react-image-crop/lib/ReactCrop.scss";
import { Link } from "react-router-dom";
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
    isValidImageType: null,
    isValidImageDimension: null,
    imageUrl: null,
    crop: {
      unit: "px", // default, can be 'px' or '%'
      x: 0,
      y: 0,
    },
    imagegUploadFlag: null,
  };
  fileRef = React.createRef();

  updateCroppedImages = (imageStateKey, croppedImageBlob) => {
    let croppedImages = this.state.croppedImages;
    croppedImages[imageStateKey] = croppedImageBlob;
    this.setState({
      croppedImages,
    });
  };

  // Handle file upload of type image 
  handleChange = (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    let isValidImageType = true;
    if (!/^image\//.test(file.type)) {
      isValidImageType = false;
    }
    this.setState({
      imageUrl,
      isValidImageType,
      isValidImageDimension: null,
      imagegUploadFlag: null,
    });
  };

  onImgLoad = ({ target: img }) => {
    const height = img.offsetHeight;
    const width = img.offsetWidth;
    // TODO: Image of 1024x1024 dimension gets identified as 1025x1025. Need to check why that's happening.
    if (height >= 1024 && height <= 1025 && width >= 1024 && width <= 1025) {
      this.setState({ isValidImageDimension: true });
    } else {
      this.setState({ isValidImageDimension: false });
    }
  };

  // Upload Image file to firebase storage and map the Image url to DB
  uploadImageToFirebase = async (id, imgFile, key) => {
    const uploadTask = storage.ref(`images/${id}/${imgFile.name}`).put(imgFile);
    await uploadTask.on(
      "state_changed",
      (snapshot) => {
        this.setState({ imagegUploadFlag: true });
      },
      (error) => {
        console.log(error);
        this.setState({ imagegUploadFlag: false });
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

  // Upload the Image set to firebase storage.
  handleUpload = async () => {
    const id = new Date().getTime().toString();
    for (let [key, value] of Object.entries(this.state.croppedImages)) {
      await this.uploadImageToFirebase(id, value, key);
    }
  };

  render() {
    const { isValidImageType, imageUrl, isValidImageDimension, imagegUploadFlag } = this.state;
    return (
      <>
        <div>
          <Link to="/gallery">Gallery Page</Link>
        </div>
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
            {isValidImageType === false && <p>Invalid image type</p>}
            {imageUrl && (
              <>
                <div className="row mb-5 imagePreview">
                  <div className="col-12">
                    <p>Original Image Preview:</p>
                  </div>
                  <div style={{ margin: "auto" }}>
                    <img
                      onLoad={this.onImgLoad}
                      src={imageUrl}
                      className={isValidImageDimension === false ? "hide" : "show zoom"}
                      alt="preview"
                    />
                  </div>
                </div>
              </>
            )}
            {isValidImageDimension === false && <p>Not a valid image dimension</p>}
          </div>
          {isValidImageDimension && (
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <p>Crop Images to below 4 dimensions:</p>
                </div>
                {/* Render Image cropper component for the different dimensions */}
                {IMAGE_DIMENSIONS.map((imageAttribute, key) => {
                  const { width, height, imgKey } = imageAttribute;
                  return (
                    <div className="col-3" key={key}>
                      <ImageCropper
                        imageUrl={imageUrl}
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
                  <button onClick={this.handleUpload}>Upload images</button>
                  {imagegUploadFlag === true && <p>Images uploaded successfully.</p>}
                  {imagegUploadFlag === false && <p>Image upload failed.</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}
