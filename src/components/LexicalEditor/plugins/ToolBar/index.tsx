
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import classNames from 'classnames';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  useToolbarState,
  actionMap,
  ToolbarItem,
} from '../../context/ToolbarContext';
import $css from './index.module.scss';
import { $setBlocksType } from '@lexical/selection';
import { $createParagraphNode, $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, LexicalEditor, TextFormatType } from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { useCallback } from 'react';
import { $createLineDividerNode } from '../../nodes/LineDivider';
import { $insertNodeToNearestRoot } from '@lexical/utils';


function ToolbarActionItem({ editor, item, children }: { editor: LexicalEditor; item: ToolbarItem; children: React.ReactNode }) {
  const onClick = useCallback(() => {
    const action = actionMap.get(item.actionType);
    action?.(editor, item);
  }, [editor]);

  return (<span
    className={classNames($css.icon, $css[item.key])}
    onClick={onClick}
  >
    {children}
  </span>);
}

// 操作栏组件
function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const { toolbarState, toolbarActions } = useToolbarState();

  return (
    <div className={classNames($css.container)}>
      {
        toolbarActions.map(item => (
          <ToolbarActionItem editor={editor} item={item} key={item.key}>
            { item.icon ? <FontAwesomeIcon icon={item.icon} strokeWidth={1} size="sm" /> : item.label}
          </ToolbarActionItem>
        ))
      }
    </div>
  );
}

export default Toolbar;
