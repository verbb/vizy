// CSS needs to be imported here as it's treated as a module
import '@/scss/style.scss';

// Accept HMR as per: https://vitejs.dev/guide/api-hmr.html
if (import.meta.hot) {
    import.meta.hot.accept();
}

//
// Start Vue Apps
//

if (typeof Craft.Vizy === typeof undefined) {
    Craft.Vizy = {};
}

import { createVueApp } from './config';

import VizyConfig from './VizyConfig.js';
import VizyInput from './components/VizyInput.vue';
import VizySettings from './components/VizySettings.vue';

// Register a config object to act as an API layer to register buttons, extensions, etc.
// Should be done before the Vue app is registered to ensure extensions are available.
Craft.Vizy.Config = new VizyConfig();

// Fire an event so plugins can reliably hook in
document.dispatchEvent(new CustomEvent('onVizyConfigReady', {
    bubbles: true,
}));

const VIZY_INPUT_SELECTOR = '[data-vizy-auto-mount="input"], .vizy-input-component';
const VIZY_SETTINGS_SELECTOR = '[data-vizy-auto-mount="settings"], .vizy-configurator';
const mountedRoots = new WeakSet();
const mountedApps = new WeakMap();

const parseJsonDataAttr = (root, attrName, fallback = null) => {
    const raw = root?.getAttribute(attrName);

    if (!raw) {
        return fallback;
    }

    try {
        return JSON.parse(raw);
    } catch (e) {
        return fallback;
    }
};

const isParkedVizyRoot = (root) => {
    // Portals are parked off-document (DocumentFragment) or in a hidden layer.
    // TipTap/ProseMirror must not mount there — moving the DOM after mount breaks nested Vizy.
    if (!root || !root.isConnected) {
        return true;
    }

    return Boolean(root.closest?.('.vui-vizy-portals'));
};

const mountInputRoot = (root) => {
    if (!root || mountedRoots.has(root) || isParkedVizyRoot(root)) {
        return;
    }

    const app = createVueApp({
        components: {
            VizyInput,
        },
    });

    // Import globally, as these are included in nested field content to be compiled.
    app.component('VizyInput', VizyInput);

    app.mount(root);
    mountedRoots.add(root);
    mountedApps.set(root, app);
};

const unmountInputRoot = (root) => {
    if (!root || !mountedRoots.has(root)) {
        return;
    }

    const app = mountedApps.get(root);

    if (app) {
        app.unmount();
        mountedApps.delete(root);
    }

    mountedRoots.delete(root);
};

const mountSettingsRoot = (root) => {
    if (!root || mountedRoots.has(root) || isParkedVizyRoot(root)) {
        return;
    }

    const fieldData = parseJsonDataAttr(root, 'data-field-data', []);
    const settings = parseJsonDataAttr(root, 'data-settings', {});

    const app = createVueApp({
        components: {
            VizySettings,
        },

        data() {
            return {
                fieldData,
                settings,
            };
        },
    });

    app.mount(root);
    mountedRoots.add(root);
    mountedApps.set(root, app);
};

const rootsForSelector = (scope, selector) => {
    if (!scope) {
        return [];
    }

    const roots = [];

    if (scope.matches && scope.matches(selector)) {
        roots.push(scope);
    }

    if (scope.querySelectorAll) {
        roots.push(...scope.querySelectorAll(selector));
    }

    return roots;
};

Craft.Vizy.mountAll = (scope = document) => {
    rootsForSelector(scope, VIZY_INPUT_SELECTOR).forEach((root) => {
        mountInputRoot(root);
    });

    rootsForSelector(scope, VIZY_SETTINGS_SELECTOR).forEach((root) => {
        mountSettingsRoot(root);
    });
};

Craft.Vizy.unmountAll = (scope = document) => {
    rootsForSelector(scope, VIZY_INPUT_SELECTOR).forEach((root) => {
        unmountInputRoot(root);
    });

    rootsForSelector(scope, VIZY_SETTINGS_SELECTOR).forEach((root) => {
        unmountInputRoot(root);
    });
};

Craft.Vizy.startAutoMountObserver = () => {
    if (Craft.Vizy.__autoMountObserverStarted) {
        return;
    }

    Craft.Vizy.__autoMountObserverStarted = true;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== Node.ELEMENT_NODE) {
                    return;
                }

                Craft.Vizy.mountAll(node);
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};

Craft.Vizy.Input = Garnish.Base.extend({
    init(idPrefix) {
        const root = document.querySelector(`#${idPrefix}-field ${VIZY_INPUT_SELECTOR}`);
        mountInputRoot(root);
    },
});

