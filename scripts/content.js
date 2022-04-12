let stillCheck = true;
let stillCheckName = true;
let saveResonse;
let responseName;
let extID;
let isKeepAliveGoing = true;
let editorExtensionId;

function findUserName() {
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
}
findUserName();

function getExtID() {
    function waitForID() {
        return new Promise (resolve => {
            chrome.runtime.sendMessage(editorExtensionId, {command: 'id'}, (response) => {
                resolve(response);
            });
        });
    }
    waitForID().then(resolve => {
        if (resolve != null) {
            extID = resolve;
            console.log('ext id is: ' + extID)
            return resolve;
        }
    });
}
getExtID();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    editorExtensionId = sender.id;
    sendResponse({idFound: '我收到'});
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
                } else if (responseName === i.innerText) {
                    stillCheck = false;
                    observer.disconnect();
                } else {
                    if (isKeepAliveGoing) {
                        isKeepAliveGoing = false;
                        checkForIncident();
                    }
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
    }
}

function shouldNotify() {
    if (stillCheck && stillCheckName) {
        chrome.runtime.sendMessage(editorExtensionId, {command: 'soundOn'});
        stillCheck = false;
        notifyBrowser('hi', 'hi', 'hi');
        observer.disconnect();
    }
}