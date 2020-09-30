import React, { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super();
    this.state = {
      error: false,
    };
  }

  componentDidCatch() {
    this.setState({ error: true });
  }
  render() {
    if (this.state.error) {
      return <div>Whoops....Something went Wrong! Please refresh the page and try again.</div>;
    }
    return this.props.children;
  }
}
