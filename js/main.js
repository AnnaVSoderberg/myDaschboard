//CLOCK
function updateClock() {
    const now = new Date();
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    timeElement.textContent = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    dateElement.textContent = now.toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
// Update clock every second
setInterval(updateClock, 1000);
















//CHANGE TEXT CENTER DASHBOARD

let userInput = ""; // Initialize userInput to an empty string

function changeHeadlineText() {
    let myHeadline = document.getElementById('myHeadline');

    // Prompt the user for input until a non-empty value is provided
    do {
        userInput = prompt("Please enter some text for the headline:");
    } while (userInput.trim() === ""); // Check if userInput is empty or only whitespace

    myHeadline.textContent = userInput; // Use textContent to change the text
    saveHeadlineToLocalStorage(userInput); // Call saveText function to save the text in localStorage
}

function saveHeadlineToLocalStorage(text) {
    localStorage.setItem('headlineText', text); // Save the headline text in localStorage
}

function initializeHeadline() {
    const savedText = localStorage.getItem('headlineText');
    if (savedText) {
        document.getElementById('myHeadline').textContent = savedText;
    }
}




















































//LINKS

// Funktion för att initialisera länkar från lokal lagring
function initializeLinks() {
    const existingLinks = JSON.parse(localStorage.getItem("links")) || [];
    const linksContainer = document.getElementById("linksContainer");

    existingLinks.forEach(function(linkData) {
        const linkContainer = document.createElement("div");
        linkContainer.classList.add("link-container");

        const linkElement = document.createElement("a");
        linkElement.href = linkData.link;
        linkElement.textContent = linkData.title;
        linkElement.target = "_blank";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "-";
        deleteButton.onclick = function() {
            linkContainer.remove(); // Remove the link container from the DOM
            removeLinkFromLocalStorage(linkData.link); // Remove the link from local storage
        };

        linkContainer.appendChild(linkElement);
        linkContainer.appendChild(deleteButton);
        linksContainer.appendChild(linkContainer);
    });
}

// Definiera en global variabel för att hålla reda på både länk- och titelinput
let linkAndTitleInput = { link: "", title: "" };

// Funktion för att lägga till en länk
// Funktion för att lägga till en länk
function addLink() {
    // Prompt the user to enter the link and title
    const linkInput = prompt("Enter the link:");
    const titleInput = prompt("Enter the title:");

    // Check if both link and title are not empty
    if (linkInput.trim() !== "" && titleInput.trim() !== "") {
        const newLink = { link: linkInput, title: titleInput };
        saveLinkToLocalStorage(linkInput, titleInput);

        const linkElement = document.createElement("a");
        linkElement.href = linkInput;
        linkElement.textContent = titleInput;
        linkElement.target = "_blank"; // Open the link in a new tab

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "-";
        deleteButton.onclick = function() {
            // Remove the link container from the DOM
            linkElement.parentElement.remove();
            // Remove the link from local storage
            removeLinkFromLocalStorage(linkInput);
            // Reset linkInput and titleInput
            localStorage.removeItem("linkInput");
            localStorage.removeItem("titleInput");
        };

        const linksContainer = document.getElementById("linksContainer");
        const linkContainer = document.createElement("div");
        linkContainer.classList.add("link-container");

        linkContainer.appendChild(linkElement);
        linkContainer.appendChild(deleteButton);
        linksContainer.appendChild(linkContainer);
    } else {
        // Alert the user if either link or title is empty
        alert("Both link and title are required.");
    }
}


// Funktion för att spara länken till lokal lagring
function saveLinkToLocalStorage(link, title) {
    const existingLinks = JSON.parse(localStorage.getItem("links")) || [];
    existingLinks.push({ link: link, title: title });
    localStorage.setItem("links", JSON.stringify(existingLinks));
}

// Funktion för att ta bort länken från lokal lagring
function removeLinkFromLocalStorage(link) {
    const existingLinks = JSON.parse(localStorage.getItem("links")) || [];
    const updatedLinks = existingLinks.filter(function(linkData) {
        return linkData.link !== link;
    });
    localStorage.setItem("links", JSON.stringify(updatedLinks));
}

// Call initializeLinks() when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {
    initializeLinks();
});

























































//NOTES TEXT


// Get the textarea element
const notesTextarea = document.getElementById("notesTextarea");

// Add event listener to the textarea to save notes whenever it changes
notesTextarea.addEventListener("input", saveNotes);

// Function to save notes in local storage
function saveNotes() {
    // Get the value of the textarea
    const notes = notesTextarea.value;

    // Save notes in local storage
    localStorage.setItem("userNotes", notes);
}

