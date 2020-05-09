import React from 'react';
import axios from 'axios';
// import _ from 'lodash';

class LabelPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUrl: this.props.location.pathname,
      codeContent: ""
    };
  }

  componentDidMount() {
    this.getLabelByType(this.state.type);
  }

  getLabelByType = async (type) => {
    let res = {};

    const url = process.env.REACT_APP_BACKEND_URL + 
      "/getLabelByUrl?url=" + 
      this.state.currentUrl;
    
    await axios.get(url)
      .then((getRes) => {
        res = getRes;
      })
      .catch((err) => {
        console.log(err);
      });

    if (res.status === 200 && res.data.code === 0) {
      let labelsRes = res.data.data[0];

      const currentCode = labelsRes.codeContent;

      // labels raw data initialization
      // and update old length accordingly
      this.setState({
        codeContent: currentCode
      });
      
      console.log(`get label success!`);      
    } else {
      console.log(`get ${type} labels failed!`);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div dangerouslySetInnerHTML={{__html: this.state.codeContent}} />
      </React.Fragment>
    );
  }
}

export default LabelPage;