const mainContent = document.getElementById("mainContent");
const ttsTab = document.getElementById("ttsTab");
const sttTab = document.getElementById("sttTab");
const swapBtn = document.getElementById("swapBtn");

// default : Text to Speech
loadTTS();

// Text to Speech UI
function loadTTS() {
  mainContent.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
      <textarea rows="8" style="width:100%; padding:12px; border-radius:8px; font-size:16px;" placeholder="Enter text here..."></textarea>
      <button id="speakBtn" style="padding:12px 20px; border:none; background:#f10755; color:white; border-radius:8px; cursor:pointer; font-size:16px;">
        🔊 Convert to Speech
      </button>
    </div>
  `;
  setActive(ttsTab);

  // add functionality
  document.getElementById("speakBtn").addEventListener("click", () => {
    const text = mainContent.querySelector("textarea").value;
    if (text.trim() !== "") {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";  
      speechSynthesis.speak(utterance);
    } else {
      alert("Please enter some text!");
    }
  });
}

// function to load Speech to Text 'ui'
function loadSTT() {
  mainContent.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
      <button id="recordBtn" style="background:none; border:none; cursor:pointer; font-size:60px; color:#f10755;">
        🎤
      </button>
      <textarea id="output" rows="7" readonly style="width:100%; padding:12px; border-radius:8px; font-size:16px;" placeholder="Your speech will appear here..."></textarea>
    </div>
  `;
  setActive(sttTab);

  const recordBtn = document.getElementById("recordBtn");
  const output = document.getElementById("output");

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    output.value = "❌ Speech Recognition not supported in this browser.";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "hi-IN";

  let isRecording = false;

  recordBtn.addEventListener("click", () => {
    if (!isRecording) {
      recognition.start();
      recordBtn.style.color = "#e74c3c"; // red when recording
      isRecording = true;
    } else {
      recognition.stop();
      recordBtn.style.color = "#f10755"; // back to pink
      isRecording = false;
    }
  });

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    output.value = transcript;
  };
}

// set active tab
function setActive(tab) {
  [ttsTab, sttTab].forEach(el => el.classList.remove("active"));
  tab.classList.add("active");
}

// handle swap button click
swapBtn.addEventListener("click", () => {
  if (ttsTab.classList.contains("active")) {
    loadSTT();
  } else {
    loadTTS();
  }
});