// Function to load notes from local storage
function loadNotes() {
    // Get notes from local storage
    const savedNotes = localStorage.getItem("userNotes");

    // Check if there are saved notes
    if (savedNotes) {
        // Set the value of the textarea to the saved notes
        notesTextarea.value = savedNotes;
    }
}

// Initialize functions on window load
window.onload = function() {
    initializeHeadline();
    loadNotes();
};




















































// WEATHER  WITH ICONS

document.addEventListener("DOMContentLoaded", function() {
    // Hämta användarens plats med geolocation-API
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(latitude, longitude)

            // Anropa väder-API för att hämta väderdata
            const apiKey = 'd503046a6d32351ea6da60ca0f2bde98'; // Lägg till din API-nyckel här
            const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=sv`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    // Visa väderdata på webbsidan
                    displayWeatherForecast(data);
                })
                .catch(error => console.error('Error fetching weather data:', error));
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
});

function displayWeatherForecast(weatherData) {
    const weatherContainer = document.getElementById("weather-container");
    weatherContainer.innerHTML = ""; // Rensa innehållet för att visa ny väderdata

    // Extract today's weather data
    const todayForecast = weatherData.list[0];
    const todayDate = new Date(todayForecast.dt * 1000); // Convert UNIX timestamp to milliseconds
    const todayTemperature = Math.round(todayForecast.main.temp);
    const todayWeatherDescription = todayForecast.weather[0].description;
    const todayWeatherIcon = `https://openweathermap.org/img/wn/${todayForecast.weather[0].icon}.png`;

    const todayHTML = `
    <div class="weather-card"> 
        <img class="weatherIcon" src="${todayWeatherIcon}" alt="Today's weather icon">
        <div class="weatherInfo"> 
            <h4>Idag: ${todayDate.toLocaleDateString()}</h4>
            <div class="p-container"> 
                <p class="temp" >${todayTemperature}°C</p>
                <p class="weatherDesc" >${todayWeatherDescription}</p>
            </div>
        </div>
    </div>
    `;
    weatherContainer.innerHTML += todayHTML;

    // Extract weather data for the next two days
    for (let i = 1; i <= 2; i++) {
        const nextDayForecast = weatherData.list[i * 8]; // Data for each day is available every 8 entries
        const nextDayDate = new Date(nextDayForecast.dt * 1000); // Convert UNIX timestamp to milliseconds
        const nextDayTemperature = Math.round(nextDayForecast.main.temp);
        const nextDayWeatherDescription = nextDayForecast.weather[0].description;
        const nextDayWeatherIcon = `https://openweathermap.org/img/wn/${nextDayForecast.weather[0].icon}.png`;

        const nextDayHTML = `
        <div class="weather-card"> 
            <img class="weatherIcon" src="${nextDayWeatherIcon}" alt="Next day's weather icon">        
            <div class="weatherInfo"> 
                <h4>${nextDayDate.toLocaleDateString()}</h4>
                <div class="p-container">
                    <p class= "temp">${nextDayTemperature}°C</p>
                    <p class="weatherDesc">${nextDayWeatherDescription}</p>
                </div>
            </div>
        </div>
        `;
        weatherContainer.innerHTML += nextDayHTML;
    }
}














































//NEW BACKGROUND ON CLICK

/// Define the API URL at the global scope
const accessKey = "DvpNV-swm5aIiwU-sLanftwEqGfYp5GIN9SSAWjBikU";
const api = `https://api.unsplash.com/photos/random/?client_id=${accessKey}`;

// Function to fetch and set image
function fetchAndSetImage() {
    let imageElement = document.querySelector("#unsplashImage");

    fetch(api)
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((jsonData) => {
        imageElement.src = jsonData.urls.regular;

        // Save the new image URL to local storage
        localStorage.setItem('backgroundImage', jsonData.urls.regular);
    })
    .catch((error) => {
        console.log("Fetch error:" + error);
    });
}

// Function to set the background image from local storage
function setBackgroundFromLocalStorage() {
    let storedImageUrl = localStorage.getItem('backgroundImage');
    if (storedImageUrl) {
        let imageElement = document.querySelector("#unsplashImage");
        imageElement.src = storedImageUrl;
    }
}

// Event listener for button click
document.getElementById("changeBackground").addEventListener("click", fetchAndSetImage);

// Call the function to set the background image from local storage when the page loads
document.addEventListener("DOMContentLoaded", setBackgroundFromLocalStorage);
