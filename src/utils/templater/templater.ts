import pupa from 'pupa'
const templates = require('./templates.json')

/**
 * Templates flexible text
 * 
 * @param section {string} Section name from json
 * @param message {string} Message name from json
 * @param data {object} Template data
 * @returns Templated text
 */
export function template (section: string, message: string, data : object): string {
  const template = templates[section]

  if (!data) return template.message
  return pupa(template[message], data);
}