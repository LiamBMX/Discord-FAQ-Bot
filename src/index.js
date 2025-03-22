require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { scrapeWebsite } = require('./scraper');
const { queryOllama } = require('./ollamaClient');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    await scrapeWebsite();
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.mentions.has(client.user)) return; 

    const question = message.content.replace(`<@${client.user.id}>`, '').trim();
    if (!question) return message.reply("Ask me a question!");

    try {
        const response = await queryOllama(question);
        message.reply(response);
    } catch (error) {
        console.error(error);
        message.reply("Error connecting to Ollama API.");
    }
});

client.login(process.env.DISCORD_TOKEN);
