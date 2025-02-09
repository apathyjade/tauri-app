import { useState, useCallback } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';

import ToolBar from './plugins/ToolBar';
import $css from './index.module.scss';
import theme from './themes/StickyEditorTheme';

import { ToolbarContext } from './context/ToolbarContext';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import classNames from 'classnames';
import { ImageNode } from './nodes/ImgNode/ImageNode';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { EditorState } from 'lexical';


const initialConfig = {
  namespace: 'MyEditor',
  theme: theme,
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    ImageNode,
    TableCellNode,
    TableNode,
    TableRowNode,
    CodeHighlightNode,
    CodeNode,
  ] as any,
  onError: (error: Error) => {
    console.error(error);
  },
};


function Editor() {
  const [isFull, setFull] = useState(false);

  const onChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      // Handle editor state changes here
    });
  }, []);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={classNames($css.container, isFull ? $css.full : undefined)}>
        <ToolbarContext isFull={isFull} setFull={setFull}>
          <ToolBar />
          <RichTextPlugin
            contentEditable={<ContentEditable className={$css['editor-warp']} />}
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          {/* <MarkdownShortcutPlugin transformers={TRANSFORMERS} /> */}
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </ToolbarContext>
      </div>
    </LexicalComposer>
  );
}

export default Editor;
