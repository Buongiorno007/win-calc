
// voicerec.js


var speechKit = new NuanceSpeechKitPlugin();


function doInit() {
    var serverURL = "cvq.nmdp.nuancemobility.net";
    speechKit.initialize("Credentials", serverURL, 443, false, function(r){printResult(r)}, function(e){printResult(e)} );
}

function doCleanup(){
    speechKit.cleanup( function(r){printResult(r)}, function(e){printResult(e)} );
}

function startRecognition(callback){
    callbackFunction = callback;
    console.log("Before startRecognition");
    speechKit.startRecognition("dictation", "ru_ru", function(r){printRecoResult(r)}, function(e){printRecoResult(e)} );
    console.log("After startRecognition");
    var tempObj = new Object();
   
    function printRecoResult(resultObject){
        if (resultObject.event == 'RecoVolumeUpdate'){
            console.log("RecoVolumeUpdate");
        }
        else{
            parseAndCallback(resultObject);
        }
    }
    
    function parseAndCallback(resultObject){
        if (resultObject.results != undefined){
            if (resultObject.results.length > 0) {
                callback(resultObject.results[0].value);
                return;
            } else {
                callback("0");
                return;
            }
        }
    }
}


function stopRecognition(){
    speechKit.stopRecognition(function(r){printRecoResult(r)}, function(e){console.log(e)} );
    
}


function getResult(){
    speechKit.getResults(function(r){printResult(r)}, function(e){console.log(e)} );
}



function printResult(resultObject){
    console.log("printResult " + resultObject.event);
}

function playTTS(text) {
    if (text.length > 0){
        console.log("Playing TTS");
        
        var ttsLanguageSelect = document.getElementById("tts-language");
        var ttsLanguage = "ru_ru";
        speechKit.playTTS(text, ttsLanguage, null, function(r){printResult(r)}, function(e){printResult(e)} );
    }
}




