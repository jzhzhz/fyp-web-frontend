import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import styled from 'styled-components';

const Styles = styled.div`
  div.DraftEditor-root {
    border: 1px solid #000;
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
    // this.state = {editorState: EditorState.createEmpty()};
    // this.onChange = editorState => this.setState({editorState});
  }

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  }

  _onBoldClick = (e) => {
    e.preventDefault();
    this.props.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD')
    );
  }

  render() {
    return (
      <Styles>
        <div>
          <button onClick={this.props.toggleInlineStyle('BOLD')}>B</button>
          <Editor 
            editorState={this.props.editorState} 
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.props.onChange} 
          />
        </div>
      </Styles>
    );
  }
}

export default MyEditor;