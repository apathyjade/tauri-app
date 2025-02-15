
import classNames from 'classnames';
import { useCallback } from 'react';
import { LexicalEditor } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  useEditorContext,
  actionMap,
  ToolbarItem,
} from '../../context/EditorContext';
import $css from './index.module.scss';

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
  const { toolbarState, toolbarActions } = useEditorContext();

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