Craft.Vizy.Settings = Garnish.Base.extend({
    init(inputNamePrefix) {
        this.inputNamePrefix = inputNamePrefix;
        this.inputIdPrefix = Craft.formatInputId(this.inputNamePrefix);

        const root = document.querySelector(`.${this.inputIdPrefix}-vizy-configurator`);
        mountSettingsRoot(root);
    },
});
const patchVizyMatrixCreateEntry = () => {
    if (Craft.Vizy.__matrixCreateEntryPatched || typeof Craft.sendActionRequest !== 'function') {
        return;
    }

    Craft.Vizy.__matrixCreateEntryPatched = true;

    const sendActionRequest = Craft.sendActionRequest.bind(Craft);

    Craft.sendActionRequest = (method, action, config = {}) => {
        if (action === 'matrix/create-entry') {
            const data = config.data ?? {};
            const ownerElementType = data.ownerElementType ?? '';

            if (ownerElementType.includes('verbb\\vizy\\elements\\Block')) {
                const form = document.querySelector('form#main-form');
                const parseBlockInstanceId = (namespace) => {
                    if (!namespace) {
                        return null;
                    }

                    const match = namespace.match(/vizyData\[([^\]]+)\]/);

                    return match ? match[1] : null;
                };
                const blockInstanceId = parseBlockInstanceId(data.namespace);
                const blockCtx = Craft.Vizy.matrixOwnerContexts?.[data.ownerId]
                    || (blockInstanceId ? Craft.Vizy.matrixOwnerContexts?.[`block:${blockInstanceId}`] : null)
                    || {};
                const vizyFieldId = blockCtx.vizyFieldId || Craft.Vizy.vizyFieldId || null;
                const ctx = blockCtx.parentOwnerUid || blockCtx.parentOwnerId
                    ? {
                        uid: blockCtx.parentOwnerUid || null,
                        draftId: blockCtx.parentDraftId || null,
                        id: blockCtx.parentOwnerId || null,
                    }
                    : (Craft.Vizy.parentOwnerContextsByField && vizyFieldId
                        ? Craft.Vizy.parentOwnerContextsByField[vizyFieldId]
                        : null)
                    || Craft.Vizy.parentOwnerContext
                    || {};
                const blockEl = blockInstanceId
                    ? document.querySelector(`.vizyblock[data-vizy-block-id="${blockInstanceId}"]`)
                    : null;

                config.data = {
                    ...data,
                    parentOwnerUid: ctx.uid || form?.querySelector('input[name="uid"]')?.value || null,
                    parentDraftId: ctx.draftId || form?.querySelector('input[name="draftId"]')?.value || new URLSearchParams(window.location.search).get('draftId') || null,
                    parentOwnerId: ctx.id || form?.querySelector('input[name="elementId"]')?.value || null,
                    vizyFieldId,
                    blockInstanceId: blockInstanceId || blockCtx.blockInstanceId || blockEl?.dataset?.vizyBlockId || null,
                    matrixAnchorUid: blockCtx.matrixAnchorUid || blockEl?.dataset?.matrixAnchorUid || null,
                    vizyBlockTypeId: blockCtx.vizyBlockTypeId || blockEl?.dataset?.vizyBlockTypeId || null,
                };
            }
        }

        return sendActionRequest(method, action, config);
    };
};

$(document).ready(() => {
    Craft.Vizy.mountAll(document);
    Craft.Vizy.startAutoMountObserver();
    patchVizyMatrixCreateEntry();

    const patchVizyDataStoreInSerialized = (serialized) => {
        document.querySelectorAll('[data-vizy-auto-mount="input"] [data-store], .vizy-input-component [data-store]').forEach((input) => {
            if (!input.name) {
                return;
            }

            const name = encodeURIComponent(input.name);
            const value = encodeURIComponent(input.value ?? '');
            const param = `${name}=${value}`;
            const regex = new RegExp(`(^|&)${Craft.escapeRegex(name)}=[^&]*`);

            if (regex.test(serialized)) {
                serialized = serialized.replace(regex, `$1${param}`);
            } else {
                serialized += (serialized ? '&' : '') + param;
            }
        });

        return serialized;
    };

    // Block portal fields live under `vizyData[...]`, outside Craft's tracked `fields[...]` namespace.
    // Flush them into the Vizy JSON hidden input, patch that value into the serialized payload, then strip
    // `vizyData` so Craft doesn't treat portal inputs as unsaved changes (draft/unload warnings).
    // Note: ElementEditor calls jQuery.serialize() *before* the serializeForm event, so we must patch
    // the serialized string after flushing — updating [data-store] alone is too late for that request.
    const $mainForm = $('form#main-form');

    if ($mainForm.length) {
        const flushVizyPortalUpdates = () => {
            (Craft.Vizy.flushPortalUpdates || []).forEach((flush) => {
                flush();
            });
        };

        const elementEditor = $mainForm.data('elementEditor');

        if (elementEditor) {
            elementEditor.on('serializeForm', (e) => {
                flushVizyPortalUpdates();
                e.data.serialized = patchVizyDataStoreInSerialized(e.data.serialized);
                e.data.serialized = e.data.serialized.replace(/(^|&)vizyData[^&]*/g, '');
            });
        }

        $mainForm.on('submit', () => {
            flushVizyPortalUpdates();
        });
    }
});
