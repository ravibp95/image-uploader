import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { database, firebase } from "../../config";
import "./GalleryImages.scss";

export default class GalleryImages extends Component {
  state = { imageGroups: [] };
  componentDidMount() {
    this.fetchImagesDB();
  }

  fetchImagesDB = () => {
    const dbEndPoint = `images`;
    database
      .ref()
      .child(dbEndPoint)
      .on("value", (snapshot) => {
        let imageGroups = [];
        _.map(snapshot.val(), (imgGrp, key) => {
          const imageGroup = [];
          Object.values(imgGrp).forEach((image) => {
            imageGroup.push({
              name: image.name,
              url: image.url,
              width: image.width,
              height: image.height,
            });
          });
          const imageGroupSortedList = _.sortBy(imageGroup, [
            "width",
            "height",
          ]);

          const imageGroupObject = {
            imageGroupId: key,
            imageGroupSortedList,
          };
          imageGroups.push(imageGroupObject);
        });
        if (window.location.pathname == "/gallery") {
          this.setState({ imageGroups: imageGroups.reverse() });
        }
      });
  };
  render() {
    const { imageGroups } = this.state;
    return (
      <>
        <div>
          <Link to="/image-upload">Upload Image Page</Link>
        </div>
        <div className="gallery-container">
          <div className="row">
            <div className="col-12">
              <h1>Gallery</h1>
            </div>
            {imageGroups.length > 0 &&
              imageGroups.map((imageGroupObject) => {
                return (
                  <div
                    key={imageGroupObject.imageGroupId}
                    className="row imageGroup"
                  >
                    {imageGroupObject.imageGroupSortedList.map(
                      (image, index) => (
                        <div
                          key={`${imageGroupObject.imageGroupId}-${index}`}
                          className="col-3 imageGroup__images"
                        >
                          <div className="image-container">
                            <img src={image.url} alt="preview" />
                            <p>
                              {image.width}x{image.height}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </>
    );
  }
}
