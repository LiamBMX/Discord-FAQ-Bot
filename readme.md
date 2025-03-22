---
# Discord FAQ Bot

A configurable, open-source Discord bot that scrapes a website to build a comprehensive knowledge base and uses the Ollama API to provide support or answer FAQs in your Discord server.
Note: The bot may have flaws in the responses, keep in mind is is ai so I reccomend using a ollama model that works best for your situation as responses may vary for each model

## Features

- **Advanced Web Scraping:** Automatically scrapes the main website along with internal linked pages, extracting text, anchors, and button details.
- **Configurable Knowledge Base:** Incorporates extra knowledge provided in `config.json`.
- **AI Integration:** Uses the Ollama API to generate context-aware responses based on the scraped website content.
- **Modular & Open-Source:** Easily configurable and extendable to support additional features.

## Project Structure

```
/discord-bot
│── /data                 # Folder where scraped knowledge is stored
│── /src
│   │── index.js          # Main bot entry point
│   │── scraper.js        # Scrapes website content and linked pages
│   │── ollamaClient.js   # Wraps the Ollama API calls and handles streamed responses
│── config.json           # User configuration (website URL, extra knowledge, API details)
│── .env                  # Environment variables (Discord bot token)
│── package.json          # Project dependencies and scripts
│── README.md             # This file
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or later)
- A Discord account
- A Discord bot token (create one via the [Discord Developer Portal](https://discord.com/developers/applications))
- Ollama API running locally (or a reachable Ollama endpoint)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/discord-faq-bot.git
   cd discord-faq-bot
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up the Environment Variables:**

   Create a `.env` file in the root directory with the following content:

   ```env
   DISCORD_TOKEN=your-discord-bot-token
   ```

   Replace `your-discord-bot-token` with your actual Discord bot token.

4. **Configure the Bot:**

   Edit the `config.json` file to update the following settings:

   ```json
   {
     "website_url": "https://example.com",
     "extra_knowledge": "This bot provides FAQ support for Example.com. It answers common questions using scraped data.",
     "ollama_url": "http://localhost:11434/api/generate",
     "ollama_model": "mistral"
   }
   ```

   - **website_url:** The main website URL to scrape.
   - **extra_knowledge:** Additional context you want the bot to consider.
   - **ollama_url:** The endpoint for the Ollama API.
   - **ollama_model:** The default model for generating responses.

## How It Works

1. **Startup:**  
   When the bot starts (`node src/index.js`), it scrapes the website defined in `config.json` using Puppeteer. The scraped data—including the main page content and linked pages—is stored in the `/data/knowledge.json` file.

2. **Message Handling:**  
   When a user sends a message (mentioning the bot or replying to the bot), the bot uses the stored knowledge as context. It then sends the combined text (scraped website content and extra knowledge) along with the user’s question to the Ollama API via `ollamaClient.js`.

3. **Response Generation:**  
   The Ollama API returns a streamed JSON response. The client aggregates these responses and sends the final answer back to the Discord channel.

## Running the Bot

Start the bot by running:

```bash
node src/index.js
```

You should see output confirming that the bot is logged in and that the website data was scraped successfully.

## Troubleshooting

- **Scraping Errors:**  
  Ensure that the website URL in `config.json` is correct and that Puppeteer can access it.  
- **Ollama API Errors:**  
  Verify that your Ollama API is running and reachable at the URL specified in `config.json`.  
- **Discord Bot Issues:**  
  Double-check your `.env` file and ensure the Discord bot token is valid.

## Contributions

Contributions are welcome! Please fork the repository and submit a pull request with your improvements or bug fixes.

---
