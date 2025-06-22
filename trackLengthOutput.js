function trackOutput() {}

trackOutput.init = function() {
    print("Open");
}

trackOutput.shutdown = function() {
    print("Shutdown");
}

function sendTrackTimeRemainingAsCC(deckNum) {
    var deck = "[Channel" + deckNum + "]";
    var trackLoaded = engine.getValue(deck, "track_loaded");

    if (trackLoaded === 0) {
        // No track loaded, send 0 for minutes and seconds
        midi.sendShortMsg(0xB0, deckNum, 0);  // Send 0 for minutes as CC message
        midi.sendShortMsg(0xB0, deckNum + 2, 0);  // Send 0 for seconds as CC message
        return;
    }

    var trackLength = engine.getValue(deck, "duration");
    var playPosition = engine.getValue(deck, "playposition");
    var timeRemaining = trackLength - playPosition;

    var remainingMinutes = Math.floor(timeRemaining / 60);
    var remainingSeconds = Math.floor(timeRemaining % 60);

    midi.sendShortMsg(0xB0, deckNum, remainingMinutes);  // Send remaining minutes as CC message
    midi.sendShortMsg(0xB0, deckNum + 2, remainingSeconds);  // Send remaining seconds as CC message
}

function onTrackLoaded(deckNum) {
    var timerId = engine.beginTimer(1000, function() {
        sendTrackTimeRemainingAsCC(deckNum);
        if (engine.getValue("[Channel" + deckNum + "]", "play") !== 1) {
            engine.stopTimer(timerId);
        }
    });
}

// Add any other necessary functions or event listeners here

engine.connectControl("[Channel1]", "track_loaded", function(value) {
    if (value === 1) {
        onTrackLoaded(1);
    } else {
        sendTrackTimeRemainingAsCC(1);  // Track unloaded, send 0 for minutes and seconds
    }
});

engine.connectControl("[Channel2]", "track_loaded", function(value) {
    if (value === 1) {
        onTrackLoaded(2);
    } else {
        sendTrackTimeRemainingAsCC(2);  // Track unloaded, send 0 for minutes and seconds
    }
});

engine.connectControl("[Channel1]", "play", function(value) {
    if (value === 1) {
        onTrackLoaded(1);
    }
});

engine.connectControl("[Channel2]", "play", function(value) {
    if (value === 1) {
        onTrackLoaded(2);
    }
});
