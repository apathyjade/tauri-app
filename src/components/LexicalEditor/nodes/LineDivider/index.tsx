import { ElementNode, LexicalEditor, LexicalNode } from "lexical";

export class LineDividerNode extends ElementNode {
  static getType() {
    return 'line_divider';
  }
  static clone(node: any) {
    return new LineDividerNode(node.__key);
  }

  createDOM(config: any) {
    const dom = document.createElement('div');
    const className = config.theme;
    dom.className = className;
    return dom;
  }
  updateDOM() {
    return false;
  }
  static importDOM() {
    return {
      div: (node: any) => ({
        conversion: $convertLineDividerElement,
        priority: 0
      })
    } as any;
  }
  exportDOM(editor: LexicalEditor) {
    const {
      element
    } = super.exportDOM(editor);
    return {
      element
    };
  }
  static importJSON(serializedNode: any) {
    return $createLineDividerNode().updateFromJSON(serializedNode);
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
    };
  }
}

export function $convertLineDividerElement() {
  const node = $createLineDividerNode();
  return {
    node
  };
}

export function $createLineDividerNode(): LexicalNode {
  return new LineDividerNode();
}

export function $isLineDividerNode(node: any) {
  return node instanceof LineDividerNode;
}