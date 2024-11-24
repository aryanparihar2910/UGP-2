// WEATHER
document.getElementById("getWeatherBtn").addEventListener("click", function() {
    const apiKey = "1e4234a658c93be242483e867fcdfb6d"; // Replace with your OpenWeather API key
    const location = document.getElementById("location").value;
    const weatherResult = document.getElementById("weatherResult");
    const weatherData = document.getElementById("weatherData");
    const mapContainer = document.getElementById("map");
    const errorDiv = document.getElementById("error");
    const loading = document.getElementById("loading");
    const getWeatherBtn = document.getElementById("getWeatherBtn"); // Get reference to the button

    // Reset previous data
    weatherResult.classList.add("hidden");
    mapContainer.classList.add("hidden");
    errorDiv.classList.add("hidden");
    weatherResult.classList.remove("opacity-100");

    if (location === "") {
        alert("Please enter a location");
        return;
    }

    // Show loading spinner and hide the button
    loading.classList.remove("hidden");
    getWeatherBtn.classList.add("hidden");

    // Fetch latitude and longitude from the location name
    const geoUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            // Hide loading spinner and show the button again
            loading.classList.add("hidden");
            getWeatherBtn.classList.remove("hidden");

            if (data.cod === "404") {
                alert("Location not found. Please try again.");
                errorDiv.classList.remove("hidden");
                errorDiv.classList.add("animate-pulse");
                return;
            }

            const lat = data.coord.lat;
            const lon = data.coord.lon;
            const temp = data.main.temp;
            const humidity = data.main.humidity;
            const weatherDescription = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            const feelsLike = data.main.feels_like;
            const windSpeed = data.wind.speed;
            const windDeg = data.wind.deg;
            const visibility = data.visibility / 1000; // Convert meters to kilometers
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
            const country = data.sys.country;
            const city = data.name;

            // Display weather details
            weatherResult.innerHTML = `
            <div class="p-4 bg-blue-50 rounded-lg shadow-md w-full items-center text-center">
                <div class="text-center">
                    <h3 class="text-xl font-bold mb-2">Weather in ${city}, ${country}</h3>
                    <img class="mx-auto" src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weatherDescription}">
                    <p class="text-lg font-medium capitalize">${weatherDescription}</p>
                </div>
                <div class="mt-4 space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-lg"><i class="fas fa-thermometer-half text-red-500"></i> Temperature:</span>
                        <span class="text-lg">${temp}°C</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-lg"><i class="fas fa-temperature-low text-blue-500"></i> Feels like:</span>
                        <span class="text-lg">${feelsLike}°C</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-lg"><i class="fas fa-tint text-blue-400"></i> Humidity:</span>
                        <span class="text-lg">${humidity}%</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-lg"><i class="fas fa-wind text-gray-500"></i> Wind Speed:</span>
                        <span class="text-lg">${windSpeed} m/s</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-lg"><i class="fas fa-compass text-gray-600"></i> Wind Direction:</span>
                        <span class="text-lg">${windDeg}°</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-lg"><i class="fas fa-eye text-green-500"></i> Visibility:</span>
                        <span class="text-lg">${visibility} km</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-lg"><i class="fas fa-sun text-yellow-500"></i> Sunrise:</span>
                        <span class="text-lg">${sunrise}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-lg"><i class="fas fa-cloud-sun text-orange-500"></i> Sunset:</span>
                        <span class="text-lg">${sunset}</span>
                    </div>
                </div>
            </div>
        `;

            weatherResult.classList.remove("hidden");

            // Display the weather map
            initializeMap(lat, lon, apiKey);
        })
        .catch(error => {
            // Hide loading spinner and show the button again in case of an error
            loading.classList.add("hidden");
            getWeatherBtn.classList.remove("hidden");
            console.error(error);
        });
});

function initializeMap(lat, lon, apiKey) {
    const mapContainer = document.getElementById("map");
    mapContainer.classList.remove("hidden");

    // Initialize the map
    const map = L.map('map').setView([lat, lon], 10);

    // OpenStreetMap base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // OpenWeatherMap Weather Layers
    const precipitationLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
        attribution: 'Weather data © OpenWeatherMap',
        maxZoom: 19
    }).addTo(map);

    // Optional: Add other weather layers (temperature, clouds, wind, etc.)
    const tempLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
        attribution: 'Weather data © OpenWeatherMap',
        maxZoom: 19
    });

    const cloudsLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
        attribution: 'Weather data © OpenWeatherMap',
        maxZoom: 19
    });

    const windLayer = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
        attribution: 'Weather data © OpenWeatherMap',
        maxZoom: 19
    });

    // Layer Control
    const overlayMaps = {
        "Precipitation": precipitationLayer,
        "Temperature": tempLayer,
        "Clouds": cloudsLayer,
        "Wind": windLayer
    };

    L.control.layers(null, overlayMaps).addTo(map);
}
// NEWS COMPONENT
document.getElementById('fetchNewsButton').addEventListener('click', fetchNews);

