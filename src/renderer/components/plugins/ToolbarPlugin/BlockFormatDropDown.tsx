import {
  LexicalEditor,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from 'lexical';
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $selectAll,
  $wrapLeafNodesInElements,
} from '@lexical/selection';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text';
import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import DropDown, { DropDownItem } from '../../DropDown';

export const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};
const dropDownActiveClass = (active: boolean) =>
  active ? 'active dropdown-item-active' : '';

export const BlockFormatDropdown = ({
  editor,
  blockType,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  editor: LexicalEditor;
}): JSX.Element => {
  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () =>
            $createHeadingNode(headingSize)
          );
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          if (selection.isCollapsed()) {
            $wrapLeafNodesInElements(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  return (
    <DropDown
      buttonClassName="toolbar-item block-controls"
      buttonIconClassName={`icon block-type ${blockType}`}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel="????????????"
    >
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'paragraph')}`}
        onClick={formatParagraph}
      >
        <i className="icon paragraph" />
        <span className="text">??????</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'h1')}`}
        onClick={() => formatHeading('h1')}
      >
        <i className="icon h1" />
        <span className="text">Heading 1</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'h2')}`}
        onClick={() => formatHeading('h2')}
      >
        <i className="icon h2" />
        <span className="text">Heading 2</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'h3')}`}
        onClick={() => formatHeading('h3')}
      >
        <i className="icon h3" />
        <span className="text">Heading 3</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'bullet')}`}
        onClick={formatBulletList}
      >
        <i className="icon bullet-list" />
        <span className="text">????????????</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'number')}`}
        onClick={formatNumberedList}
      >
        <i className="icon numbered-list" />
        <span className="text">????????????</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'check')}`}
        onClick={formatCheckList}
      >
        <i className="icon check-list" />
        <span className="text">????????????</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'quote')}`}
        onClick={formatQuote}
      >
        <i className="icon quote" />
        <span className="text">??????</span>
      </DropDownItem>
      <DropDownItem
        className={`item ${dropDownActiveClass(blockType === 'code')}`}
        onClick={formatCode}
      >
        <i className="icon code" />
        <span className="text">??????</span>
      </DropDownItem>
    </DropDown>
  );
};
