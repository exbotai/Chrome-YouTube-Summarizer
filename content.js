var overlay = null,
    frame = null,
    summaryUrl = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.checkContentScript) {
        sendResponse({contentScriptLoaded: true});
    }
});

const SUMMARY_CHECK_URL = "https://exbot.ai/api/v1/products/langing/youtube_summary_check";

// Event send by the inner `<object>` script
// window.addEventListener('message', e => {
//     if (e.data && e.data.type === 'load_summary') {
//         console.log('load_summary event received')
//     }
// })

// Event send by the extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type == "popup") {
        showPopup();
    } else if (request.type === 'close_popup') {
        hidePopup();
    }
    return true;
});


function showPopup() {
    if (document.querySelector(".py-popup-overlay")) {
        hidePopup();
        return false;
    }

    overlay = document.createElement('div');
    frame = document.createElement('object');

    overlay.className = "py-popup-overlay";
    frame.className = "py-popup-container";
    frame.setAttribute("scrolling", "no");
    frame.setAttribute("frameborder", "0");

    // file need to be added in manifest web_accessible_resources
    frame.data = chrome.runtime.getURL("popup.html");
    overlay.appendChild(frame);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", hidePopup);
    return true;
}

function hidePopup() {
    // Remove EventListener
    overlay.removeEventListener("click", hidePopup);

    // Remove the elements:
    document.querySelector(".py-popup-overlay").remove();

    // Clean up references:
    overlay = null;
    frame = null;
}

function handleSummarizeButtonClick() {
    showPopup()
}

// add button
function addSummaryButton() {
    // find the target element
    const targetElement = document.querySelector('#above-the-fold #menu #top-level-buttons-computed');
    if (targetElement) {
        if (!document.getElementById('exbot-summary-button')) {
            const button = document.createElement('button');
            button.innerText = 'Summary';
            button.id = 'exbot-summary-button';
            button.style.marginLeft = '10px';
            button.classList.add(
                'yt-spec-button',
                'yt-spec-button-shape-next',
                'yt-spec-button-shape-next--tonal',
                'yt-spec-button-shape-next--mono',
                'yt-spec-button-shape-next--size-m'
            );
            button.onclick = handleSummarizeButtonClick;
            button.innerHTML += `
                <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="
                    position: absolute;
                    top: -29px;
                    right: -26px;
                "><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="2" fill="#00d103"></circle> </g></svg>
            `
            targetElement.appendChild(button);
        }
    }
}

// Call the function once to add the button
// const observer = new MutationObserver(addButton);
// observer.observe(document.body, { childList: true, subtree: true });
function observeDOMChanges() {
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                addSummaryButton();
            }
        });
    });
    observer.observe(document.body, config);
}
observeDOMChanges();


function checkVideoUrl(videoUrl) {
    const checkUrl = `${SUMMARY_CHECK_URL}?_url=${encodeURIComponent(videoUrl)}`;
    fetch(checkUrl)
        .then(response => response.json())
        .then(data => {
            if (data.success === "true") {
                console.log(data.url)
            }
        })
        .catch(error => console.error('Check summary error:', error));
}

function observeVideoChanges() {
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            if (currentUrl.includes("/watch")) {
                checkVideoUrl(currentUrl);
            }
        }
    }).observe(document, {subtree: true, childList: true});
}
observeVideoChanges();
