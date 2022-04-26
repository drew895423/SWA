let stillCheck = true;
let stillCheckName = true;
let saveResonse;
let responseName;
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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    editorExtensionId = sender.id;
    sendResponse({idFound: 'hi'});
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
    let foundIncidents = document.querySelectorAll('[id^=incident]')
    if (foundIncidents.length > 1) {
        shouldNotify(foundIncidents);
    } else {
        //old, usually name loads first, keeping to double check
        setTimeout(checkForIncident, 4000);
    }
}

function shouldNotify() {
    if (stillCheck && stillCheckName) {
        chrome.runtime.sendMessage(editorExtensionId, {command: 'soundOn'});
        stillCheck = false;
        const ticketInfo = document.querySelectorAll('[id^=incident]')[1].getElementsByTagName('td');
        let ticketInfoCondensed = ticketInfo[4].innerText;
        if (ticketInfoCondensed.length > 29) {
            ticketInfoCondensed = ticketInfoCondensed.slice(0, 29);
        }
        notifyBrowser(ticketInfo[0].innerText, ticketInfoCondensed, 'hi');
        observer.disconnect();
    }
}

function waitingTimer() {
    return new Promise (resolve => {
        chrome.runtime.sendMessage(editorExtensionId, {command: 'getTimeSetting'}, (response) => {
            resolve(response);
        });
    });
}

waitingTimer().then(resolve => {
    if (resolve) {
        setTimeout(() => {
            location.reload();
        }, resolve * 1000);
    } else {
        console.log('default time is being used');
        setTimeout(() => {
            location.reload();
        }, 60000);
    }
});