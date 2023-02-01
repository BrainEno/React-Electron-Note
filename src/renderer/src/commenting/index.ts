/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
import type { LexicalEditor } from 'lexical';
import {
  Array as YArray,
  Map as YMap,
  Transaction,
  YArrayEvent,
  YEvent,
} from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export type Comment = {
  author: string;
  content: string;
  id: string;
  timeStamp: number;
  type: 'comment';
};

export type Thread = {
  comments: Array<Comment>;
  id: string;
  quote: string;
  type: 'thread';
};

export type Comments = Array<Thread | Comment>;

function createUID(): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(0, 5);
}

export function createComment(
  content: string,
  author: string,
  id?: string,
  timeStamp?: number
): Comment {
  return {
    author,
    content,
    id: id === undefined ? createUID() : id,
    timeStamp: timeStamp === undefined ? performance.now() : timeStamp,
    type: 'comment',
  };
}

export function createThread(
  quote: string,
  comments: Array<Comment>,
  id?: string
): Thread {
  return {
    comments,
    id: id === undefined ? createUID() : id,
    quote,
    type: 'thread',
  };
}

function cloneThread(thread: Thread): Thread {
  return {
    comments: Array.from(thread.comments),
    id: thread.id,
    quote: thread.quote,
    type: 'thread',
  };
}

function triggerOnChange(commentStore: CommentStore): void {
  const listeners = commentStore._changeListeners;
  for (const listener of listeners) {
    listener();
  }
}

export class CommentStore {
  _editor: LexicalEditor;

  _comments: Comments;

  _changeListeners: Set<() => void>;

  _collabProvider: null | WebsocketProvider;

  constructor(editor: LexicalEditor) {
    this._comments = [];
    this._editor = editor;
    this._collabProvider = null;
    this._changeListeners = new Set();
  }

  isCollaborative(): boolean {
    return this._collabProvider !== null;
  }

  getComments(): Comments {
    return this._comments;
  }

  addComment(
    commentOrThread: Comment | Thread,
    thread?: Thread,
    offset?: number
  ): void {
    const nextComments = Array.from(this._comments);

    const shardCommentsArray: YArray<any> | null = this._getCollabComments();

    if (thread !== undefined && commentOrThread.type === 'comment') {
      for (let i = 0; i < nextComments.length; i++) {
        const comment = nextComments[i];
      }
    }
  }

  _getCollabComments(): null | YArray<any> {
    const provider = this._collabProvider;
    if (provider !== null) {
      const { doc } = provider;
      return doc.get('comments', YArray) as YArray<any>;
    }
    return null;
  }
}
