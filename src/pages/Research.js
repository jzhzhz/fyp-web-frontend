import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import styled from 'styled-components';

const Styles = styled.div`
  div.DraftEditor-root {
    border: 1px solid #000;
    background-color: beige;
    height: 200px;
    width: 300px;
    overflow-y: auto;
  }

  div.DraftEditor-editorContainer,
  div.public-DraftEditor-content {
    height: 100%;
  }
`;


class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = editorState => this.setState({editorState});
  }

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  _onBoldClick = () => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  render() {
    return (
      <div>
        <button onClick={this._onBoldClick}>B</button>
        <Editor 
          editorState={this.state.editorState} 
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange} 
        />
        <div>
          <h5>contents:</h5>
          <div>
            {this.state.editorState.getCurrentContent()}
          </div>
        </div>
      </div>
    );
  }
}

export const Research = () => (
  <Styles>
    <React.Fragment>
        <h2>Research</h2>
        <hr />
        <p>Note that the development build is not optimized.</p>
        <p>To create a production build, use yarn build. </p>
        <MyEditor />
    </React.Fragment>
  </Styles>
)
