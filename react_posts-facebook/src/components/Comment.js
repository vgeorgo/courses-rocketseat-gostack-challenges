import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Comment extends Component {
  static defaultProps = {};
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  state = {};

  render() {
    return (
      <div className="comment">
        <div className="comment-profile-img"><img src={this.props.data.author.avatar} width="28" height="28" /></div>
        <div className="comment-content"><span>{this.props.data.author.name}</span> {this.props.data.content}</div>
      </div>
    );
  }
}

export default Comment;