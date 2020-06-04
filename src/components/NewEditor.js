import React from 'react';
// eslint-disable-next-line
import { Editor, EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html'
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

class NewEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.focus = () => this.refs.editor.focus();
  }

  // get html code from sidebar and parse it to editor
  // componentDidUpdate(prevProps) {
  //   if (this.props.htmlSegment !== prevProps.htmlSegment) {
  //     const blocksFromHTML = convertFromHTML(this.props.htmlSegment);
  //     const state = ContentState.createFromBlockArray(
  //       blocksFromHTML.contentBlocks,
  //       blocksFromHTML.entityMap,
  //     );

  //     this.props.onChange( EditorState.createWithContent(state) );
  //   }
  // }

  handleFileUpload = (e) => {
    e.preventDefault();
    console.log(convertToRaw(this.props.editorState.getCurrentContent()));
    console.log(stateToHTML(this.props.editorState.getCurrentContent()));
  }

  /** change the name of certain block to change its style */
  getBlockStyle = (block) => {
    switch (block.getType()) {
      case 'blockquote': return 'RichEditor-blockquote';
      default: return null;
    }
  }

  render() {
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    const { editorState } = this.props;

    return (
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
      </div>
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
  { label: 'Code Block', style: 'code-block' },
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