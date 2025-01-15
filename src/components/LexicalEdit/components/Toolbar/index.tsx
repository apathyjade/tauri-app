
import { $createParagraphNode, $createTextNode, $getRoot, $getSelection, $getTextContent, $isRangeSelection, LexicalEditor, FORMAT_TEXT_COMMAND } from "lexical";
import $css from "./index.module.scss";
import { $createHeadingNode, $isHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { $patchStyleText, $setBlocksType } from "@lexical/selection"

const btns = [
  {
    label: 'H1',
    key: 'h1'
  },
  {
    label: 'H2',
    key: 'h2'
  },
  {
    label: 'H3',
    key: 'h3'
  },
  {
    label: 'H4',
    key: 'h4'
  },
  {
    label: 'H5',
    key: 'h5'
  },
  {
    label: 'H6',
    key: 'h6'
  },
];

const updateBlock = (editor: LexicalEditor, key: HeadingTagType) => {
  editor.update(() => {
    const selection = $getSelection();
    // 检查是否是范围选区（RangeSelection）
    if ($isRangeSelection(selection)) {
      // 获取选区的锚点（光标位置）
      const anchorNode = selection.anchor.getNode();

      // 找到最近的段落节点
      const targetNode = anchorNode.getTopLevelElement();
      if (targetNode && $isHeadingNode(targetNode) && targetNode.getTag() === key) {
        const paragraphNode = $createParagraphNode();
        console.log('paragraphNode', paragraphNode)
        paragraphNode.append(...(targetNode.getChildren()));
        targetNode.replace(paragraphNode);
        paragraphNode.selectEnd();
      } else if (targetNode) {
        const headingNode = $createHeadingNode(key);
        const children = targetNode.getChildren();
        headingNode.append(...children);
        targetNode.replace(headingNode);
        headingNode.selectEnd();
      }
    }
  });
}

const updateTest = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      
      console.log(
        selection.getNodes(),
        // selection?.getTextContent(),
        anchorNode,
        // $getTextContent(),
        // $getRoot(),
      );
      // $setBlocksType(selection, () => $createHeadingNode('h1'));
      $patchStyleText(selection, {
        'font-size': '16px',
      });

      editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');

    }
    // const TextNode = $createTextNode();
    // TextNode.

  })
};

const Btn = ({ editor, item }: any) => {
  return <div
    className={$css.btn}
    onClick={() => updateBlock(editor as LexicalEditor, item.key as HeadingTagType)}
  >{item.label}</div>
}

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  return (
    <div className={$css.toolbar}>
      {
        btns.map(item => (<Btn key={item.key} editor={editor} item={item} />))
      }
      <div
        className={$css.btn}
        onClick={() => updateTest(editor as LexicalEditor)}
      >Test</div>
    </div>
  )
};

export default Toolbar;
