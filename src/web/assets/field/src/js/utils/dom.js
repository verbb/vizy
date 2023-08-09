export const getClosest = function(elem, selector) {
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) { return elem; }
    }

    return null;
};

export const onReady = function($root, callback) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].intersectionRatio !== 0) {
            callback();

            // Stop observing, now we've deemed it "ready"
            observer.disconnect();
        }
    });

    observer.observe($root);
};

export const awaitSelector = (selector, rootNode, fallbackDelay) => {
    return new Promise((resolve, reject) => {
        try {
            const root = rootNode || document;
            const ObserverClass = MutationObserver || WebKitMutationObserver || null;
            const mutationObserverSupported = typeof ObserverClass === 'function';
            let observer;

            const stopWatching = () => {
                if (observer) {
                    if (mutationObserverSupported) {
                        observer.disconnect();
                    } else {
                        clearInterval(observer);
                    }

                    observer = null;
                }
            };

            const findAndResolveElements = () => {
                const allElements = root.querySelectorAll(selector);

                if (allElements.length === 0) {
                    return;
                }

                const newElements = [];
                const attributeForBypassing = 'data-awaitselector-resolved';

                allElements.forEach((el, i) => {
                    if (!el.getAttribute(attributeForBypassing)) {
                        el.setAttribute(attributeForBypassing, true);
                        newElements.push(el);
                    }
                });

                if (newElements.length > 0) {
                    stopWatching();
                    resolve(newElements);
                }
            };

            if (mutationObserverSupported) {
                observer = new ObserverClass((mutationRecords) => {
                    const nodesWereAdded = mutationRecords.reduce((found, record) => {
                        return found || (record.addedNodes && record.addedNodes.length > 0);
                    }, false);

                    if (nodesWereAdded) {
                        findAndResolveElements();
                    }
                });

                observer.observe(root, {
                    childList: true,
                    subtree: true,
                });
            } else {
                observer = setInterval(findAndResolveElements, fallbackDelay || 250);
            }

            findAndResolveElements();
        } catch (exception) {
            reject(exception);
        }
    });
};

export const watchAwaitSelector = (selector, callback, rootNode, fallbackDelay) => {
    (function awaiter(continueWatching = true) {
        if (continueWatching === false) {
            return;
        }

        awaitSelector(selector, rootNode, fallbackDelay)
            .then(callback)
            .then(awaiter);
    }());
};
