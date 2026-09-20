export type Diagnostic = { path: string; message: string; severity: 'error' };
export const agdrSchema: Record<string, unknown>;
export function validateAgdr(markdown: string, options?: { filename?: string }): Diagnostic[];
export function validateAgdrJson(value: unknown): Diagnostic[];
