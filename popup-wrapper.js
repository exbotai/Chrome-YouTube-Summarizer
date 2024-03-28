chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0] === undefined || !tabs[0].url.startsWith('https://www.youtube.com/')) {
        const errorMessageSpan = document.querySelector('#extErrorMessage')
        errorMessageSpan.textContent = 'You need to be on YouTube!'
        return
    }

    chrome.tabs.sendMessage(tabs[0].id, {checkContentScript: true}, function(response) {
        if (response && response.contentScriptLoaded) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},

                func: () => showPopup() // showPopup acutally toggles popup here
            }, results => {
                //do nothing
                // if (!results[0].result) {
                //     console.log('injecting', tabs[0].id)
                //     chrome.scripting.executeScript({
                //         target: {tabId: tabs[0].id},
                //         files: ['/content.js']
                //     });

                //     chrome.scripting.insertCSS({
                //         target: {tabId: tabs[0].id},
                //         files: ['/content.css']
                //     })
                // }


                window.close();
            });
        }
    });
});
