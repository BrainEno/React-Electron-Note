/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { $getRoot, $getSelection, EditorState } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useRef, useState } from 'react';
import CustomAutoFocusPlugin from './CustomAutoFocusPlugin';
import TextInput from './TextInput';
import Placeholder from './Placeholder';

import { MaxLengthPlugin } from '../plugins/MaxLengthPulgin';
import ToolbarPlugin from '../plugins/ToolbarPlugin';
import { useSettings } from '../context/SettingsContext';
import { useSharedHistoryContext } from '../context/SharedHistoryContext';
import ImagesPlugin from '../plugins/ImagesPlugin';
import { createWebsocketProvider } from '../collaboration';
import theme from '../themes/EditorTheme';
import TableCellNodes from '../nodes/TableCellNodes';
import ContentEditable from './ContentEditable';

const skipCollaborationInit =
  // @ts-ignore
  window.parent != null && window.parent.frames.right === window;

function Editor(): JSX.Element {
  const { historyState } = useSharedHistoryContext();
  const {
    settings: {
      isCollab,
      isAutocomplete,
      isMaxLength,
      isCharLimit,
      isCharLimitUtf8,
      isRichText,
      showTreeView,
      showTableOfContents,
    },
  } = useSettings();

  const text = isCollab
    ? '输入共享的内容...'
    : isRichText
    ? '输入富文本...'
    : '输入纯文本...';
  const placeholder = <Placeholder>{text}</Placeholder>;
  const scrollRef = useRef(null);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const cellEditorConfig = {
    namespace: 'Editor',
    nodes: [...TableCellNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme,
  };

  return (
    <>
      {isRichText && <ToolbarPlugin />}
      <div
        className={`editor-container ${showTreeView ? 'tree-view' : ''} ${
          !isRichText ? 'plain-text' : ''
        }`}
        ref={scrollRef}
      >
        {isMaxLength && <MaxLengthPlugin maxLength={30} />}
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        <HashtagPlugin />
        {isRichText ? (
          <>
            {isCollab ? (
              <CollaborationPlugin
                id="main"
                providerFactory={createWebsocketProvider}
                shouldBootstrap={!skipCollaborationInit}
              />
            ) : (
              <HistoryPlugin externalHistoryState={historyState} />
            )}
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div className="editor" ref={onRef}>
                    <ContentEditable />
                  </div>
                </div>
              }
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <ImagesPlugin />
            <LinkPlugin />
          </>
        ) : (
          <>
            <PlainTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin externalHistoryState={historyState} />
          </>
        )}
        {isCharLimit ||
          (isCharLimitUtf8 && (
            <CharacterLimitPlugin
              charset={isCharLimit ? 'UTF-16' : 'UTF-8'}
              maxLength={5}
            />
          ))}
      </div>
    </>
  );
}

export default Editor;
