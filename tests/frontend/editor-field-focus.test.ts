import { describe, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import {
    EDITOR_FIELD_HAS_FOCUS_ATTR,
    holdEditorFieldFocusForPointerGesture,
    installEditorSelectionGuard,
    preserveEditorSelection,
    resolveEditorBody,
    restoreEditorFocus,
    setEditorFieldHasFocus,
    shouldPreserveEditorSelection,
    shouldRestoreEditorFocus,
} from '../../src/web/assets/field/src/ts/editor-field-focus';

function makeEditor(): Editor {
    return new Editor({
        extensions: [Document, Paragraph, Text],
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hi' }] }] },
    });
}

function pointerOn(target: EventTarget, bubbles = true): PointerEvent {
    return new PointerEvent('pointerdown', {
        button: 0,
        bubbles,
        cancelable: true,
        composed: true,
    });
}

describe('editor field focus hold', () => {
    it('resolves .vizy-editor-body from a nested editor surface', () => {
        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';
        const surface = document.createElement('div');
        surface.className = 'ProseMirror';
        fieldBody.append(surface);
        document.body.append(fieldBody);

        expect(resolveEditorBody(surface)).toBe(fieldBody);

        fieldBody.remove();
    });

    it('ref-counts data-has-focus so nested holders do not clobber each other', () => {
        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';

        setEditorFieldHasFocus(fieldBody, true);
        expect(fieldBody.hasAttribute(EDITOR_FIELD_HAS_FOCUS_ATTR)).toBe(true);

        setEditorFieldHasFocus(fieldBody, true);
        expect(fieldBody.hasAttribute(EDITOR_FIELD_HAS_FOCUS_ATTR)).toBe(true);

        setEditorFieldHasFocus(fieldBody, false);
        expect(fieldBody.hasAttribute(EDITOR_FIELD_HAS_FOCUS_ATTR)).toBe(true);

        setEditorFieldHasFocus(fieldBody, false);
        expect(fieldBody.hasAttribute(EDITOR_FIELD_HAS_FOCUS_ATTR)).toBe(false);
    });

    it('preserveEditorSelection only preventDefaults (no focus side effects)', () => {
        const event = new MouseEvent('mousedown', { cancelable: true });
        const prevented = vi.fn();
        event.preventDefault = prevented;
        preserveEditorSelection(event);
        expect(prevented).toHaveBeenCalled();
    });

    it('shouldRestoreEditorFocus skips foreign inputs outside the field', () => {
        const editor = makeEditor();
        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';
        fieldBody.append(editor.view.dom);
        document.body.append(fieldBody);

        const foreign = document.createElement('input');
        document.body.append(foreign);
        foreign.focus();

        expect(shouldRestoreEditorFocus(editor)).toBe(false);

        foreign.remove();
        fieldBody.remove();
        editor.destroy();
    });

    it('shouldRestoreEditorFocus allows reclaim when focus is on the toolbar', () => {
        const editor = makeEditor();
        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';
        const trigger = document.createElement('button');
        fieldBody.append(editor.view.dom, trigger);
        document.body.append(fieldBody);
        trigger.focus();

        expect(shouldRestoreEditorFocus(editor)).toBe(true);

        fieldBody.remove();
        editor.destroy();
    });

    it('restoreEditorFocus does not steal focus from a foreign input', async () => {
        const editor = makeEditor();
        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';
        fieldBody.append(editor.view.dom);
        document.body.append(fieldBody);

        const foreign = document.createElement('input');
        document.body.append(foreign);
        foreign.focus();

        restoreEditorFocus(editor);
        await Promise.resolve();
        expect(document.activeElement).toBe(foreign);

        foreign.remove();
        fieldBody.remove();
        editor.destroy();
    });

    it('restoreEditorFocus({ force: true }) claims focus even from a foreign input', async () => {
        const editor = makeEditor();
        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';
        fieldBody.append(editor.view.dom);
        document.body.append(fieldBody);

        const foreign = document.createElement('input');
        document.body.append(foreign);
        foreign.focus();

        restoreEditorFocus(editor, { force: true });
        await Promise.resolve();
        expect(document.activeElement).toBe(editor.view.dom);

        foreign.remove();
        fieldBody.remove();
        editor.destroy();
    });

    it('holdEditorFieldFocusForPointerGesture keeps data-has-focus until pointerup', async () => {
        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';
        document.body.append(fieldBody);

        let ended = false;
        holdEditorFieldFocusForPointerGesture(fieldBody, () => {
            ended = true;
        });
        expect(fieldBody.hasAttribute(EDITOR_FIELD_HAS_FOCUS_ATTR)).toBe(true);

        window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }));
        expect(ended).toBe(true);
        // Hold releases on a trailing microtask so restore can land first.
        expect(fieldBody.hasAttribute(EDITOR_FIELD_HAS_FOCUS_ATTR)).toBe(true);
        await Promise.resolve();
        expect(fieldBody.hasAttribute(EDITOR_FIELD_HAS_FOCUS_ATTR)).toBe(false);

        fieldBody.remove();
    });
});

describe('editor selection guard (permanent select-all policy)', () => {
    it('preserves selection for contenteditable=false controls inside the field', () => {
        const body = document.createElement('div');
        body.className = 'vizy-editor-body';
        const header = document.createElement('header');
        header.contentEditable = 'false';
        body.append(header);
        document.body.append(body);

        const event = pointerOn(header);
        Object.defineProperty(event, 'composedPath', {
            value: () => [header, body, document.body, document],
        });
        expect(shouldPreserveEditorSelection(event)).toBe(true);

        body.remove();
    });

    it('allows default on writing surfaces and text fields', () => {
        const body = document.createElement('div');
        body.className = 'vizy-editor-body';
        const pm = document.createElement('div');
        pm.className = 'ProseMirror';
        pm.contentEditable = 'true';
        const paragraph = document.createElement('p');
        paragraph.textContent = 'Hi';
        pm.append(paragraph);
        const input = document.createElement('input');
        body.append(pm, input);
        document.body.append(body);

        const proseEvent = pointerOn(paragraph);
        Object.defineProperty(proseEvent, 'composedPath', {
            value: () => [paragraph, pm, body, document.body],
        });
        expect(shouldPreserveEditorSelection(proseEvent)).toBe(false);

        const inputEvent = pointerOn(input);
        Object.defineProperty(inputEvent, 'composedPath', {
            value: () => [input, body, document.body],
        });
        expect(shouldPreserveEditorSelection(inputEvent)).toBe(false);

        body.remove();
    });

    it('allows default on the drag handle', () => {
        const body = document.createElement('div');
        body.className = 'vizy-editor-body';
        const handle = document.createElement('button');
        handle.dataset.vizyDragHandle = '';
        body.append(handle);
        document.body.append(body);

        const event = pointerOn(handle);
        Object.defineProperty(event, 'composedPath', {
            value: () => [handle, body, document.body],
        });
        expect(shouldPreserveEditorSelection(event)).toBe(false);

        body.remove();
    });

    it('installEditorSelectionGuard preventDefaults control presses at the field root', () => {
        const body = document.createElement('div');
        body.className = 'vizy-editor-body';
        const header = document.createElement('header');
        header.contentEditable = 'false';
        body.append(header);
        document.body.append(body);

        const dispose = installEditorSelectionGuard(body);
        const event = new PointerEvent('pointerdown', {
            button: 0,
            bubbles: true,
            cancelable: true,
            composed: true,
        });
        header.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);

        dispose();
        body.remove();
    });
});
