'use strict';

if (!location.href.includes('operabrowserjs=no')) {
    (function(document){
        const { href, pathname, hostname } = location;

        const safeApply = Function.prototype.apply.bind(Function.prototype.apply);
        const safeMethod = (method, context) =>
            (...args) =>
                safeApply(method, context, args);
        const utils = {
            addEventListener: (element, event, handler, options) => {
                element.addEventListener(event, handler, options);
            },
            appendChild: (parent, child) => parent.appendChild(child),
            createElement: (tag) => document.createElement(tag),
            createTextNode: (text) => document.createTextNode(text),
            setAttribute: (element, attr, value) => {
                element.setAttribute(attr, value);
            },
            querySelector: (selectors) => document.querySelector(selectors),
        };

        const version = () => {
            const total = Object.keys(PATCHES).length;
            return `Opera Desktop April 4, 2024. Active patches: ${total}`;
        };
        const isPartOfDomain = (host) =>
            hostname.endsWith(`.${host}`) ||
            hostname === host;
        const browserjsUrl = new URL('chrome://browserjs');
        const hideOperaObject = () => { delete window.opr; };
        const hideOperaUserAgent = () => {
            const newUA = navigator.userAgent.replace(/ ?OPR.[0-9.]*.*/, '');
            Object.defineProperty(navigator, 'userAgent', {get: () => newUA});
        };

        const addCssToDocument = (cssText, doc = document, mediaType = '') => {
            const styleElementId = `opera-css-${mediaType.replace(/\s+/g, '-')}`;
            let styleElement = doc.getElementById(styleElementId);
            if (!styleElement) {
                const head = doc.head || utils.querySelector(doc, 'head');
                styleElement = utils.createElement('style');
                styleElement.id = styleElementId;
                utils.setAttribute(styleElement, 'type', 'text/css');
                if (mediaType) {
                    utils.setAttribute(styleElement, 'media', mediaType);
                    utils.appendChild(head, styleElement);
                }
                utils.appendChild(styleElement, utils.createTextNode(cssText));
            }
        };

        const hideElementsWithCSS = (selectors) => {
            const cssText = selectors
                .map(selector => `${selector} { visibility: hidden; }`)
                .join('\n');
            addCssToDocument(cssText);
        };

        const PATCHES = {
            'PATCH-1190': {
                description: 'Delta.com shows browser warning to Opera.',
                isMatching: () => isPartOfDomain('delta.com'),
                apply: () => {
                    Object.defineProperty(window, 'UnsupportedBrowser', {
                        get: () => undefined,
                        set: (arg) => {arg.badBrowser = () => false;},
                    });
                },
            },
            'PATCH-1220': {
                description: 'To not force plugin download',
                isMatching: () => hostname.includes('.google.') &&
                    hostname.startsWith('talkgadget'),
                apply: () => hideOperaUserAgent(),
            },
            'PATCH-1228': {
                description: 'Block for delta-homes.com spam site',
                isMatching: () => isPartOfDomain('delta-homes.com'),
                apply: () => location.replace('https://google.com'),
            },
            'PATCH-1252': {
                description: 'Hide first-run overlay on read.amazon.com',
                isMatching: () => isPartOfDomain('read.amazon.com'),
                apply: () => hideElementsWithCSS([
                    '.ui-dialog.firstRunDialog',
                    '.ui-dialog.firstRunDialog + .ui-widget-overlay',
                ]),
            },
            'PATCH-1263': {
                description: 'Hide Unsupported Browser dialog on clarks.co.uk',
                isMatching: () => isPartOfDomain('clarks.co.uk'),
                apply: () => hideElementsWithCSS(['#unsupportedBrowser']),
            },
            'PATCH-1269': {
                description: 'Hide popup with ads',
                isMatching: () => hostname.startsWith('images.google.') ||
                    hostname.startsWith('www.google.'),
                applyOnDOMReady: true,
                apply: () => {
                    const href =
                        'https://www.google.com/url?q=/chrome/browser/desktop/';
                    const res = document.evaluate(
                        `//a[contains(@href, "${href}")]`,
                        document, null, XPathResult.ANY_TYPE, null
                    );
                    const downloadLink = res.iterateNext();
                    if (downloadLink) {
                        const ad = downloadLink.closest('div[role="dialog"]');
                        if (ad) {
                            ad.style.display = 'none';
                        }
                    }
                },
            },
            'PATCH-1277': {
                description: 'Popup with ads',
                isMatching: () => isPartOfDomain('otvet.mail.ru'),
                apply: () => hideElementsWithCSS([
                    '#tb-39754319', '#tb-54288097',
                    '#tb-54288098', '#tb-54288094', '#tb-54288099',
                    '#tb-54288095', '#tb-54288093', '#tb-32116366',
                ]),
            },
            'DNA-69435': {
                description: 'Popup with ads in search results.',
                isMatching: () => hostname.startsWith('yandex') &&
                    pathname.startsWith('/search/'),
                apply: () => hideElementsWithCSS(['.popup2.distr-popup']),
            },
            'DNA-69613': {
                description: 'Unsupporting text block.',
                isMatching: () => isPartOfDomain('tickets.oebb.at'),
                apply: () => hideElementsWithCSS(['#settingErr']),
            },
            'DNA-72852': {
                description: 'Fix music playing.',
                isMatching: () => isPartOfDomain(
                    'streamdb3web.securenetsystems.net/cirrusencore/DEMOSTN'),
                apply: () => hideOperaUserAgent(),
            },
            'DNA-85788': {
                description: 'Text block with ads.',
                isMatching: () => isPartOfDomain('russian.rt.com'),
                apply: () => hideElementsWithCSS(['div#offers.offers']),
            },
            'DNA-84005': {
                description: 'Unsupported message.',
                isMatching: () => isPartOfDomain('comba-telecom.com'),
                apply: () => {
                    hideOperaObject();
                    hideOperaUserAgent();
                },
            },
            'DNA-79464': {
                description: 'Unsupported message when play video.',
                isMatching: () => isPartOfDomain('cbs.com'),
                apply: () => {
                    hideOperaObject();
                    hideOperaUserAgent();
                },
            },
            'DNA-85812': {
                description: 'Unsupported text block in header.',
                isMatching: () => isPartOfDomain('vk.com'),
                apply: () => hideElementsWithCSS(['div#system_msg.fixed']),
            },
            'DNA-83244': {
                description: 'Ads block in header.',
                isMatching: () => isPartOfDomain('mail.com'),
                apply: () => hideElementsWithCSS(['div.mod.mod-topper.promo']),
            },
            'DNA-85510': {
                description: 'Unsupported page on entrance.',
                isMatching: () => isPartOfDomain('famemma.tv'),
                apply: () => {
                    hideOperaObject();
                    hideOperaUserAgent();
                },
            },
            'DNA-97626': {
                description: 'Fix video playing.',
                isMatching: () => isPartOfDomain('highlive.tv'),
                apply: () => {
                    hideOperaObject();
                    hideOperaUserAgent();
                },
            },
            'DNA-90739': {
                description: 'Help to get form information for Opera users',
                isMatching: () => isPartOfDomain('opera.atlassian.net') &&
                    (pathname.startsWith('/servicedesk/customer/portal/9') ||
                        pathname.startsWith('/servicedesk/customer/portal/18') ||
                        pathname.startsWith('/servicedesk/customer/portal/20')),
                applyOnDOMReady: true,
                apply: async () => {
                    const waitForElement = async (selector,
                                                  maxAttempts = 50, interval = 100) => {
                        let attempts = 0;
                        while (attempts < maxAttempts) {
                            const element = document.querySelector(selector);
                            if (element) {
                                return element;
                            }
                            await new Promise(resolve =>
                                setTimeout(resolve, interval));
                            attempts++;
                        }
                        return null;
                    };
                    const setInputValue = (input, value) => {
                        input.focus();
                        input.value = value;
                        input.dispatchEvent(new Event('change', {bubbles: true}));
                    };
                    const insertSystemInformation = async () => {
                        const selector = '#customfield_10072';
                        const inputElement = await waitForElement(selector);
                        if (inputElement) {
                            const gpuInfo = getGpuInformation();
                            const systemInfo = `${navigator.userAgent}
                        (${navigator.language}), ${gpuInfo}`;
                            setInputValue(inputElement, systemInfo);
                        }
                    };
                    const getGpuInformation = () => {
                        const canvas = document.createElement('canvas');
                        const gl = canvas.getContext('webgl') ||
                            canvas.getContext('experimental-webgl');
                        if (gl) {
                            const debugInfo =
                                gl.getExtension('WEBGL_debug_renderer_info');
                            return debugInfo
                                ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
                                : '';

                        }
                        return '';
                    };
                    if (pathname.includes('servicedesk/customer/portal/' +
                            '9/group/11/create/') ||
                        pathname.includes('servicedesk/customer/portal/' +
                            '18/group/32/create/')) {
                        insertSystemInformation();
                    }
                    const originalPushState = history.pushState;
                    history.pushState = function (...args) {
                        originalPushState.apply(this, args);
                        insertSystemInformation();
                    };
                },
            },
            'DNA-90251': {
                description: 'Customize button for add extensions.',
                isMatching: () => isPartOfDomain('chrome.google.com') &&
                    pathname.startsWith('/webstore/'),
                applyOnDOMReady: true,
                apply: () => {
                    addCssToDocument('div.yD5gtd {visibility:hidden}')
                    const targetNode = document.documentElement;
                    const config = {
                        attributes: true,
                        childList: true,
                        subtree: true,
                    };
                    const callback = function(mutationsList, observer) {
                        for (const mutation of mutationsList) {
                            if (mutation.type === 'childList') {
                                var webstoreButtons = document
                                    .querySelectorAll('.webstore-test-button-label');
                                for (let webstoreButton of webstoreButtons) {
                                    if (webstoreButton.innerHTML.includes('Chrome'))
                                    {
                                        webstoreButton.innerHTML =
                                            webstoreButton.textContent =
                                                'Add to Opera';
                                    }
                                }
                            }
                        }
                    };
                    const observer = new MutationObserver(callback);
                    observer.observe(targetNode, config);
                },
            },
            'DNA-99267': {
                description: 'Pretend to be Chrome on radio-south-africa.co.za',
                isMatching: () => isPartOfDomain('radio-south-africa.co.za'),
                apply: () => {
                    hideOperaObject();
                    hideOperaUserAgent();
                },
            },
            'DNA-99293': {
                description: 'Change game button.',
                isMatching: () => isPartOfDomain('xsolla.com') &&
                    pathname.startsWith('/paystation3/'),
                applyOnDOMReady: true,
                apply: async() => {
                    const probeCondition = async (conditionFunction) => {
                        const sleep = (millis) => new Promise((resolve) =>
                            setTimeout(resolve), millis);
                        for (let i = 0; i < 100; i++) {
                            if (conditionFunction()) {
                                return true;
                            }
                            await sleep(50);
                        }
                        return false;
                    };
                    const findEULA = () => document.querySelector("a[href" +
                        "='https://www.opera.com/terms']");
                    const eula = await probeCondition(findEULA);
                    const targetNode = document.documentElement;
                    const config = {attributes: true,
                        childList: true,
                        subtree: true};
                    const callback = function(mutationsList, observer) {
                        for (const mutation of mutationsList) {
                            if (mutation.type === 'childList') {
                                var backButtons =
                                    document.querySelectorAll('.btn.' +
                                        'btn-flat.btn-md.btn-accent.tab-focus');
                                for (let backButton of backButtons) {
                                    if (backButton.innerHTML.includes('to' +
                                        ' the game')) {
                                        backButton.innerHTML =
                                            backButton.innerHTML.replace('to' +
                                                ' the game', '');
                                        addCssToDocument(`
                                        svg {
                                          visibility: hidden;
                                        }
                                      `);
                                    }
                                }
                            }
                        }
                    };
                    setTimeout(() => {
                        const button =
                            document.querySelector('.btn.btn-flat.btn-md.'+
                                'btn-accent.tab-focus');
                        if (button) {
                            button.click();
                        }
                    }, 6000);
                    const observer = new MutationObserver(callback);
                    observer.observe(targetNode, config);
                },
            },
            'DNA-99524': {
                description: 'Browser.js version reported on browserjs page.',
                isMatching: () => location.href === browserjsUrl.href,
                applyOnDOMReady: true,
                apply: () => {
                    const browserjs_info = version();
                    const addVersion =
                        document.createTextNode(`Today ${browserjs_info}`);
                    document.body.appendChild(addVersion);
                },
            },
            'DNA-109866': {
                description: 'Fix popup on Facebook.',
                isMatching: () => isPartOfDomain('facebook.com'),
                apply: () => hideElementsWithCSS(
                    ['div.xu96u03.xm80bdy.x10l6tqk.x13vifvy >' +
                    'div.x9f619.x1n2onr6.x1ja2u2z.x78zum5']),
            },
            'DNA-111340': {
                description: 'Customize Add extension on new chrome webstore.',
                isMatching: () => isPartOfDomain('chromewebstore.google.com'),
                apply: () => {
                    addCssToDocument('div.yD5gtd {visibility:hidden}')
                    const targetNode = document.documentElement;
                    const config = {
                        attributes: true,
                        childList: true,
                        subtree: true
                    };
                    const callback = function(mutationsList, observer) {
                        for (const mutation of mutationsList) {
                            if (mutation.type === 'childList') {
                                var webstoreButtons =
                                    document.querySelectorAll(
                                        'span.UywwFc-vQzf8d');
                                for (let webstoreButton of webstoreButtons) {
                                    if (webstoreButton.innerHTML
                                        .includes('Add to')) {
                                        webstoreButton.innerHTML =
                                            webstoreButton.textContent =
                                                'Add to Opera';
                                    }
                                    else if (webstoreButton.innerHTML.includes(
                                        'Remove from')) {
                                        webstoreButton.innerHTML =
                                            webstoreButton.textContent =
                                                'Remove from Opera';
                                    }
                                }
                            }
                        }
                    };
                    const observer = new MutationObserver(callback);
                    observer.observe(targetNode, config);
                },
                applyOnDOMReady: true,
            },
            'DNA-115341': {
                description: 'Hide first-run overlay on duckduckgo.com',
                isMatching: () => isPartOfDomain('duckduckgo.com'),
                apply: () => {
                    hideElementsWithCSS([
                        '.header--aside__item.header--aside__item--hidden-lg',
                    ]);
                },
            },
        };

        Object.values(PATCHES).forEach(({isMatching, apply, applyOnDOMReady}) => {
            if (isMatching()) {
                const run = () => apply();
                if (applyOnDOMReady) {
                    if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded',
                            run, false);
                    } else {
                        run();
                    }
                } else {
                    run();
                }
            }
        });

    })(document);
}
