"use client";

import { useTheme } from "next-themes";
import {
  BlockNoteEditor,
  PartialBlock
} from "@blocknote/core";
import {
  BlockNoteViewRaw,
  useCreateBlockNote
} from "@blocknote/react";
import "@blocknote/core/style.css";

import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

const Editor = ({
  onChange,
  initialContent,
  editable
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ 
      file
    });

    return response.url;
  }

  interface EditorConfig {
    editable?: boolean;
    initialContent?: PartialBlock[];
    onEditorContentChange: (editor: BlockNoteEditor) => void;
    uploadFile: (file: File) => Promise<string>;
  }

  const editor: BlockNoteEditor = useCreateBlockNote({
    editable,
    initialContent: 
      initialContent 
      ? JSON.parse(initialContent) as PartialBlock[] 
      : undefined,
    onEditorContentChange: (editor: BlockNoteEditor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: handleUpload as EditorConfig["uploadFile"]
  });

  return (
    <div>
      <BlockNoteViewRaw
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  )
}

export default Editor;
