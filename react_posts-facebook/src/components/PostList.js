import React, { Component } from 'react';

import Post from './Post';

import profile1 from '../assets/profile.png';
import profile2 from '../assets/profile2.png';
import profile3 from '../assets/profile3.png';

class PostList extends Component {
  static defaultProps = {};

  state = {
    posts: [
      {
        id: 1,
        author: {
          name: 'Gabriel Juca',
          avatar: profile2
        },
        date: '04 Jun 2019',
        content: 'Pessoal, alguém sabe se a Rocketseat está contratando?',
        comments: [
          {
            id: 1,
            author: {
              name: 'Diego Fernandes',
              avatar: profile1
            },
            content: 'We hire everyone, even if they live on another planet! No prejudice!',
          },
          {
            id: 3,
            author: {
              name: 'Gabriel Juca',
              avatar: profile2
            },
            content: 'Nice!!!',
          }
        ],
      },
      {
        id: 2,
        author: {
          name: 'Pedro Buenas Ondas',
          avatar: profile3
        },
        date: '05 Jun 2019',
        content: 'Is this really true? :O',
        comments: [
          {
            id: 2,
            author: {
              name: 'Diego Fernandes',
              avatar: profile1
            },
            content: 'Yes it is Julio. We are always looking for new blood, MUHAHAHAHHAHAHA!'
          }
        ],
      }
    ]
  };

  render() {
    return (
      <div className="posts-container">
        <div className="posts-ignore"></div>
        <div className="posts">{ this.state.posts.map(post => <Post key={post.id} data={post} />) }</div>
        <div className="posts-ignore"></div>
      </div>
    );
  }
}

export default PostList;