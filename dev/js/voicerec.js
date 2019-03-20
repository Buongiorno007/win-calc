// voicerec.js


var speechKit = new NuanceSpeechKitPlugin();


function doInit() {
  var serverURL = "cvq.nmdp.nuancemobility.net";
  speechKit.initialize("Credentials", serverURL, 443, false, function (r) {
    printResult(r);
  }, function (e) {
    printResult(e);
  });
}

function doCleanup() {
  speechKit.cleanup(function (r) {
    printResult(r);
  }, function (e) {
    printResult(e);
  });
}

function startRecognition(callback, progressCalback, languageLabel) {
  var recInProcess = true,
    recognitionLanguage = languageLabel;
  console.log("Before startRecognition");
  speechKit.startRecognition("dictation", recognitionLanguage, function (r) {
    printRecoResult(r);
  }, function (e) {
    printRecoResult(e);
  });
  console.log("After startRecognition");
  var tempObj = {};

  setTimeout(forceStop, 5000);

  function forceStop() {
    console.log("FORCE STOP" + recInProcess);
    if (recInProcess === true) {
      //inProcess = false;
      console.log("FORCE STOP");
      forceStopRecognition();
    }
  }

  function forceStopRecognition() {
    speechKit.stopRecognition(function (r) {
      printRecoResult(r);
    }, function (e) {
      console.log(e);
    });

  }


  function printRecoResult(resultObject) {
    if (resultObject.event == 'RecoVolumeUpdate') {
      console.log("RecoVolumeUpdate");
      if (progressCalback) {
        progressCalback(resultObject.volumeLevel);
      }
    }
    else {

      parseAndCallback(resultObject);
    }
  }

  function parseAndCallback(resultObject) {
    console.log("parseAndCallback" + resultObject.event);
    if (resultObject.results != undefined) {
      if (resultObject.results.length > 0) {
        callback(resultObject.results[0].value);
        recInProcess = false;
        return;
      }
    }
    if (resultObject.event != 'RecoStarted') {
      callback("0");
      recInProcess = false;
      return;

    }
  }
}


function stopRecognition() {
  speechKit.stopRecognition(function (r) {
    printRecoResult(r);
  }, function (e) {
    console.log(e);
  });

}


function getResult() {
  speechKit.getResults(function (r) {
    printResult(r);
  }, function (e) {
    console.log("getResult" + e);
  });
}


function printResult(resultObject) {
  console.log("printResult " + resultObject.event);
}

function playTTS(text, languageLabel) {
  if (text.length > 0) {
    console.log("Playing TTS");

    var ttsLanguageSelect = document.getElementById("tts-language");
    var ttsLanguage = languageLabel;
    speechKit.playTTS(text, ttsLanguage, null, function (r) {
      printTTSResult(r);
    }, function (e) {
      printTTSResult(e);
    });
  }

  function printTTSResult(resultObject) {
    console.log("printTTSResult " + JSON.stringify(resultObject));
  }

}
