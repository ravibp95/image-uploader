import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Gallery from "./components/gallery/GalleryImages";
import ImageUploader from "./components/image/ImageUploader";
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary";
import "./App.css";

function App() {
  return (
    <div className="App container">
      <ErrorBoundary>
        <Router>
          <div>Go to:</div>
          <Switch>
            <Route
              exact
              path="/"
              render={() => <Redirect to="image-upload" />}
            />
            <Route exact path="/gallery" component={Gallery} />
            <Route exact path="/image-upload" component={ImageUploader} />
          </Switch>
        </Router>
      </ErrorBoundary>
    </div>
  );
}

export default App;
