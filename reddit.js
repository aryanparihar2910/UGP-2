// Function to convert Unix timestamp to a readable date
function formatDate(utcSeconds) {
  const date = new Date(utcSeconds * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
// Function to summarize posts using Groq API
async function summarizePosts(postData) {
  const apiKey = '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'; // Replace with your Groq API key
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  try {
    const response = await axios.post(url, {
      model: 'llama-3.1-70b-versatile', // Use the desired model
      messages: [
        { role: 'user', content: `Summarize the following flood-related posts focusing on disaster information only:\n\n${postData}.`  }
      ],
      max_tokens: 300 // Adjust for the summary length
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content; // Return the summarized content
  } catch (error) {
    console.error('Error with Groq API:', error.response ? error.response.data : error.message);
    return "Error summarizing the posts.";
  }
}


async function fetchRedditPosts() {
  const city = document.getElementById('city-input').value.trim();
  if (!city) {
    document.getElementById('results').innerHTML = '<p class="text-red-500">Please enter a city name.</p>';
    return;
  }

  const searchQuery = `flood "${city}" (heavy rainfall OR river OR evacuations OR emergency OR storm)`;
  const subreddits = "r/weather,r/floods,r/naturaldisasters,r/news,r/environment";
  const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(searchQuery)}&restrict_sr=on&sort=new&subreddit=${subreddits}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    const posts = data.data.children.slice(0, 5); // Get the first 5 posts to reduce payload size

    document.getElementById('results').innerHTML = '';
    if (posts.length === 0) {
      document.getElementById('results').innerHTML = '<p>No relevant posts found.</p>';
      return;
    }

    let postData = '';
    posts.forEach(post => {
      postData += `Title: ${post.data.title}\n`;
      if (post.data.selftext) {
        // Limit the length of selftext to 500 characters
        postData += `Text: ${post.data.selftext.substring(0, 500)}...\n`;
      }
    });

    // Get the summary from the Groq API
    const summary = await summarizePosts(postData);
    document.getElementById('summary').innerHTML = `<h2 class="text-xl font-bold mt-5">Flood Summary</h2><p>${summary}</p>`;

    // Display the posts
    posts.forEach(post => {
      const postDate = formatDate(post.data.created_utc);
      const postHtml = `
        <div class="p-4 mb-4 border rounded-md bg-white shadow">
          <h2 class="text-xl font-bold">${post.data.title}</h2>
          <p class="text-sm text-gray-500">Upvotes: ${post.data.ups}</p>
          <p class="text-sm text-gray-500">Posted on: ${postDate}</p>
          <a href="https://reddit.com${post.data.permalink}" target="_blank" class="text-blue-500">View Post</a>
        </div>
      `;
      document.getElementById('results').innerHTML += postHtml;
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    document.getElementById('results').innerHTML = `<p>Error fetching posts: ${error.message}</p>`;
  }
}
