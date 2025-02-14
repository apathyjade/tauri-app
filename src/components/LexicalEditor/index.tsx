import { useState, useCallback, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';

import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';

import ToolBar from './plugins/ToolBar';
import $css from './index.module.scss';
import theme from './themes/StickyEditorTheme';

import { ToolbarContext } from './context/ToolbarContext';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import classNames from 'classnames';
import { ImageNode } from './nodes/ImgNode/ImageNode';
import { LineDividerNode } from './nodes/LineDivider';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { $getRoot, $insertNodes, CLEAR_HISTORY_COMMAND, EditorState, LexicalEditor, LexicalUpdateJSON } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes } from '@lexical/html';


const initialConfig = {
  namespace: 'MyEditor',
  theme: theme,
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    ImageNode,
    LineDividerNode,
    TableCellNode,
    TableNode,
    TableRowNode,
    CodeHighlightNode,
    CodeNode,
    HorizontalRuleNode,
  ] as any,
  onError: (error: Error) => {
  },
};

interface Props {
  value?: any;
  onChange: (editorStateJson: object) => void;
}


function Editor({ value, onChange }: Props) {
  const [isFull, setFull] = useState(false);
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (value?.root) {
      const editorState = editor.parseEditorState(value);
      editor.setEditorState(editorState);
      editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onChange = useCallback((editorState) => {
    editorState.read(() => {
      onChange(editorState.toJSON());
    });
  }, [onChange]);

  return (
    <div className={classNames($css.container, isFull ? $css.full : undefined)}>
      <ToolbarContext isFull={isFull} setFull={setFull}>
        <ToolBar />
        <RichTextPlugin
          contentEditable={
            <div className={$css['editor-warp']}>
              <ContentEditable className={$css['editor-content']} />
            </div>
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* <MarkdownShortcutPlugin transformers={TRANSFORMERS} /> */}
        <OnChangePlugin onChange={_onChange} />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <HorizontalRulePlugin />
      </ToolbarContext>
    </div>
  );
}

export default (props) => {
  return <LexicalComposer initialConfig={initialConfig}>
    <Editor {...props} />
  </LexicalComposer>;
};
