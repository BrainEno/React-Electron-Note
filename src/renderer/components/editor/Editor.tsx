/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
import './Editor.css';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { AutoScrollPlugin } from '@lexical/react/LexicalAutoScrollPlugin';
import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
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
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useRef, useState } from 'react';
import CustomAutoFocusPlugin from './CustomAutoFocusPlugin';
import TextInput from './TextInput';
import { useSharedHistoryContext } from '../../context/SharedHistoryContext';
import { useSettings } from '../../context/SettingsContext';
import Placeholder from './Placeholder';

import { MaxLengthPlugin } from '../plugins/MaxLengthPulgin';
import ToolbarPlugin from '../plugins/ToolbarPlugin';

function onChange(editorState: EditorState) {
  editorState.read(() => {
    const root = $getRoot();
    const selection = $getSelection();
    console.log('root', root);
    console.log('selection', selection);
  });
}

function onError(error: unknown) {
  console.error(error);
}

const Editor = (): JSX.Element => {
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
        <AutoScrollPlugin scrollRef={scrollRef} />
        {isRichText ? (
          <>
            {isCollab ? (
              <div />
            ) : (
              <HistoryPlugin externalHistoryState={historyState} />
            )}
          </>
        ) : (
          <>
            <PlainTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={placeholder}
              initialEditorState={isCollab ? null : undefined}
            />
            <HistoryPlugin externalHistoryState={historyState} />
          </>
        )}
        {isCharLimit ||
          (isCharLimitUtf8 && (
            <CharacterLimitPlugin charset={isCharLimit ? 'UTF-16' : 'UTF-8'} />
          ))}
      </div>
    </>
  );
};

export default Editor;
