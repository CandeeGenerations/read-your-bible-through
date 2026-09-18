/*
 * The one place `jose` is loaded. From v5 onwards it ships as ESM only, and this server is
 * `"type": "commonjs"`, so it cannot be imported at the top of a file - `tsc` rejects it with
 * TS1479. A dynamic import is the supported way across that boundary, and `module: node16`
 * emits it as a real `import()` rather than downlevelling it to a `require()`.
 *
 * The promise is memoised, not the module: two sign-ins arriving together must not start two
 * imports, and `??=` on a promise is what makes the second one wait on the first.
 */
// The `resolution-mode` attribute tells `tsc` to read jose's ESM types from a CommonJS file;
// without it the type import fails with TS1542 even though the value import above is fine.
export type Jose = typeof import('jose', {with: {'resolution-mode': 'import'}})

let josePromise: Promise<Jose> | undefined

export const loadJose = (): Promise<Jose> => (josePromise ??= import('jose'))
