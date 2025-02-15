
import { $getSelection, $isRangeSelection, LexicalEditor } from 'lexical';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  faBold, faItalic, faStrikethrough, faQuoteLeft, faMinus,
  faCode, faLink, faImage, faTable, faListOl, faListUl, faMaximize, faMinimize,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { BlockAction, BlockActionType, HeadingTag, InlineActionType, ListType, TextFormatType, updateBlock, updateText, uploadImg } from '../utils';
import { getSelectedNode } from '../utils/getSelectedNode';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';

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

type ContextShape = {
  isFull: boolean;
  setFull: (val: boolean) => void;
  isLinkEditMode: boolean;
  setIsLinkEditMode: (val: boolean) => void;
  toolbarActions: ToolbarItem[];
  toolbarState: ToolbarState;
  floatingAnchorElem: HTMLDivElement | null,
  setFloatingAnchorElem: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
  updateToolbarState: <Key extends ToolbarStateKey>(
    key: Key,
    value: ToolbarStateValue<Key>,
  ) => void;
};

const Context = createContext<ContextShape>(null as any);


export const actionMap = new Map();

const registerAction = (contextRef: React.MutableRefObject<ContextShape>) => {
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

  actionMap.set(InlineActionType.Link, (editor: LexicalEditor) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection);
        const parent = node.getParent();
        if (!($isLinkNode(parent) || $isLinkNode(node))) {
          contextRef.current.setIsLinkEditMode(true);
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
          console.log('isLinkNode')
        } else {
          contextRef.current.setIsLinkEditMode(false);
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        }
      }
    });
  });
}
const useRegisterAction = (context: ContextShape) => {
  const centextRef = useRef(context);
  centextRef.current = context;
  useState(() => registerAction(centextRef))
}

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
    key: TextFormatType.code,
    actionType: InlineActionType.TextFormat,
  },

  {
    label: '添加链接',
    icon: faLink,
    key: 'link',
    actionType: InlineActionType.Link,
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


export const EditorContext = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  
  const [isFull, setFull] = useState(false);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
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
      floatingAnchorElem,
      setFloatingAnchorElem,
      isLinkEditMode,
      setIsLinkEditMode,
    };
  }, [
    toolbarState,
    updateToolbarState,
    isFull,
    setFull,
    floatingAnchorElem,
    setFloatingAnchorElem,
    isLinkEditMode,
    setIsLinkEditMode,
  ]);

  useRegisterAction(contextValue);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useEditorContext = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useEditorContext must be used within a ToolbarProvider');
  }

  return context;
};
