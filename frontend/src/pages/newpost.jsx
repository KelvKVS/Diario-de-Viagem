import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";

import "./newpost.css";

function NewPost() {
    const editorRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (editorRef.current) return;

        const holder = document.getElementById("editorjs");
        if (!holder) return;

        const editor = new EditorJS({
            holder: "editorjs",
            placeholder: "Comece a escrever sua história...",
            tools: {
                header: {
                    class: Header,
                    config: {
                        placeholder: "Digite um subtítulo",
                        levels: [1, 2, 3],
                        defaultLevel: 1,
                    },
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                },
                image: {
                    class: ImageTool,
                    config: {
                        endpoints: {
                            byFile: '/uploadFile',
                            byUrl: '/fetchUrl',
                        }
                    }
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                    config: {
                        quotePlaceholder: "Digite uma citação",
                        captionPlaceholder: "Digite o autor da citação",
                    },
                },
            },
            onReady: () => setIsLoading(false),
            data: {
                blocks: [
                    {
                        type: "header",
                        data: {
                            text: title,
                            level: 1,
                        },
                    },
                ],
            },
        });

        editorRef.current = editor;

        return () => {
            if (editorRef.current && typeof editorRef.current.destroy === "function") {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, []);

    return (
        <div className="editor-container">
            <div className="editor-glass">
                <div className="editor-toolbar">
                    <input
                        type="text"
                        className="editor-title"
                        placeholder="Título do Artigo"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={() => {
                            if (editorRef.current) {
                                editorRef.current.blocks.clear();
                            }
                        }}
                        disabled={isLoading}
                    />
                </div>

                <div className="editor-content">
                    <div id="editorjs" className="editor-body" />
                </div>

                <div className="editor-footer">
                    <button
                        type="submit"
                        className="publish-button"
                    >
                        <i className="bi bi-upload"></i>
                        Publicar Artigo
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewPost;
