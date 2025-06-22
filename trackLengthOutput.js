function trackOutput() {}

trackOutput.init = function() {
    print("Open");
}

trackOutput.shutdown = function() {
    print("Shutdown");
}

function sendTrackLengthAsCC1() {
    var trackLength = engine.getValue("[Channel1]", "duration");
    var ccValue = Math.floor((trackLength / 60) * 10);
    // print("Testing");
    // print(trackLength);
    var ccHexValue = ccValue.toString(16);
    midi.sendShortMsg(0xB0, 0x01, "0x" +ccHexValue);
}

function sendTrackLengthAsCC2() {
    var trackLength = engine.getValue("[Channel2]", "duration");
    var ccValue = Math.floor((trackLength / 60) * 10);
    // print("Testing");
    // print(trackLength);
    var ccHexValue = ccValue.toString(16);
    midi.sendShortMsg(0xB0, 0x02, "0x" +ccHexValue);
}
  
function onTrackLoaded1() {
    var timerId = engine.beginTimer(1000, function() {
        sendTrackLengthAsCC1();
        engine.stopTimer(timerId);
    });
}

function onTrackLoaded2() {
    var timerId = engine.beginTimer(1000, function() {
        sendTrackLengthAsCC2();
        engine.stopTimer(timerId);
    });
}
  
// Add any other necessary functions or event listeners here

engine.connectControl("[Channel1]", "track_loaded", "onTrackLoaded1"); // Call the onTrackLoaded function when a track is loaded in Deck 1
engine.connectControl("[Channel2]", "track_loaded", "onTrackLoaded2"); // Call the onTrackLoaded function when a track is loaded in Deck 2
