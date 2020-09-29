import React from "react";
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from "react-router-dom";
import Gallery from "./components/gallery/GalleryImages";
import ImageUploader from "./components/image/ImageUploader";
import "./App.css";

function App() {
  return (
    <div className="App container">
      <Router>
        <div>Go to:</div>
        <div>
          <Link to="/image-upload">Upload Image Page</Link>
        </div>
        <div>
          <Link to="/gallery">Gallery Page</Link>
        </div>
        <Switch>
          <Route exact path="/" render={()=>(
            <Redirect to="image-upload"/>
          )}/>
          <Route exact path="/gallery" component={Gallery} />
          <Route exact path="/image-upload" component={ImageUploader} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
