// Replaces <RTD documentation address> with <new documentation address> in links

const rtd_address = 'canonical-ubuntu-core-docs-proxy.readthedocs-hosted.com';
const new_address = 'ubuntu.com/core/docs';

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function overwriteMatchingAnchorUrls(container) {
    if (!container) return;

    const anchors = container.querySelectorAll('a[href], link[href]');
    const rtd_addressRegex = new RegExp(escapeRegExp(rtd_address), 'g');

    anchors.forEach(anchor => {
        anchor.href = anchor.href.replace(rtd_addressRegex, new_address);
    });
}

overwriteMatchingAnchorUrls(document.querySelector('header'));

// Use a MutationObserver to wait for the RTD flyout element to appear in the DOM
const observer = new MutationObserver(function(mutations, obs) {

    const rtdFlyout = document.querySelector('readthedocs-flyout');
    if (!rtdFlyout) return;

    obs.disconnect();

    rtdFlyout.addEventListener('click', function() {
        const shadowRoot = rtdFlyout.shadowRoot;
        if (!shadowRoot) return;

        overwriteMatchingAnchorUrls(shadowRoot);
    });
});

observer.observe(document.body, { childList: true, subtree: true });
