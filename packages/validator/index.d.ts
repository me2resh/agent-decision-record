export type Diagnostic = { path: string; message: string; severity: 'error' };
export function validateAgdr(markdown: string, options?: { filename?: string }): Diagnostic[];
export function validateAgdrJson(value: unknown): Diagnostic[];
