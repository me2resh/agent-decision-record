import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import yaml from 'js-yaml';
import agdrSchema from './schema/agdr.schema.json' with { type: 'json' };

const diagnostic = (path, message) => ({ path, message, severity: 'error' });
const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const filenamePattern = /^(AgDR-\d{4,})-[a-z0-9-]+\.md$/;
const requiredHeadings = ['## Options Considered', '## Decision'];

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateSchema = ajv.compile(agdrSchema);

function parseFrontmatter(markdown) {
  const match = String(markdown).match(frontmatterPattern);
  if (!match) return { error: diagnostic('frontmatter', 'Expected YAML frontmatter between opening and closing --- lines.') };
  let fields;
  try {
    fields = yaml.load(match[1], { schema: yaml.JSON_SCHEMA }) || {};
  } catch (error) {
    return { error: diagnostic('frontmatter', `Invalid YAML: ${error.message}`) };
  }
  return { fields, body: match[2] };
}

function schemaDiagnostics(fields) {
  if (validateSchema(fields)) return [];
  return validateSchema.errors.map((error) => {
    const path = error.instancePath ? error.instancePath.replace(/^\//, '').replaceAll('/', '.') : '$';
    return diagnostic(`frontmatter${path === '$' ? '' : `.${path}`}`, error.message || 'Schema validation failed.');
  });
}

export function validateAgdr(markdown, { filename = '' } = {}) {
  const parsed = parseFrontmatter(markdown);
  if (parsed.error) return [parsed.error];
  const { fields, body } = parsed;
  const errors = schemaDiagnostics(fields);
  if (filename) {
    const filenameMatch = filename.match(filenamePattern);
    if (!filenameMatch) errors.push(diagnostic('filename', 'Filename must match AgDR-NNNN-slug.md.'));
    else if (fields && fields.id && fields.id !== filenameMatch[1]) errors.push(diagnostic('filename', 'Filename prefix must match frontmatter id.'));
  }
  if (!/^>\s*In the context of.+facing.+I decided.+to achieve.+accepting.+\.\s*$/m.test(body)) {
    errors.push(diagnostic('body', 'Missing the required Y-statement blockquote.'));
  }
  for (const heading of requiredHeadings) if (!body.includes(heading)) errors.push(diagnostic('body', `Missing required section '${heading}'.`));
  return errors;
}

export function validateAgdrJson(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [diagnostic('$', 'Expected a JSON object.')];
  return schemaDiagnostics(value);
}

export { agdrSchema };
