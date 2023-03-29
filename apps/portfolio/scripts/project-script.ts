// Typescipt type definitions

// Type for each project in projects.json
interface jsonProject {
  id: string;
  title: string;
  description: string;
  root: string;
  entry: string;
  github: string;
  tags: string[];
}

// Type for projects.json
interface projectsJson {
  projects: jsonProject[];
  featured: string[];
}

// Global variable which holds the div where all projects will be added
const projectList = document.querySelector('.project-list');

/**
 *
 * @param tag The type of element to create
 * @param parent The parent element to append the new element to
 * @param classNames An array of class names to add to the new element
 * @returns The newly created element
 * @description Creates a new element and appends it to the parent element
 */
const appendElement = (tag: string, parent: Element, text: string, ...classNames: string[]) => {
  const element = document.createElement(tag);
  parent.appendChild(element);
  // Sets the text of the element if text is provided
  if (text) element.textContent = text;
  // Adds all the classes to the element if any were provided
  if (classNames) element.classList.add(...classNames);
  return element;
};

/**
 *
 * @param project The project to add to the DOM
 * @returns {void}
 * @description Adds a project to the DOM in the div with the class "project-list"
 */
const addProjectToDOM = (project: jsonProject) => {
  // Object destructuring to get all the properties of the project
  const { title, description, root, entry, tags, github } = project;
  // Check if projectList exists otherwise return
  if (!projectList) return console.log('No div with class project-list found');

  const parentNode = appendElement('a', projectList, '', 'project');

  // Add the href attribute to the project element which links to
  // the project entry point meaning the entire "card" is clickable
  parentNode.setAttribute('href', `/projects/${root}/${entry}`);

  appendElement('h2', parentNode, title, 'project-title');

  // Create a div to hold project tags and then loop through the tags
  // and add them to the container
  const tagContainer = appendElement('div', parentNode, '', 'tag-container');
  tags.forEach(tag => appendElement('span', tagContainer, tag, 'project-tag'));
  const githubLink = appendElement('a', parentNode, '', 'project-link');
  githubLink.setAttribute('href', github);
  const githubLogo = appendElement('img', githubLink, '', 'project-icon');
  githubLogo.setAttribute('src', `/icons/${root}.png`);
  appendElement('p', parentNode, description, 'project-description');

  /* 
    The above code creates a html structure like this:
    <h2 class="project-title">${title}</h2>
    <div class="tag-container">
      <span class="project-tag">${tag}</span>
      <span class="project-tag">${tag}</span>
    </div>

    <p class="project-description">${description}</p>
  */
};

const addProjects = async (featuredOnly: boolean) => {
  const projectJson: projectsJson = await fetch('/projects/projects.json').then(res => res.json());

  let projects: jsonProject[];

  if (featuredOnly) {
    projects = projectJson.projects.filter((project: jsonProject) => projectJson.featured.includes(project.id));
  } else {
    projects = projectJson.projects;
  }

  projects.forEach(project => addProjectToDOM(project));
};

export default addProjects;
