
import { $createParagraphNode, $getSelection, $isRangeSelection, LexicalEditor, FORMAT_TEXT_COMMAND, RangeSelection, $isElementNode, BaseSelection, $insertNodes } from 'lexical';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';

import { $patchStyleText, $setBlocksType } from '@lexical/selection';
import { $createListNode, $isListNode } from '@lexical/list';
import { $createTableNodeWithDimensions } from '@lexical/table';
import {INSERT_HORIZONTAL_RULE_COMMAND} from '@lexical/react/LexicalHorizontalRuleNode';
import { $createImageNode } from '../nodes/ImgNode/ImageNode';

import { service } from '@/helper';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { $createCodeNode } from '@lexical/code';

export const uploadImage = data => service.post('/upload/image', data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});


export enum ActionType { Block, Inline, Style }

export enum BlockActionType {
  paragraph = 'paragraph',
  heading = 'heading',
  quote = 'quote',
  list = 'list',
  image = 'image',
  line_divider = 'line_divider',
  table = 'table',
  code = 'code',
}

export enum InlineActionType {
  TextFormat = 'text-format',
  Link='link',
}

export enum HeadingTag {
  h1 = 'h1',
  h2 = 'h2',
  h3 = 'h3',
  h4 = 'h4',
  h5 = 'h5',
  h6 = 'h6',
}
export enum ListType {
  number = 'number',
  bullet = 'bullet',
  check = 'check',
}

export enum TextFormatType {
  bold = 'bold', italic = 'italic', strikethrough = 'strikethrough', underline = 'underline', code = 'code',
}

export type BlockAction = {
    type: BlockActionType.paragraph;
  } 
  | {
    type: BlockActionType.heading;
    params: {
      tag: HeadingTag;
    };
  } 
  | {
    type: BlockActionType.quote;
  } 
  | {
    type: BlockActionType.code;
  } 
  | {
    type: BlockActionType.list;
    params: {
      listType: ListType;
    };
  } 
  | {
    type: BlockActionType.image;
    params: {
      src: string;
      altText: string;
      maxWidth: number;
      width?: number;
      height?: number;
      key?: string;
    };
  } 
  | {
    type: BlockActionType.line_divider;
  } 
  | { type: BlockActionType.table; params: { columns: number; rows: number } };

export type InlineAction = {
  type: InlineActionType.TextFormat;
  formatType: TextFormatType;
};

export type Btn = {
  label: string;
  key: string;
  actionType: ActionType.Block;
  action: BlockActionType;
} | {
  label: string;
  key: TextFormatType;
  actionType: ActionType.Inline;
  action: InlineActionType;
};

const setBlocks = (editor: LexicalEditor, selection: BaseSelection, action: BlockAction) => {
  switch (action.type) {
    case BlockActionType.paragraph: {
      $setBlocksType(selection, () => $createParagraphNode());
      break;
    }
    case BlockActionType.heading: {
      $setBlocksType(selection, () => $createHeadingNode(action.params.tag));
      break;
    }
    case BlockActionType.quote: {
      $setBlocksType(selection, () => $createQuoteNode());
      break;
    }
    case BlockActionType.list: {
      $setBlocksType(selection, () => $createListNode(action.params.listType));
      break;
    }
    case BlockActionType.code: {
      $setBlocksType(selection, () => $createCodeNode('markdown'));
      break;
    }
    case BlockActionType.image: {
      $insertNodes([$createImageNode(action.params)]);
      break;
    }
    case BlockActionType.line_divider: {
      editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
      break;
    }
    case BlockActionType.table: {
      $insertNodeToNearestRoot(
       ($createTableNodeWithDimensions(action.params.rows, action.params.columns, true)) as unknown as any,
      );
      break;
    }
  }
};

const isMatchAction = (selection: RangeSelection, action: BlockAction) => {
  const selectionNodes = selection.getNodes();
  for (let i = 0; i < selectionNodes.length; i++) {
    const topElement = selectionNodes[i].getTopLevelElement();
    if (!$isElementNode(topElement)) {
      return true;
    } else if (topElement.getType() !== action.type) {
      return false;
    } else if ($isHeadingNode(topElement) && action.type === 'heading' && topElement.getTag() !== action.params?.tag) {
      return false;
    } else if ($isListNode(topElement) && action.type === BlockActionType.list && topElement.getListType() !== action.params?.listType) {
      return false;
    }
  }
  return true;
};

export const updateBlock = (editor: LexicalEditor, action: BlockAction) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      if (!isMatchAction(selection, action)) {
        setBlocks(editor, selection, action);
      } else {
        setBlocks(editor, selection, { type: BlockActionType.paragraph });
      }
    }
  });
};

export const updateText = (editor: LexicalEditor, action: InlineAction) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, action.formatType as unknown as TextFormatType);
    }
  });
};

export const updateStyle = (editor: LexicalEditor, style: InlineActionType) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $patchStyleText(selection, style);
    }
  });
};

export const uploadImg = () => {
  return new Promise((resolve, reject) => {
    const inputDom = document.createElement('input');
    inputDom.type = 'file';
    inputDom.accept = 'image/jpg,image/jpeg,image/png,image/gif';
    inputDom.onchange = async () => {
      const file = inputDom.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      uploadImage(formData).then((res) => {
        if (res.code === 0) {
          return resolve(res.data);
        }
        return res.massage;
      }, reject);
    };
    inputDom.click();
  });
};
