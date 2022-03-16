import React, { Component } from "react";
import SearchComponent from "./index";

class Search extends Component {
  render() {
    const { isLP } = this.props;

    return <SearchComponent isLP={isLP} />;
  }
}

Search.defaultProps = {
  isLP: false
};

export default Search;
