import { Klass, LexicalNode } from 'lexical';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { MarkNode } from '@lexical/mark';
import { OverflowNode } from '@lexical/overflow';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';

const EditorNodes: Array<Klass<LexicalNode>> = [
  HeadingNode,
  CodeNode,
  CodeHighlightNode,
  HashtagNode,
  AutoLinkNode,
  LinkNode,
  ListItemNode,
  ListNode,
  MarkNode,
  OverflowNode,
  HorizontalRuleNode,
  QuoteNode,
  TableCellNode,
  TableNode,
  TableRowNode,
];

export default EditorNodes;
