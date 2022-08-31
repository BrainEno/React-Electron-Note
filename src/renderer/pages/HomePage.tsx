/* eslint-disable no-nested-ternary */
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { $createHeadingNode } from '@lexical/rich-text';
import { $createTextNode, $getRoot } from 'lexical';
import { SettingsContext, useSettings } from '../context/SettingsContext';
import Editor from '../components/editor/Editor';
import EditorNodes from '../components/nodes/EditorNodes';
import EditorTheme from '../themes/EditorTheme';
import { SharedHistoryContext } from '../context/SharedHistoryContext';
import TypingPerPlugin from '../components/plugins/TypingPerfPlugin';

function prepopulatedRichText() {
  const root = $getRoot();
  if (root.getFirstChild() === null) {
    const heading = $createHeadingNode('h1');
    heading.append($createTextNode('Hello World'));
    root.append(heading);
  }
}

const Home = () => {
  const {
    settings: { isCollab, emptyEditor, measureTypingPerf },
  } = useSettings();

  const initialConfig = {
    editorState: isCollab
      ? null
      : emptyEditor
      ? undefined
      : prepopulatedRichText,
    namespace: 'DiffEditor',
    nodes: [...EditorNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: EditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <div className="editor-shell">
          <Editor />
        </div>
        {measureTypingPerf ? <TypingPerPlugin /> : null}
      </SharedHistoryContext>
    </LexicalComposer>
  );
};

const HomePage = () => (
  <SettingsContext>
    <Home />
  </SettingsContext>
);

export default HomePage;
