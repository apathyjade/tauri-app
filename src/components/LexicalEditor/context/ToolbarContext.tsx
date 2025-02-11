
import { $createHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, LexicalEditor } from 'lexical';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  faBold, faItalic, faStrikethrough, faQuoteLeft, faMinus,
  faCode, faLink, faImage, faTable, faListOl, faListUl, faMaximize, faMinimize,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { BlockAction, BlockActionType, HeadingTag, InlineActionType, ListType, TextFormatType, updateBlock, updateText, uploadImg } from '../utils';

export enum ActionTypeEnum {
  maximize = 'maximize',
  minimize = 'minimize',
  block = 'block',
  BlockActionType = 'BlockActionType',
  FORMAT_TEXT_COMMAND = 'FORMAT_TEXT_COMMAND',
}
export interface ToolbarItem {
  label: string;
  key: string | HeadingTag | TextFormatType;
  icon?: IconDefinition;
  tip?: string;
  actionType: ActionTypeEnum | BlockActionType | InlineActionType;
  actionParams?: { tag: HeadingTag } | { rows: number; columns: number };
}

export const actionMap = new Map();
actionMap.set(BlockActionType.heading, (editor: LexicalEditor, item: ToolbarItem) => {
  updateBlock(editor, {
    type: item.actionType,
    params: item.actionParams,
  } as BlockAction);
});
actionMap.set(BlockActionType.image, (editor: LexicalEditor, item: ToolbarItem) => {
  uploadImg().then((data) => {
    updateBlock(editor, {
      type: item.actionType,
      params: {
        params: false,
        width: 240,
        src: data,
      },
    } as BlockAction);
  });
});

actionMap.set(BlockActionType.table, (editor: LexicalEditor, item: ToolbarItem) => {
  updateBlock(editor, {
    type: item.actionType,
    params: item.actionParams,
  } as BlockAction);
});
actionMap.set(BlockActionType.list, (editor: LexicalEditor, item: ToolbarItem) => {
  updateBlock(editor, {
    type: item.actionType,
    params: { listType: item.key },
  } as BlockAction);
});

actionMap.set(BlockActionType.quote, (editor: LexicalEditor, item: ToolbarItem) => {
  updateBlock(editor, {
    type: item.actionType,
  } as BlockAction);
});
actionMap.set(BlockActionType.code, (editor: LexicalEditor, item: ToolbarItem) => {
  updateBlock(editor, {
    type: item.actionType,
  } as BlockAction);
});

actionMap.set(BlockActionType.line_divider, (editor: LexicalEditor, item: ToolbarItem) => {
  updateBlock(editor, {
    type: item.actionType,
  } as BlockAction);
});


actionMap.set(InlineActionType.TextFormat, (editor: LexicalEditor, item: ToolbarItem) => {
  updateText(editor, {
    type: InlineActionType.TextFormat,
    formatType: item.key as TextFormatType,
  });
});

actionMap.set(ActionTypeEnum.FORMAT_TEXT_COMMAND, (editor: LexicalEditor, formatType: TextFormatType) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // 直接切换格式（支持多格式共存）
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
    }
  });
});

