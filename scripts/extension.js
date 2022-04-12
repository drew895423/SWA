let volumeSetting;
let idColor = 'red';

//color change doesnt hit START HERE TOMORROW
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
      console.log(response.idfound);
      if (response.idfound === '我收到') {
        idColor = 'green';
      }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('Settings');
    button.addEventListener('click', function () {
        if (!document.getElementById('input')) {
            var input = document.createElement("input");
            input.id = 'input';
            input.type = 'text';
            container.appendChild(input);
            var okButton = document.createElement('button');
            okButton.addEventListener('click', () => {chromeSet("name", input.value)});
            okButton.innerText = 'OK';
            okButton.class="btn btn-primary";
            container.appendChild(okButton);
        }
    });
    var soundButton = document.getElementById('SoundSetting');
    soundButton.addEventListener('click', () => {
        setLocalSound('soundToggle');
    });
    var hideButton = document.getElementById('Hide');
    hideButton.addEventListener('click', () => {
        document.body.remove();
    });
    var volumeSlider = document.getElementById('volume-control');
    volumeSlider.style.position = "relative";
    volumeSlider.style.top = "4px";
    setStartingVolume(volumeSlider);
    volumeSlider.addEventListener('change', ()=> {
        chromeSet('savedVolume', volumeSlider.value);
        volumeSetting = volumeSlider.value;
    });
    var soundTest = document.getElementById('testSound');
    soundTest.addEventListener('click', () => {
        playMario().play();
    })
    var extIdButton = document.getElementById('extID');
    extIdButton.addEventListener('click', () => {
        chromeSet('id', chrome.runtime.id);
    })
    extIdButton.style.background = idColor;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.command === 'name') {
        chromeGet(message.command, sendResponse);
    }
    if(message.command === 'id') {
        chromeGet(message.command, sendResponse);
    }
    if(message.command === 'soundOn' && chromeGet(message.command)) {
        playMario().play();
    }
    return true;
});

function waitToSend(gottenName) {
    if (gottenName) {
        return gottenName;
    }
}

function getInitVolume() {
    return new Promise (resolve => {
        chrome.storage.local.get('savedVolume', result => {
            resolve(result);
        })
    })
}

function setStartingVolume(volumeSlider) {
    getInitVolume().then(result => {
        volumeSetting = result.savedVolume;
        volumeSlider.value = result.savedVolume;
    });
}

function waitForLocal(key) {
    return new Promise (resolve => {
        chrome.storage.local.get(key, function(result) {
            resolve(result.soundToggle);
        });
    });
}

function setLocalSound(key) {
    waitForLocal(key).then(result => {
        if (result) {
            chromeSet('soundToggle', false);
            document.getElementById('SoundSetting').innerText = 'Sound is OFF';
        } else {
            chromeSet('soundToggle', true);
            document.getElementById('SoundSetting').innerText = 'Sound is ON';
        }
    })
}

function chromeSet(key, value) {
    chrome.storage.local.set({[key]: value}, function() {
    });
}

function chromeGet(key, returnFunct) {
    console.log(key)
    if (key === 'name') {
        chrome.storage.local.get(key, function(result) {
            returnFunct(result.name);
        });
    }
    if (key === 'id') {
        chrome.storage.local.get(key, function(result) {
            console.log(result)
            returnFunct(result.id);
        });
    }
    if (key === 'soundOn') {
        waitForLocal('soundToggle').then(result => {
            if (result) {
                playMario().play();
            }
        });
    }
}

function playMario() {
    var audio = new Audio('audio/drm64_mario3.wav');
    audio.volume = volumeSetting / 100;
    return audio;
}