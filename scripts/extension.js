let volumeSetting;
let timeSetting;

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
    });
    var timeSlider = document.getElementById('timer-control');
    var timeDisplay = document.getElementById('showTimer');
    timeSlider.style.position = "relative";
    timeSlider.style.left = "3px";
    timeDisplay.style.position = "relative";
    timeDisplay.style.left = "2px";
    setStartingTime(timeSlider, timeDisplay);
    timeSlider.addEventListener('change', ()=> {
        chromeSet('savedTime', timeSlider.value);
        timeSetting = timeSlider.value;
        timeDisplay.innerText = timeSlider.value;
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    if(message.command === 'name') {
        chromeGet(message.command, sendResponse);
    }
    if(message.command === 'soundOn' && chromeGet(message.command)) {
        playMario().play();
    }
    if(message.command === 'getTimeSetting') {
        chromeGet('savedTime', sendResponse);
    }
    return true;
});

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

function getInitTimer() {
    return new Promise (resolve => {
        chrome.storage.local.get('savedTime', result => {
            resolve(result);
        })
    })
}

function setStartingTime(timeSlider, timeDisplay) {
    getInitTimer().then(result => {
        timeSetting = result.savedTime;
        timeSlider.value = result.savedTime;
        timeDisplay.innerText = result.savedTime;
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
    if (key === 'name') {
        chrome.storage.local.get(key, function(result) {
            returnFunct(result.name);
        });
    }
    if (key === 'soundOn') {
        waitForLocal('soundToggle').then(result => {
            if (result) {
                playMario().play();
            }
        });
    }
    if (key === 'savedTime') {
        chrome.storage.local.get(key, function(result) {
            returnFunct(result.savedTime);
        });
    }
}

function playMario() {
    var audio = new Audio('audio/drm64_mario3.wav');
    audio.volume = volumeSetting / 100;
    return audio;
}