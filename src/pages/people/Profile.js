import React from 'react';

class Profile extends React.Component {

  componentDidMount() {
    // get all detailed information
  }
  
  render() {

    return (
      <React.Fragment>
        <p>the param name is: {this.props.match.params.name}</p>
      </React.Fragment>
    );
  }
}

export default Profile;