const toolbarActions: ToolbarItem[] = [
  {
    label: 'S',
    tip: '加粗',
    key: TextFormatType.bold,
    icon: faBold,
    actionType: InlineActionType.TextFormat,
  },
  {
    label: 'I',
    key: TextFormatType.italic,
    icon: faItalic,
    tip: '斜体',
    actionType: InlineActionType.TextFormat,
  },
  {
    label: '删除线',
    key: TextFormatType.strikethrough,
    icon: faStrikethrough,
    tip: '删除线',
    actionType: InlineActionType.TextFormat,
  },
  {
    label: 'H1',
    key: HeadingTag.h1,
    actionType: BlockActionType.heading,
    actionParams: { tag: HeadingTag.h1 },
  },
  {
    label: 'H2',
    key: HeadingTag.h2,
    actionType: BlockActionType.heading,
    actionParams: { tag: HeadingTag.h2 },
  },
  {
    label: 'H3',
    key: HeadingTag.h3,
    actionType: BlockActionType.heading,
    actionParams: { tag: HeadingTag.h3 },
  },
  {
    label: 'H4',
    key: HeadingTag.h4,
    actionType: BlockActionType.heading,
    actionParams: { tag: HeadingTag.h4 },
  },
  {
    label: 'H5',
    key: HeadingTag.h5,
    actionType: BlockActionType.heading,
    actionParams: { tag: HeadingTag.h5 },
  },
  {
    label: 'H6',
    key: HeadingTag.h6,
    actionType: BlockActionType.heading,
    actionParams: { tag: HeadingTag.h6 },
  },

  {
    label: '一',
    key: 'line',
    icon: faMinus,
    tip: '分割线',
    actionType: BlockActionType.line_divider,
  },
  {
    label: '引用',
    icon: faQuoteLeft,
    key: 'quote',
    actionType: BlockActionType.quote,
  },

  {
    label: '代码段',
    icon: faCode,
    key: BlockActionType.code,
    actionType: BlockActionType.code,
  },

  {
    label: '添加链接',
    icon: faLink,
    key: 'link',
    actionType: ActionTypeEnum.FORMAT_TEXT_COMMAND,
  },
  {
    label: '上传图片',
    icon: faImage,
    key: 'image',
    actionType: BlockActionType.image,
  },
  {
    label: '表格',
    icon: faTable,
    key: 'table',
    actionType: BlockActionType.table,
    actionParams: { columns: 5, rows: 3 },
  },
  {
    label: '有序列表',
    icon: faListOl,
    key: ListType.number,
    actionType: BlockActionType.list,
  },
  {
    label: '无序列表',
    icon: faListUl,
    key: ListType.bullet,
    actionType: BlockActionType.list,
  },
  {
    label: '全屏',
    icon: faMaximize,
    key: ActionTypeEnum.maximize,
    actionType: ActionTypeEnum.maximize,
  },
  {
    label: '还原',
    icon: faMinimize,
    key: ActionTypeEnum.minimize,
    actionType: ActionTypeEnum.minimize,
  },
];

const INITIAL_TOOLBAR_STATE = {
  h1: false,
  h2: false,
  h3: false,
  h4: false,
  h5: false,
  h6: false,
  bold: false,
  italic: false,
  strikethrough: false,
};

type ToolbarState = typeof INITIAL_TOOLBAR_STATE;

// Utility type to get keys and infer value types
type ToolbarStateKey = keyof ToolbarState;
type ToolbarStateValue<Key extends ToolbarStateKey> = ToolbarState[Key];

type ContextShape = {
  isFull: boolean;
  setFull: (val: boolean) => void;
  toolbarActions: ToolbarItem[];
  toolbarState: ToolbarState;
  updateToolbarState: <Key extends ToolbarStateKey>(
    key: Key,
    value: ToolbarStateValue<Key>,
  ) => void;
};

const Context = createContext<ContextShape | undefined>(undefined);

export const ToolbarContext = ({
  children,
  isFull,
  setFull,
}: {
  children: ReactNode;
  isFull: boolean;
  setFull: (v: boolean) => void;
}): JSX.Element => {
  const [toolbarState, setToolbarState] = useState(INITIAL_TOOLBAR_STATE);

  const updateToolbarState = useCallback(
    <Key extends ToolbarStateKey>(key: Key, value: ToolbarStateValue<Key>) => {
      setToolbarState((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  useEffect(() => {
    actionMap.set(ActionTypeEnum.maximize, () => {
      setFull(true);
    });
    actionMap.set(ActionTypeEnum.minimize, () => {
      setFull(false);
    });
  }, []);


  const contextValue = useMemo(() => {
    return {
      toolbarActions: toolbarActions.filter(it => {
        if (isFull && it.key === ActionTypeEnum.maximize) {
          return false;
        }
        if (!isFull && it.key === ActionTypeEnum.minimize) {
          return false;
        }
        return true;
      }),
      toolbarState,
      updateToolbarState,
      isFull,
      setFull,
    };
  }, [isFull, toolbarState, updateToolbarState]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useToolbarState = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useToolbarState must be used within a ToolbarProvider');
  }

  return context;
};
