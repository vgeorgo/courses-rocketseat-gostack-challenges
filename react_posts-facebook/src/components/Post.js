import React, { Component } from 'react';
import PropTypes from 'prop-types'

import Comment from './Comment';

class Post extends Component {
  static defaultProps = {};
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  state = {};

  render() {
    return (
      <div className="post">
        <div className="post-header">
          <div className="post-profile-img"><img src={this.props.data.author.avatar} width="30" height="30" /></div>
          <div className="post-profile-user">{this.props.data.author.name}<br/><span>{this.props.data.date}</span></div>
        </div>
        <div className="post-body">{this.props.data.content}</div>
        <div className="post-comments">{ this.props.data.comments.map(comment => <Comment key={comment.id} data={comment} />) }</div>
      </div>
    );
  }
}

export default Post;