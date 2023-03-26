import addProjects from './project-script';

const main = async () => {
  await addProjects(false);
  const projects = document.querySelectorAll<HTMLDivElement>('.project');
  projects.forEach(project => {
    project.addEventListener('mouseover', () => {
      const description = project.lastChild as HTMLParagraphElement | null;
      if (description) description.style.height = description.scrollHeight + 'px';
    });

    project.addEventListener('mouseout', () => {
      const description = project.lastChild as HTMLParagraphElement | null;
      if (description) description.style.height = '2.5rem';
    });
  });
};

main();