function fetchNews() {
  const location = document.getElementById('locationInput').value;
  const apiKey = 'pub_55468bea61d11477a561d06eab168288084c6';  // Replace with your NewsData.io API key
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=in&q=${location} AND (rain OR flood OR weather OR "relief operations")`;

  // Hide the "Get News" button and show the loading spinner
  document.getElementById('fetchNewsButton').classList.add('hidden');
  document.getElementById('loadingSpinner').classList.remove('hidden');

  // Clear previous results and error message
  document.getElementById('newsResults').innerHTML = '';
  document.getElementById('errorMessage').style.display = 'none';
  document.getElementById('summarySection').classList.add('hidden');
  document.getElementById('floodSummary').innerText = '';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Show "Get News" button and hide the spinner
      document.getElementById('fetchNewsButton').classList.remove('hidden');
      document.getElementById('loadingSpinner').classList.add('hidden');
      
      if (data.results.length === 0) {
        document.getElementById('errorMessage').style.display = 'block';
      } else {
        displayNews(data.results);
         // Get the first 10 articles
         const firstTenArticles = data.results.slice(0, 10);

         // Extract titles and descriptions for summarization
         const articlesText = firstTenArticles.map(article => article.title + ". " + article.description).join(" ");

         // Call Groq API for summarization
         getFloodSummary(articlesText);
      }
    })
    .catch(() => {
      // Show "Get News" button and hide the spinner in case of error
      document.getElementById('fetchNewsButton').classList.remove('hidden');
      document.getElementById('loadingSpinner').classList.add('hidden');
      
      document.getElementById('errorMessage').style.display = 'block';
      console.log("Catching error");
    });
}

function displayNews(articles) {
  const newsResults = document.getElementById('newsResults');
  articles.forEach(article => {
    const newsItem = document.createElement('div');
    newsItem.classList.add('news-card', 'border', 'p-4', 'rounded-lg', 'shadow-md', 'bg-white', 'transition', 'hover:shadow-lg', 'flex', 'flex-col');
    newsItem.style.maxWidth = '300px'; // Card width
    newsItem.style.maxHeight = '400px'; // Card height
    newsItem.style.overflow = 'hidden'; // Limit content to fit inside

    newsItem.innerHTML = `
      <h3 class="font-semibold text-lg mb-2">${article.title}</h3>
      <p class="text-gray-700 mb-4">${article.description ? article.description.slice(0, 100) + '...' : 'No description available.'}</p>
      <a href="${article.link}" target="_blank" class="text-blue-500 hover:underline mt-auto">Read more</a>
    `;
    newsResults.appendChild(newsItem);
  });
}
async function getFloodSummary(articlesText) {
    const groqUrl = 'https://api.groq.com/openai/v1/chat/completions';  // Correct Groq API endpoint
    const groqApiKey = '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';  // Replace with your Groq API key

    try {
        // Log the data being sent for debugging purposes
        console.log("Articles text being sent for summarization:", articlesText);

        const response = await fetch(groqUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-70b-versatile',  // The desired model
                messages: [
                    { role: 'user', content: `Summarize the following flood-related posts focusing on disaster information only:\n\n${articlesText}. Also provide some suggestions to remain safe in these conditions.` }
                ],
                max_tokens: 300  // Adjust for the summary length
            })
        });

        // Check for successful response
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const summaryData = await response.json();

        // Log the response for debugging
        console.log('Groq API Response:', summaryData);

        // Check if the response contains the summarized message
        if (summaryData && summaryData.choices && summaryData.choices[0] && summaryData.choices[0].message.content) {
            const summary = summaryData.choices[0].message.content;

            // Show the summary section and display the summarized flood information
            document.getElementById('summarySection').classList.remove('hidden');
            document.getElementById('floodSummary').innerText = summary;
        } else {
            // Handle cases where no summary is returned
            document.getElementById('summarySection').classList.remove('hidden');
            document.getElementById('floodSummary').innerText = 'No flood-related summary available.';
        }
    } catch (error) {
        console.error("Error with Groq API:", error);

        // Display a user-friendly error message
        document.getElementById('summarySection').classList.remove('hidden');
        document.getElementById('floodSummary').innerText = 'Error fetching summary. Please try again later.';
    }
}


// async function summarizePosts(postData) {
//     const apiKey = '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'; // Replace with your Groq API key
//     const url = 'https://api.groq.com/openai/v1/chat/completions'; // Ensure this is the correct Groq endpoint

//     try {
//         const response = await axios.post(url, {
//             model: 'llama-3.1-70b-versatile', // Use the desired model from Groq's API
//             messages: [
//                 { 
//                     role: 'user', 
//                     content: `Summarize the following flood-related posts focusing on disaster information only:\n\n${postData}`
//                 }
//             ],
//             max_tokens: 300 // Adjust the number of tokens to control the summary length
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${apiKey}`, // Include the API key in the Authorization header
//                 'Content-Type': 'application/json'
//             }
//         });

//         // Return the summarized content from the response
//         return response.data.choices[0].message.content;
//     } catch (error) {
//         console.error('Error with Groq API:', error.response ? error.response.data : error.message);
//         return "Error summarizing the posts.";
//     }
// }

