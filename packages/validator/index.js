const requiredFields = ['id', 'timestamp', 'agent', 'model', 'trigger', 'status'];

const diagnostic = (path, message) => ({ path, message, severity: 'error' });

function parseFrontmatter(markdown) {
  const match = String(markdown).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { error: diagnostic('frontmatter', 'Expected YAML frontmatter between opening and closing --- lines.') };
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator > 0) fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  return { fields, body: match[2] };
}

export function validateAgdr(markdown, { filename = '' } = {}) {
  const parsed = parseFrontmatter(markdown);
  if (parsed.error) return [parsed.error];
  const { fields, body } = parsed;
  const errors = [];
  for (const field of requiredFields) if (!fields[field]) errors.push(diagnostic(`frontmatter.${field}`, `Missing required field '${field}'.`));
  if (fields.id && !/^AgDR-\d{4,}$/.test(fields.id)) errors.push(diagnostic('frontmatter.id', 'ID must match AgDR-NNNN.'));
  if (filename && fields.id && !new RegExp(`^${fields.id}-[a-z0-9-]+\\.md$`).test(filename)) errors.push(diagnostic('filename', 'Filename must match AgDR-NNNN-slug.md.'));
  if (!/^>\s*In the context of.+facing.+I decided.+to achieve.+accepting.+\.\s*$/m.test(body)) errors.push(diagnostic('body', 'Missing the required Y-statement blockquote.'));
  for (const heading of ['## Options Considered', '## Decision']) if (!body.includes(heading)) errors.push(diagnostic('body', `Missing required section '${heading}'.`));
  return errors;
}

export function validateAgdrJson(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [diagnostic('$', 'Expected a JSON object.')];
  for (const field of requiredFields) if (value[field] === undefined) errors.push(diagnostic(field, `Missing required field '${field}'.`));
  if (value.id !== undefined && !/^AgDR-\d{4,}$/.test(value.id)) errors.push(diagnostic('id', 'ID must match AgDR-NNNN.'));
  return errors;
}
