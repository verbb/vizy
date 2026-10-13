import { rewriteCraftSerializedForm } from './serialize-form-capture';

type FormSerializer = () => string;

type CraftFormQuery = {
    data(key: string): unknown;
    data(key: string, value: unknown): unknown;
    removeData?(key: string): unknown;
    serialize(): string;
};

export type VizyFormSerializerParticipant = {
    fieldName: string;
    /** Canonical value captured before the author can interact with the editor. */
    initialCanonical: string;
    /** Flush the live editor into the same canonical wire format. */
    serialize(): string;
};

type FormState = {
    form: HTMLFormElement;
    $form: CraftFormQuery;
    participants: Map<symbol, VizyFormSerializerParticipant>;
    wrapper: FormSerializer | null;
    delegate?: FormSerializer;
    watchInterval: number | null;
};

const states = new WeakMap<HTMLFormElement, FormState>();
const SERIALIZER_DATA_KEY = 'vizySerializerWrap';
const HOST_SERIALIZER_TIMEOUT_MS = 10_000;

function rewriteParticipants(
    serialized: string,
    participants: Iterable<VizyFormSerializerParticipant>,
): string {
    let rewritten = serialized;
    for (const participant of participants) {
        rewritten = rewriteCraftSerializedForm(rewritten, {
            fieldName: participant.fieldName,
            canonical: participant.serialize(),
        });
    }
    return rewritten;
}

function installSerializer(state: FormState, delegate?: FormSerializer): void {
    const wrapper = () => rewriteParticipants(
        delegate ? delegate() : state.$form.serialize(),
        state.participants.values(),
    );
    state.delegate = delegate;
    state.wrapper = wrapper;
    state.$form.data('serializer', wrapper);
    state.$form.data(SERIALIZER_DATA_KEY, wrapper);
}

function watchForHostSerializer(state: FormState): void {
    if (state.watchInterval !== null) return;
    const startedAt = Date.now();
    state.watchInterval = window.setInterval(() => {
        const current = state.$form.data('serializer');
        if (typeof current === 'function' && current !== state.wrapper) {
            installSerializer(state, current as FormSerializer);
            window.clearInterval(state.watchInterval!);
            state.watchInterval = null;
            return;
        }
        if (!state.form.isConnected || Date.now() - startedAt >= HOST_SERIALIZER_TIMEOUT_MS) {
            window.clearInterval(state.watchInterval!);
            state.watchInterval = null;
        }
    }, 50);
}

/**
 * Keep Vizy canonical values in Craft's whole-form comparisons.
 *
 * Global Set forms do not receive an ElementEditor, so their dirty/unload checks use
 * the form serializer directly. Vizy upgrades after Craft has captured its baseline
 * and adds transport-only document attributes plus mounted `vizyHost` inputs. Adopt
 * only Vizy's loaded value into that existing snapshot; rebuilding the snapshot from
 * the live form would incorrectly accept unrelated edits made while Vizy was loading.
 */
export function registerVizyFormSerializer(
    form: HTMLFormElement,
    participant: VizyFormSerializerParticipant,
): () => void {
    const $form = window.$?.(form) as CraftFormQuery | undefined;
    if (!$form || typeof $form.serialize !== 'function') return () => undefined;
    // ElementEditor has its own serializeForm event and baseline adoption below.
    // This fallback exists for Global Sets and other whole-form Craft screens.
    if ($form.data('elementEditor')) return () => undefined;

    let state = states.get(form);
    if (!state) {
        state = {
            form,
            $form,
            participants: new Map(),
            wrapper: null,
            delegate: undefined,
            watchInterval: null,
        };
        states.set(form, state);
    }

    const key = Symbol(participant.fieldName);
    state.participants.set(key, participant);

    const initial = $form.data('initialSerializedValue');
    if (typeof initial === 'string') {
        $form.data('initialSerializedValue', rewriteCraftSerializedForm(initial, {
            fieldName: participant.fieldName,
            canonical: participant.initialCanonical,
        }));
    }

    const active = $form.data('serializer');
    if (typeof active !== 'function' || active !== state.wrapper) {
        const delegate = typeof active === 'function' ? active as FormSerializer : undefined;
        installSerializer(state, delegate);
        // A Global Set begins without a host serializer. Keep watching briefly so a
        // later field plugin can replace it and still be composed into Vizy's wrapper.
        if (!delegate) watchForHostSerializer(state);
    }

    let disposed = false;
    return () => {
        if (disposed || !state) return;
        disposed = true;
        state.participants.delete(key);
        if (state.participants.size !== 0) return;
        if (state.watchInterval !== null) window.clearInterval(state.watchInterval);
        state.watchInterval = null;

        if ($form.data('serializer') === state.wrapper) {
            if (state.delegate) {
                $form.data('serializer', state.delegate);
            } else if ($form.removeData) {
                $form.removeData('serializer');
            } else {
                $form.data('serializer', null);
            }
        }
        if ($form.data(SERIALIZER_DATA_KEY) === state.wrapper) {
            $form.removeData?.(SERIALIZER_DATA_KEY);
        }
        states.delete(form);
    };
}
