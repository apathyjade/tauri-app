import { useState, useCallback, useEffect } from 'react';
import { CLEAR_HISTORY_COMMAND, EditorState } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';

import classNames from 'classnames';

import $css from './index.module.scss';
import theme from './themes/StickyEditorTheme';
import { EditorContext, useEditorContext } from './context/EditorContext';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalNodes } from './nodes';
import ToolBar from './plugins/ToolBar';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import LinkPlugin from './plugins/LinkPlugin';


const initialConfig = {
  namespace: 'MyEditor',
  theme: theme,
  nodes: LexicalNodes,
  onError: (error: Error) => {
  },
};

interface Props {
  value?: any;
  onChange: (editorStateJson: object) => void;
}


function Editor({ value, onChange }: Props) {

  const [editor] = useLexicalComposerContext();
  const {
    isFull,
    setFloatingAnchorElem,
  } = useEditorContext();

  useEffect(() => {
    if (value?.root) {
      const editorState = editor.parseEditorState(value);
      editor.setEditorState(editorState);
      editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const _onChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      onChange(editorState.toJSON());
    });
  }, [onChange]);

  return (
    <div className={classNames($css.container, isFull ? $css.full : undefined)}>
      <ToolBar />
      <RichTextPlugin
        contentEditable={
          <div ref={onRef} className={$css['editor-warp']}>
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
      <FloatingLinkEditorPlugin />
      <LinkPlugin />
    </div>
  );
}

export default (props: Props) => {
  return (
    <LexicalComposer initialConfig={initialConfig as any}>
      <EditorContext>
        <Editor {...props} />
      </EditorContext>
    </LexicalComposer>
  );
};
