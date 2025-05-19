// Select DOM elements
let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

// Function to speak text
function speak(text) {
    try {
        let text_speak = new SpeechSynthesisUtterance(text);
        text_speak.rate = 1;
        text_speak.pitch = 1;
        text_speak.volume = 1;
        text_speak.lang = "en-US"; // Set default language to English (US)
        window.speechSynthesis.speak(text_speak);
    } catch (error) {
        console.error("Error with speech synthesis:", error);
        content.innerText = "Sorry, I cannot speak right now.";
    }
}

// Function to greet the user
function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good Morning!");
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon!");
    } else {
        speak("Good Evening!");
    }
}

// Initialize Speech Recognition
let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!speechRecognition) {
    alert("Speech recognition is not supported in your browser.");
} else {
    let recognition = new speechRecognition();

    recognition.onresult = (event) => {
        let currentIndex = event.resultIndex;
        let transcript = event.results[currentIndex][0].transcript;
        content.innerText = transcript;
        takeCommand(transcript.toLowerCase());
    };

    // Start voice recognition on button click
    btn.addEventListener("click", () => {
        recognition.start();
        voice.style.display = "block";
        btn.style.display = "none";
    });
}

// Process commands
async function takeCommand(message) {
    voice.style.display = "none";
    btn.style.display = "flex";

    if (message.includes("hello") || message.includes("hey")) {
        speak("Hello! How can I assist you today?");
    } else if (message.includes("who are you")) {
        speak("I am your advanced virtual assistant, powered by OpenAI.");
    } else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://youtube.com/", "_blank");
    } else if (message.includes("search on youtube")) {
        let searchTerm = message.replace("search on youtube", "").trim();
        if (searchTerm) {
            speak(`Searching for ${searchTerm} on YouTube.`);
            window.open(`https://www.youtube.com/results?search_query=${searchTerm}`, "_blank");
        } else {
            speak("Please tell me what to search on YouTube.");
        }
    } else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://google.com/", "_blank");
    } else if (message.includes("weather")) {
        let weatherData = await fetchOpenAIResponse("Tell me the current weather in London.");
        speak(weatherData);
    } else if (message.includes("news")) {
        let news = await fetchOpenAIResponse("Give me the latest news.");
        speak(news);
    } else if (message.includes("joke")) {
        let joke = await fetchOpenAIResponse("Tell me a joke.");
        speak(joke);
    } else if (message.includes("time")) {
        let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(`The time is ${time}`);
    } else if (message.includes("date")) {
        let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
        speak(`Today's date is ${date}`);
    } else if (message.includes("search for")) {
        let searchTerm = message.replace("search for", "").trim();
        if (searchTerm) {
            speak(`Searching for ${searchTerm} on Google.`);
            window.open(`https://www.google.com/search?q=${searchTerm}`, "_blank");
        } else {
            speak("Please specify what to search for.");
        }
    } else if (message.includes("play music")) {
        speak("Playing music on Spotify...");
        window.open("https://open.spotify.com/", "_blank");
    } else {
        let aiResponse = await fetchOpenAIResponse(message);
        speak(aiResponse);
    }
}

// Fetch responses from OpenAI API
async function fetchOpenAIResponse(prompt) {
    try {
        const apiKey = "sk-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"; // Replace with your OpenAI API key
        let response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 150
            })
        });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        let data = await response.json();
        return data.choices[0].text.trim();
    } catch (error) {
        console.error("Error fetching response from OpenAI:", error);
        return "I couldn't fetch the response right now. Please try again later.";
    }
}

// Optionally, greet the user on page load
// window.addEventListener('load', () => {
//     wishMe();
// });
