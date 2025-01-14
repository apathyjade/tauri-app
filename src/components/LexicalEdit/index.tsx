
import { useEffect, useMemo, useRef, useState } from "react";
import { createEditor } from "lexical";
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode } from "@lexical/rich-text"
import { EditorContext } from "./context";
import Toolbar from "./components/Toolbar";

import $css from "./index.module.scss";
import DraggableBlockPlugin from "./components/DraggableBlockPlugin";

const initialConfig = {
  namespace: 'MyEditor',
  theme: {
  },
  nodes: [HeadingNode],
  onError: console.error
};


const LexicalEdit = () => {
  // const rootRef = useRef<HTMLDivElement>(null);
  const [editor] = useState(() => createEditor(initialConfig));
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };
  

  useEffect(() => {
    // editor.setRootElement(rootRef.current);
    // registerRichText(editor);
    // registerDragonSupport(editor);

    // editor.update(() => {
    //   // Get the RootNode from the EditorState
    //   const root = $getRoot();
    
    //   // Get the selection from the EditorState
    //   const selection = $getSelection();
    
    //   // Create a new ParagraphNode
    //   const paragraphNode = $createParagraphNode();
    
    //   // Create a new TextNode
    //   const textNode = $createTextNode('Hello world');
    
    //   // Append the text node to the paragraph
    //   paragraphNode.append(textNode);
    
    //   // Finally, append the paragraph to the root
    //   root.append(paragraphNode);
    // });
  }, []);

  const editorContextValue = useMemo(() => ({
    editor
  }), [editor]);
  return <EditorContext.Provider value={editorContextValue}>
    <LexicalComposer initialConfig={initialConfig}>
      <Toolbar />
      <RichTextPlugin
        contentEditable={<div ref={onRef} style={{position: 'relative'}} ><ContentEditable className={$css.body} /></div>}
        placeholder={<></>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      { floatingAnchorElem ? <DraggableBlockPlugin anchorElem={floatingAnchorElem} /> :undefined }
    </LexicalComposer>
  </EditorContext.Provider>;
}
{/* <div ref={rootRef} className={$css.body} contentEditable="true"></div>  */}
export default LexicalEdit;
