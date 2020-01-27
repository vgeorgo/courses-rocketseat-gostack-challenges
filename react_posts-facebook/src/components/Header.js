import React, { Component } from 'react'
import logo from '../assets/facebook-logo.png'
import profile from '../assets/profile.png'

class TopBar extends Component {
  static defaultProps = {};

  state = {
    profile: 'My Profile',
  };

  render() {
    return (
      <div className="top-bar">
        <div className="logo"><img src={logo} /></div>
        <div></div>
        <div className="profile-menu">
          <div className="profile-name">{this.state.profile}</div>
          <div className="profile-image"><img src={profile} /></div>
        </div>
      </div>
    );
  }
}

export default TopBar;