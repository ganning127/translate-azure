
const reigion = "REIGION";
const key = "KEY";

const speechTranslationConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(key, reigion);

let output = document.getElementById("output");
let transcript = [];

let language;
let startButton = document.getElementById("start");
let stopButton = document.getElementById("stop");
let languageDrop = document.getElementById("outputLang")

speechTranslationConfig.speechRecognitionLanguage = "en-US";

// add an auto detection langauge

function addLanguages() {
    let languages = languageDrop.children;
    console.log(languages)
    for (let option of languages) {
        console.log(option)
        speechTranslationConfig.addTargetLanguage(option.value);
    }
}
addLanguages();

const translator = new SpeechSDK.TranslationRecognizer(speechTranslationConfig);

const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
const recognizer = new SpeechSDK.TranslationRecognizer(speechTranslationConfig, audioConfig);

recognizer.recognized = function (s, e) {
    console.log("CALLED");

    console.log(e);
    var str = " [" + language + "] " + e.result.translations.get(language);
    str += "\r\n";
};

startButton.addEventListener("click", () => {
    recognizer.startContinuousRecognitionAsync();
    startButton.classList.add("hidden");
    stopButton.classList.remove("hidden");
})


stopButton.addEventListener("click", () => {
    recognizer.stopContinuousRecognitionAsync();
    transcript = [];
    stopButton.classList.add("hidden");
    startButton.classList.remove("hidden");
})

recognizer.recognizing = (s, e) => {
    // console.log(`TRANSLATING: Text=${e.result.text}`);
    let words = [];
    if (transcript.length === 0) {
        transcript.push(e.result);
    }
    if (e.result.offset === transcript[transcript.length - 1].offset) {
        console.log('same sentence');
        transcript[transcript.length - 1] = e.result
    }
    else {
        console.log('diff sentence');
        transcript.push(e.result);
    }

    console.log(transcript);
    language = document.getElementById("outputLang").value;
    transcript.forEach(obj => {
        words.push(obj.translations.get(language))
    })

    console.log(words);
    output.innerHTML = words.join(". ");
    console.log(str)



};
recognizer.recognized = (s, e) => {
    if (e.result.reason == ResultReason.RecognizedSpeech) {
        console.log(`TRANSLATED: Text=${e.result.text}`);
    }
    else if (e.result.reason == ResultReason.NoMatch) {
        console.log("NOMATCH: Speech could not be translated.");
    }
};
recognizer.canceled = (s, e) => {
    console.log(`CANCELED: Reason=${e.reason}`);
    if (e.reason == CancellationReason.Error) {
        console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
        console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
        console.log("CANCELED: Did you update the subscription info?");
    }
    recognizer.stopContinuousRecognitionAsync();
};



recognizer.sessionStopped = (s, e) => {
    console.log("\n    Session stopped event.");
    recognizer.stopContinuousRecognitionAsync();
};
