const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const updatedRepository = request.body;
  const error = { error: "Repository does not exists!" };

  if (!id) return response.status(404).json(error);

  const isUuid = validate(id);

  if (!isUuid) return response.status(404).json(error);

  const repository = repositories.find((repository) => repository.id === id);

  if (!repository) return response.status(404).json(error);

  if (updatedRepository.likes) delete updatedRepository.likes;

  repository = {
    ...repository,
    ...updatedRepository,
  };

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0 || !repositories[repositoryIndex]) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const repository = repositories.find((repository) => repository.id === id);

  const likes = repository.likes + 1;

  if (!likes) return response.status(404);

  repository.likes = likes;

  return response.status(200).send({ likes }).json({ likes });
});

module.exports = app;
