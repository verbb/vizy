export const generateHandle = function(sourceValue) {
    // Remove HTML tags
    let handle = sourceValue.replace('/<(.*?)>/g', '');

    // Remove inner-word punctuation
    handle = handle.replace(/['"‘’“”[]\(\){}:]/g, '');

    // Make it lowercase
    handle = handle.toLowerCase();

    // Convert extended ASCII characters to basic ASCII
    handle = Craft.asciiString(handle);

    // Get the "words"
    const words = Craft.filterArray(handle.split(/[^a-z0-9]+/));
    handle = '';

    // Make it camelCase
    for (let i = 0; i < words.length; i++) {
        if (i === 0) {
            handle += words[i];
        } else {
            handle += words[i].charAt(0).toUpperCase() + words[i].substr(1);
        }
    }

    return handle;
};

export const getNextAvailableHandle = function(handleCollection, handle, suffix) {
    let newHandle = handle;

    if (suffix) {
        newHandle = handle + suffix;
    }

    if (handleCollection.includes(newHandle)) {
        return getNextAvailableHandle(handleCollection, handle, suffix + 1);
    }

    return newHandle;
};

export const generateKebab = function(sourceValue) {
    // Remove HTML tags
    let kebab = sourceValue.replace('/<(.*?)>/g', '');

    // Remove inner-word punctuation
    kebab = kebab.replace(/['"‘’“”[]\(\){}:]/g, '');

    // Make it lowercase
    kebab = kebab.toLowerCase();

    // Convert extended ASCII characters to basic ASCII
    kebab = Craft.asciiString(kebab);

    // Get the "words"
    const words = Craft.filterArray(kebab.split(/[^a-z0-9]+/));
    kebab = words.join('-');

    return kebab;
};

export const getId = function(prefix = '') {
    return prefix + Craft.randomString(10);
};

/**
 * If the value is a bare email (no URI scheme), prefix with mailto: so the
 * browser treats it as an email link. Leaves http(s), mailto, tel, Craft refs (#handle:id), paths, etc. unchanged.
 *
 * @param {string|null|undefined} raw
 * @returns {string|null|undefined}
 */
export function normalizeLinkHref(raw) {
    if (raw == null || typeof raw !== 'string') {
        return raw;
    }

    const href = raw.trim();

    if (!href) {
        return href;
    }

    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
        return href;
    }

    if (href.startsWith('#') || href.startsWith('/') || href.startsWith('?') || href.startsWith('//')) {
        return href;
    }

    if (/^\S+@\S+\.\S+$/.test(href)) {
        return `mailto:${href}`;
    }

    return href;
}
