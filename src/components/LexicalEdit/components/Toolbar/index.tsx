
import { $createParagraphNode, $createTextNode, $getRoot, $getSelection, $getTextContent, $isRangeSelection, LexicalEditor, FORMAT_TEXT_COMMAND, RangeSelection, ElementNode, $isElementNode } from "lexical";
import $css from "./index.module.scss";
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { $patchStyleText, $setBlocksType } from "@lexical/selection"
import { $createListNode } from "@lexical/list";


enum ActionType { Block, Inline, Style };

enum BlockActionType {
  paragraph = 'paragraph',
  heading = 'heading',
  quote = 'quote',
  list = 'list',
}

enum InlineActionType {
  TextFormat = 'text-format',
}

enum HeadingTag {
  h1 = 'h1',
  h2 = 'h2',
  h3 = 'h3',
  h4 = 'h4',
  h5 = 'h5',
  h6 = 'h6',
}
enum ListType {
  number = 'number',
  bullet = 'bullet',
  check = 'check',
}

enum TextFormatType {
  bold = 'bold', italic = 'italic', strikethrough = 'strikethrough', underline = 'underline', code= 'code',
}

type BlockAction = {
  type: BlockActionType.paragraph;
} | {
  type: BlockActionType.heading;
  tag: HeadingTag;
} | {
  type: BlockActionType.quote;
} | {
  type: BlockActionType.list;
  listType: ListType;
}

type InlineAction = {
  type: InlineActionType.TextFormat;
  formatType: TextFormatType,
}

type Btn = {
  label: string;
  key: string;
  actionType: ActionType.Block;
  action: BlockActionType;
} | {
  label: string;
  key: TextFormatType;
  actionType: ActionType.Inline;
  action: InlineActionType;
}

const btns: Btn[] = [
  {
    label: 'H1',
    key: HeadingTag.h1,
    actionType: ActionType.Block,
    action: BlockActionType.heading,
  },
  {
    label: 'H2',
    key: HeadingTag.h2,
    actionType: ActionType.Block,
    action: BlockActionType.heading,
  },
  {
    label: 'H3',
    key: HeadingTag.h3,
    actionType: ActionType.Block,
    action: BlockActionType.heading,
  },
  {
    label: 'H4',
    key: HeadingTag.h4,
    actionType: ActionType.Block,
    action: BlockActionType.heading,
  },
  {
    label: 'H5',
    key: HeadingTag.h5,
    actionType: ActionType.Block,
    action: BlockActionType.heading,
  },
  {
    label: 'H6',
    key: HeadingTag.h6,
    actionType: ActionType.Block,
    action: BlockActionType.heading,
  },
  {
    label: 'quote',
    key: BlockActionType.quote,
    actionType: ActionType.Block,
    action: BlockActionType.quote,
  },
  {
    label: 'S',
    key: TextFormatType.bold,
    actionType: ActionType.Inline,
    action: InlineActionType.TextFormat,
  },
  {
    label: 'I',
    key: TextFormatType.italic,
    actionType: ActionType.Inline,
    action: InlineActionType.TextFormat,
  },
  {
    label: 'code',
    key: TextFormatType.code,
    actionType: ActionType.Inline,
    action: InlineActionType.TextFormat,
  },
];

const geSlelectionTopLevelElements = (selection: RangeSelection) => {
  const list: Array<ElementNode> = [];
  selection.getNodes().forEach(item => {
    const topElement = item.getTopLevelElement();
    if ($isElementNode(topElement)) {
      list.push(topElement);
    }
    
  })
  return list;
}


const setBlocks = (selection: RangeSelection, action: BlockAction) => {
  switch (action.type) {
    case BlockActionType.paragraph: {
      $setBlocksType(selection, () => $createParagraphNode());
      break;
    };
    case BlockActionType.heading: {
      $setBlocksType(selection, () => $createHeadingNode(action.tag));
      break;
    };
    case BlockActionType.quote: {
      $setBlocksType(selection, () => $createQuoteNode());
      break;
    };
    case BlockActionType.list: {
      $setBlocksType(selection, () => $createListNode(action.listType));
      break;
    };
  }
}

const isMatchAction = (selection: RangeSelection, action: BlockAction) => {
  const selectionNodes = selection.getNodes();
  for (let i = 0; i < selectionNodes.length; i++) {
    const topElement = selectionNodes[i].getTopLevelElement();
    if (!$isElementNode(topElement)) {
      return true;
    } else if (topElement.getType() !== action.type) {
      return false;
    } else if ($isHeadingNode(topElement) && action.type === 'heading' && topElement.getTag() !== action.tag) {
      return false
    }
  }
  return true;
}


const updateBlock = (editor: LexicalEditor, action: BlockAction) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      if (!isMatchAction(selection, action)) {
        setBlocks(selection, action);
      } else {
        setBlocks(selection, { type: BlockActionType.paragraph });
      }
    }
  });
}

const updateText = (editor: LexicalEditor, action: InlineAction) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const nodes = selection.getNodes();
      console.log(nodes,
        selection.hasFormat('bold'),
        selection.hasFormat('italic'),
        selection.hasFormat('code'),
      );
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, action.formatType as unknown as TextFormatType);
    }
  });
}

const updateTest = (editor: LexicalEditor, action: InlineActionType) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $patchStyleText(selection, {
        'font-size': '16px',
      });
    }
  })
};

const Btn = ({ editor, item }: { editor: LexicalEditor; item: Btn }) => {

  const deal = [

  ]
  const onClick = () => {
    switch (item.actionType) {
      case ActionType.Block: {
        updateBlock(
          editor as LexicalEditor,
          {
            type: item.action,
            tag: item.action === BlockActionType.heading ? item.key : undefined
          } as BlockAction,
        );
        break;
      };
      case ActionType.Inline: {
        updateText(
          editor as LexicalEditor,
          {
            type: item.action,
            formatType: item.key,
          }
        );
        break;
      }
    }
  }

  return <div
    className={$css.btn}
    onClick={onClick}
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
