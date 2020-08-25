const express = require("express");
const cors = require("cors");
const {
  v4: uuid
} = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const {
    title
  } = request.query;

  const results = title ?
    repositories.filter(repository => repository.title.includes(title)) :
    repositories;

  return response.json(results);

});

app.post("/repositories", (request, response) => {
  const {
    title,
    url,
    techs
  } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes:0
  };
  repositories.push(repository);

  return response.json(repository)

});

app.put("/repositories/:id", (request, response) => {
  const {
    id
  } = request.params;

  const {
    title,
    url,
    techs
  } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if (repositoryIndex < 0) {
    return response.status(400).json({
      error: 'Not found'
    });
  };

  const likes = repositories[repositoryIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});


app.delete("/repositories/:id", (request, response) => {
  const {
    id
  } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if (repositoryIndex < 0) {
    return response.status(400).json({
      error: 'Not found'
    });
  };

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json({
    message: 'successfully deleted'
  });
});

app.post("/repositories/:id/like", (request, response) => {
  const {
    id
  } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if (repositoryIndex < 0) {
    return response.status(400).json({
      error: 'Not found'
    });
  };
  const repository = repositories[repositoryIndex];

  const newRepository = {
    ...repository,
    likes: repository.likes + 1
  };

  repositories[repositoryIndex] = newRepository;
  return response.status(200).json(newRepository);
});

module.exports = app;