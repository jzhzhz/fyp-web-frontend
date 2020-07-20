import React from 'react';
import { Editor, EditorState } from 'draft-js';
import '../styles/new-editor.css';

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

/** rich text editor in the home page setting */
class NewEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.focus = () => this.refs.editor.focus();
  }

  /** change the name of certain block to change its style */
  getBlockStyle = (block) => {
    switch (block.getType()) {
      case 'blockquote': return 'RichEditor-blockquote';
      default: return null;
    }
  }

  render() {
    let className = 'RichEditor-editor';
    const { editorState } = this.props;

    const CustomEditor = this.props.disabled ? <p>Editor Disabled</p> :
    <div className="RichEditor-root">
      <BlockStyleControls
        editorState={editorState}
        onToggle={this.props.toggleBlockType}
      />
      <InlineStyleControls
        editorState={editorState}
        onToggle={this.props.toggleInlineStyle}
      />
      <div className={className} onClick={this.focus}>
        <Editor
          blockStyleFn={this.getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorState}
          handleKeyCommand={this.props.handleKeyCommand}
          onChange={this.props.onChange}
          ref="editor"
          spellCheck={true}
        />
      </div>
    </div>;

    return (
      <React.Fragment>
        {CustomEditor}
      </React.Fragment>
    );
  }
}

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  // { label: 'Code Block', style: 'code-block' },
];

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
  { label: 'Strikethrough', style: 'STRIKETHROUGH' }
];

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

class StyleButton extends React.Component {
  onToggle = (event) => {
    event.preventDefault();
    this.props.onToggle(this.props.style);
  }

  render() {
    return (
      <span 
        className="RichEditor-styleButton" 
        onMouseDown={this.onToggle}
        style={{color: this.props.active ? "#5890ff" : null}}
      >
        {this.props.label}
      </span>
    );
  }
}

export default NewEditor;