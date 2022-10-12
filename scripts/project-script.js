"use strict";
const getProject = (dir) => {
    const data = fetch(`/projects/${dir}/project.json`).then((res) => res.json());
    return data;
};
const createElement = (tag, parent, className, text) => {
    const element = document.createElement(tag);
    parent.appendChild(element);
    element.setAttribute("class", className);
    if (text) {
        element.innerText = text;
    }
    return element;
};
const addProjectToDOM = (project) => {
    const { title, description, entry, tags } = project;
    const projectList = document.querySelector(".project-list");
    if (!projectList)
        return console.log("No div with class project-list found");
    const parentNode = createElement("a", projectList, "project");
    parentNode.setAttribute("href", `/projects/${entry}`);
    parentNode.innerHTML = `
    <h2 class="project-title">${title}</h2>
    <div class="tag-container">
      ${tags.map((tag) => `<span class="project-tag">${tag}</span>`).join("")}
    </div>
    <p class="project-description">${description}</p>
  `;
};
const addProjects = async () => {
    const projectJson = await fetch("/projects/projects.json").then((res) => res.json());
    let projects;
    if (window.location.pathname.includes("pages")) {
        projects = projectJson.projects;
    }
    else {
        projects = projectJson.featuredProjects;
    }
    projects.forEach(async (project) => {
        const data = await getProject(project);
        data.entry = project + "/" + data.entry;
        addProjectToDOM(data);
    });
    console.log(projects);
};
addProjects();
