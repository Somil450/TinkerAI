import { EditorView, basicSetup } from "codemirror"
import { cpp } from "@codemirror/lang-cpp"
import { oneDark } from "@codemirror/theme-one-dark"

let editor = null;

export function initCodeEditor(containerId) {
    const parent = document.getElementById(containerId);
    if (!parent) return null;

    const defaultCode = `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}
`;

    editor = new EditorView({
        doc: defaultCode,
        extensions: [
            basicSetup,
            cpp(),
            oneDark
        ],
        parent: parent
    });

    return editor;
}

export function getCode() {
    if (!editor) return "";
    return editor.state.doc.toString();
}

export function setCode(code) {
    if (!editor) return;
    editor.dispatch({
        changes: { from: 0, to: editor.state.doc.length, insert: code }
    });
}

export function setCompilerStatus(status, isError = false) {
    const statusPanel = document.getElementById('compiler-output');
    if (statusPanel) {
        statusPanel.innerText = status;
        statusPanel.style.color = isError ? '#ff4d4d' : '#00ff88';
    }
}

export function setEditorDisabled(disabled) {
    const container = document.getElementById('editor-container');
    if (container) {
        // Keep pointer-events active so the user can scroll and select text!
        container.style.opacity = disabled ? '0.8' : '1';
        
        // Prevent actual typing by setting contenteditable on CodeMirror
        const cmContent = container.querySelector('.cm-content');
        if (cmContent) {
            cmContent.setAttribute('contenteditable', disabled ? 'false' : 'true');
        }
    }
}
