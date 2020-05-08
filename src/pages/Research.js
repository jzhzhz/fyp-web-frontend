import React from 'react';
import { Editor, EditorState } from 'draft-js';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = editorState => this.setState({editorState});
  }
  render() {
    return (
      <Editor editorState={this.state.editorState} onChange={this.onChange} />
    );
  }
}

export const Research = () => (
  <React.Fragment>
      <h2>Research</h2>
      <hr />
      <p>Note that the development build is not optimized.</p>
      <p>To create a production build, use yarn build. </p>
      <MyEditor />
  </React.Fragment>
)

