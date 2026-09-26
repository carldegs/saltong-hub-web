"use client";

import { Editor } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";

import { PlayGamesNode, prepareArticleMarkdown } from "./play-games-node";

const editorExtensions = [
  StarterKit.configure({ link: false }),
  Link.configure({ openOnClick: false }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
  PlayGamesNode,
  Markdown,
];

export function createArticleEditor(content: string) {
  return new Editor({
    extensions: editorExtensions,
    content: prepareArticleMarkdown(content),
  });
}

export function ArticleEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (markdown: string) => void;
}) {
  const editor = useEditor({
    extensions: editorExtensions,
    content: prepareArticleMarkdown(value),
    onUpdate: ({ editor: nextEditor }) => {
      onChange(nextEditor.getMarkdown());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="rounded-md border">
      <div className="text-muted-foreground border-b p-2 text-sm">
        Markdown editor — headings, lists, links, checklists, and tables are
        supported.
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4" />
    </div>
  );
}
