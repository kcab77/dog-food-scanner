require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3002;
const PETS_FILE = path.join(__dirname, 'data', 'pets.json');
const CONVOS_DIR = path.join(__dirname, 'data', 'conversations');

if (!fs.existsSync(CONVOS_DIR)) fs.mkdirSync(CONVOS_DIR, { recursive: true });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Pet storage ─────────────────────────────────────────────────────────────
function loadPets() {
  try { return JSON.parse(fs.readFileSync(PETS_FILE, 'utf8')); } catch { return {}; }
}

function savePets(pets) {
  fs.writeFileSync(PETS_FILE, JSON.stringify(pets, null, 2));
}

// ── Conversation storage ─────────────────────────────────────────────────────
function loadConvo(petId) {
  const file = path.join(CONVOS_DIR, `${petId}.json`);
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
}

function saveConvo(petId, messages) {
  const file = path.join(CONVOS_DIR, `${petId}.json`);
  // Keep last 200 messages per pet
  const trimmed = messages.slice(-200);
  fs.writeFileSync(file, JSON.stringify(trimmed, null, 2));
}

// ── System prompt ────────────────────────────────────────────────────────────
function buildSystemPrompt(pet) {
  return `You are a knowledgeable holistic pet health assistant. You help pet owners make informed decisions about their pet's health, nutrition, supplements, and wellness.

You are currently helping with a pet named ${pet.name}.

Pet Profile:
- Name: ${pet.name}
- Species: ${pet.species}
- Breed: ${pet.breed || 'Unknown'}
- Age: ${pet.age || 'Unknown'}
- Weight: ${pet.weight ? pet.weight + ' lbs' : 'Unknown'}
- Sex: ${pet.sex || 'Unknown'}
- Health Conditions: ${pet.conditions || 'None listed'}
- Current Medications: ${pet.medications || 'None listed'}
- Current Supplements: ${pet.supplements || 'None listed'}
- Diet: ${pet.diet || 'Not specified'}
- Notes: ${pet.notes || 'None'}

Guidelines:
- Always give advice specific to ${pet.name}'s profile above
- Be honest when something lacks scientific evidence
- Flag any ingredient or product that could interact with their listed medications
- Always recommend consulting a vet for serious health concerns
- When discussing supplements or products, consider their weight and health conditions
- Be conversational and caring — pet owners love their animals deeply
- If asked about a product, evaluate it against ${pet.name}'s specific profile`;
}

// ── Routes ───────────────────────────────────────────────────────────────────

// Create a new pet profile
app.post('/api/pets', (req, res) => {
  const { name, species, breed, age, weight, sex, conditions, medications, supplements, diet, notes } = req.body;
  if (!name || !species) return res.status(400).json({ error: 'Name and species are required' });

  const pets = loadPets();
  const petId = uuidv4();
  pets[petId] = { petId, name, species, breed, age, weight, sex, conditions, medications, supplements, diet, notes, createdAt: new Date().toISOString() };
  savePets(pets);
  res.json({ petId, pet: pets[petId] });
});

// Get all pets
app.get('/api/pets', (req, res) => {
  const pets = loadPets();
  res.json(Object.values(pets));
});

// Get a single pet
app.get('/api/pets/:petId', (req, res) => {
  const pets = loadPets();
  const pet = pets[req.params.petId];
  if (!pet) return res.status(404).json({ error: 'Pet not found' });
  res.json(pet);
});

// Update a pet profile
app.put('/api/pets/:petId', (req, res) => {
  const pets = loadPets();
  if (!pets[req.params.petId]) return res.status(404).json({ error: 'Pet not found' });
  pets[req.params.petId] = { ...pets[req.params.petId], ...req.body };
  savePets(pets);
  res.json(pets[req.params.petId]);
});

// Delete a pet
app.delete('/api/pets/:petId', (req, res) => {
  const pets = loadPets();
  if (!pets[req.params.petId]) return res.status(404).json({ error: 'Pet not found' });
  delete pets[req.params.petId];
  savePets(pets);
  // Also delete their conversation
  const file = path.join(CONVOS_DIR, `${req.params.petId}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  res.json({ success: true });
});

// Get conversation history for a pet
app.get('/api/pets/:petId/chat', (req, res) => {
  const pets = loadPets();
  if (!pets[req.params.petId]) return res.status(404).json({ error: 'Pet not found' });
  const messages = loadConvo(req.params.petId);
  res.json(messages);
});

// Clear conversation history
app.delete('/api/pets/:petId/chat', (req, res) => {
  saveConvo(req.params.petId, []);
  res.json({ success: true });
});

// Send a message (streaming)
app.post('/api/pets/:petId/chat', async (req, res) => {
  const pets = loadPets();
  const pet = pets[req.params.petId];
  if (!pet) return res.status(404).json({ error: 'Pet not found' });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const history = loadConvo(req.params.petId);
  history.push({ role: 'user', content: message });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let fullReply = '';

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      system: buildSystemPrompt(pet),
      messages: history,
    });

    stream.on('text', (text) => {
      fullReply += text;
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    });

    await stream.finalMessage();

    history.push({ role: 'assistant', content: fullReply });
    saveConvo(req.params.petId, history);

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error(err);
    res.write(`data: ${JSON.stringify({ error: 'Something went wrong' })}\n\n`);
    res.end();
  }
});

app.listen(PORT, () => console.log(`Pet Health Assistant running at http://localhost:${PORT}`));
