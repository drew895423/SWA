let stillCheck = true;
let stillCheckName = true;
let saveResonse;
let responseName;
const editorExtensionId = 'cliaehbjehgfgjodigeoimfdjkdopbko';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    saveResponse = sendResponse('我收到你的消息了：'+JSON.stringify("request"));
});

let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        checkForName();
        if (!mutation.addedNodes) return
        if (!stillCheck) {
            observer.disconnect();
        }
    })
  })
  
  observer.observe(document.body, {
      childList: true
    , subtree: true
    , attributes: false
    , characterData: false
  })

function notifyBrowser(title, desc, url) {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    } else {
        var notification = new Notification(title, {
            icon: 'https://pm1.narvii.com/6789/408d166b0d15f7f4aab6c58a287bf6738f8f4ca5v2_128.jpg',
            body: desc,
        });
        notification.onclick = function() {
            window.open(url);
        };
        notification.onclose = function() {
        };
    }
}

function checkForName() {
    if (document.getElementsByClassName('truncate color_classes__color-regular___ok4If Text__large___sIzY0 Text__block___2LnxD').length > 0) {
        let htmlNodeForName = document.getElementsByClassName('truncate color_classes__color-regular___ok4If Text__large___sIzY0 Text__block___2LnxD');
        Array.from(htmlNodeForName).forEach((i) => {
            if (i.innerText) {
                if (responseName == undefined) {
                    getUserName('name', i);
                } else if (responseName == i.innerText) {
                    stillCheck = false;
                } else {
                    checkForIncident();
                }
            }
        });
    } else if (stillCheckName) {
        setTimeout(checkForName, 500);
    }
}

function checkForIncident() {
    //possible fix to getting notifications with nothing actually in the que
    if (document.querySelectorAll('[id^=incident]').length > 1) {
        shouldNotify();
    } else {
        //old, usually name loads first, keeping to double check
        setTimeout(checkForIncident, 4000);
        return false;
    }
}

function shouldNotify() {
    if (stillCheck && stillCheckName) {
        chrome.runtime.sendMessage(editorExtensionId, {command: 'soundOn'});
        stillCheck = false;
        notifyBrowser('hi', 'hi', 'hi');
    }
}

function getUserName(key, i) {
    function waitForUsername() {
        return new Promise (resolve => {
            chrome.runtime.sendMessage(editorExtensionId, {command: 'name'}, (response) => {
                resolve(response);
            });
        });
    }
    waitForUsername().then(resolve => {
        if (resolve != null) {
            responseName = resolve;
            return resolve;
        }
    });
};