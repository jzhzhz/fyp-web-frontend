import React from 'react';
import axios from 'axios';

/** page components according to the navbar labels */
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

  componentWillUnmount() {
    // disable setState action when unmounting components
    this.setState = (state, callback)=>{
      return;
    };
  }

  getLabelByType = async (type) => {
    const url = process.env.REACT_APP_BACKEND_URL + 
      "/getLabelByUrl?url=" + 
      this.state.currentUrl;
    
    const res = await axios.get(url)
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