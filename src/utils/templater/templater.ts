import pupa from 'pupa'
const templates = require('./templates.json')

export function template (section: string, message: string, data : object): string {
  const template = templates[section]

  if (!data) return template.message
  return pupa(template[message], data);
}