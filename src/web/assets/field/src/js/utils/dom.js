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
