const express = require("express");
const cors = require("cors");
const { v4: uuidv4, validate: isUuid } = require('uuid')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuidv4(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) { return response.status(400).json({ message: 'Repository does not exist' }) }

  const { title, url, techs } = request.body;

  const repIndex = repositories.findIndex(repository => repository.id === id)

  if (repIndex === -1) {
    return response.status(400).json({ message: 'Repository does not exist' })
  }

  const repository = {
    ...repositories[repIndex],
    title,
    url,
    techs,
  };

  repositories.splice(repIndex, 1, repository);

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) { return response.status(400).json({ message: 'Repository does not exist' }) }

  const repIndex = repositories.findIndex(repository => repository.id === id);

  if (repIndex === -1) {
    return response.status(400).json({ message: 'Repository does not exist' })
  }

  repositories.splice(repIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) { return response.status(400).json({ message: 'Repository does not exist' }) }

  const repIndex = repositories.findIndex(repository => repository.id === id);

  if (repIndex === -1) {
    return response.status(400).json({ message: 'Repository does not exist' })
  }

  const oldRepo = repositories[repIndex];

  const repository = {
    ...oldRepo,
    likes: oldRepo.likes + 1
  }

  repositories.splice(repIndex, 1, repository);

  return response.status(200).json(repository);
});

module.exports = app;
