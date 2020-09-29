import React, { Component } from "react";
import _ from "lodash";
import { database } from "../../config";
import "./GalleryImages.scss";

export default class GalleryImages extends Component {
  state = { images: [] };
  componentDidMount() {
    this.fetchImages();
  }

  fetchImages = () => {
    const dbEndPoint = `images`;
    database
      .ref()
      .child(dbEndPoint)
      .on("value", (snapshot) => {
        let images = [];
        _.map(snapshot.val(), (value, key) => {
          const imageGroup = [];
          for (let [imgKey, imgValue] of Object.entries(value)) {
            imageGroup.push({
              name: imgValue.name,
              url: imgValue.url,
              width: imgValue.width,
              height: imgValue.height,
            });
          }
          const imageGroupSorted = _.sortBy(imageGroup, ["width", "height"]);

          const imgObj = {
            imgGroupId: key,
            imageGroupSorted,
          };
          images.push(imgObj);
        });
        this.setState({ images });
      });
  };
  render() {
    const { images } = this.state;
    return (
      <div className="gallery-container">
        <div className="row">
          <div className="col-12">
            <h1>Gallery</h1>
          </div>
          {images.length > 0 &&
            images.map((imgObj) => {
              return (
                <div key={imgObj.imgGroupId} className="row imageGroup">
                  {imgObj.imageGroupSorted.map((imgGrpObj, index) => (
                    <div
                      key={`${imgObj.imgGroupId}${index}`}
                      className="col-3 imageGroup__images"
                    >
                      <div className="image-container">
                        <img src={imgGrpObj.url} alt="preview" />
                        <p>
                          {imgGrpObj.width}x{imgGrpObj.height}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}
