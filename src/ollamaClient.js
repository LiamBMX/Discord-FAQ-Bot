const fs = require('fs');
const config = require('../config.json');

function buildContextFromKnowledge(data) {
  let context = '';

  if (data.base && data.base.text) {
    context += `Base Page Text:\n${data.base.text}\n\n`;
  }

  if (data.linkedPages && data.linkedPages.length > 0) {
    context += 'Linked Pages:\n';
    for (const page of data.linkedPages) {
      if (page.data && page.data.text) {
        context += `URL: ${page.url}\nText: ${page.data.text}\n\n`;
      }
    }
  }

  return context;
}

async function queryOllama(question) {
  let knowledgeRaw;
  try {
    knowledgeRaw = fs.readFileSync('./data/knowledge.json', 'utf8');
  } catch (error) {
    console.error("Error reading knowledge file:", error);
    return "Knowledge base not available.";
  }

  let knowledgeObj;
  try {
    knowledgeObj = JSON.parse(knowledgeRaw);
  } catch (error) {
    console.error("Error parsing knowledge JSON:", error);
    return "Knowledge base is corrupted."; 
  }

  const context = buildContextFromKnowledge(knowledgeObj);

  try {
    const response = await fetch(config.ollama_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.ollama_model,
        prompt: `You are a discord support bot for the website ${config.website_url} Take this context scraped from the website and use it to answer the users question, keep your response short but informative aswell as formal but not too "roboty". Context: ${context}\n\nUser: ${question}\nAI:`,
    }),
    });

    const text = await response.text();

    let responses = [];
    let lines = text.split('\n').filter(line => line.trim() !== '');
    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        responses.push(json.response);
        if (json.done === true) break;
      } catch (e) {
        console.error("Error parsing line:", line);
      }
    }

    return responses.join('');
  } catch (error) {
    console.error("Error querying Ollama:", error);
    return "There was an issue processing your request.";
  }
}

module.exports = { queryOllama };
