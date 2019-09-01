const express = require("express");

const server = express();

server.use(express.json());

let projects = [];
let requisicoes = 0;

function requisitionsCount(req, res, next) {
  requisicoes++;
  console.log(`Id da Requisições: ${requisicoes}`);
  next();
}

function projectIdNotExists(req, res, next) {
  const { id } = req.params;
  const project = projects.filter(proj => proj.id == id);
  if (!project[0]) {
    return res
      .status(400)
      .json({ erroMessage: "Project does not exists  !!!" });
  }
  req.project = project[0];
  next();
}

function projectIdExists(req, res, next) {
  const { id } = req.body;

  const project = projects.filter(project => project.id == id);
  if (project[0]) {
    return res.status(400).json({ erroMessage: "Project already exists  !!!" });
  }
  next();
}

function projectIdRequired(req, res, next) {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ erroMessage: "Project id is required !!!" });
  }
  next();
}

function projectTitleRequired(req, res, next) {
  const { title } = req.body;
  if (!title) {
    return res
      .status(400)
      .json({ erroMessage: "Project Title is required !!!" });
  }
  next();
}

server.use(requisitionsCount);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", projectIdNotExists, (req, res) => {
  const { project } = req;
  return res.json(project);
});

server.delete("/projects/:id", projectIdNotExists, (req, res) => {
  const { id } = req.params;
  let index = 0;

  projects.map((proj, idx) => {
    if (proj.id == id) {
      index = idx;
    }
  });

  projects.splice(index, 1);
  return res.json({ ok: "Project deleted. " });
});

server.get("/projects/:id/tasks", projectIdExists, (req, res) => {
  const { project } = req;
  return res.json(project.tasks);
});

server.post("/projects/:id/tasks", projectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let index = 0;
  projects.map((proj, idx) => {
    if (proj.id == id) {
      index = idx;
    }
  });

  projects[index].tasks.push(title);

  return res.json(projects[index]);
});

server.post(
  "/projects",
  projectIdRequired,
  projectTitleRequired,
  projectIdExists,
  (req, res) => {
    const project = req.body;
    projects.push(project);
    return res.json(projects);
  }
);

server.put("/projects/:id", projectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projects[id].title = title;
  return res.json(projects);
});

server.listen(3000, () => {
  console.log("Servidor no Ar na porta 3000");
});