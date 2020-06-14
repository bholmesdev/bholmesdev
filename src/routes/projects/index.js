const pug = require('pug')
const projects = require('../project-list')

module.exports = () => {
  const projectsByCategory = projects.reduce((groupedByCategory, project) => {
    groupedByCategory[project.category] = [
      ...(groupedByCategory[project.category] || []),
      project,
    ]
    return groupedByCategory
  }, {})

  return pug.renderFile(__dirname + '/page.pug', {
    projects: projectsByCategory,
    projectsFlat: projects,
  })
}
