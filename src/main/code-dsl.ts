import { Code, Var, VarObject } from './code-types';
import { toArray } from './code-utils';

const reLf = /\n/g;

let reId: RegExp;

try {
  reId = /^[\p{Letter}_$][\p{Letter}\d_$]*$/u;
} catch {
  reId = /^[a-zA-Z_$][\w$]*$/;
}

const reInt = /^(?:0|[1-9]\d*)$/;

/**
 * Creates a new {@linkcode VarObject}.
 *
 * @param name The name of the variable.
 */
export function createVar(name?: string): VarObject {
  return { type: 'var', name };
}

export function varAssign(v: Var, value: Code): Code {
  return { type: 'varAssign', var: v, children: toArray(value) };
}

export function varDeclare(v: Var, value: Code = []): Code {
  return { type: 'varDeclare', var: v, children: toArray(value) };
}

/**
 * Wraps given property key with quotes if needed so it can be used as a property name in an object declaration.
 *
 * ```ts
 * objectKey('foo bar'); // → '"foo bar"'
 *
 * objectKey('fooBar'); // → 'fooBar'
 *
 * objectKey('0'); // → '0'
 *
 * objectKey('0123'); // → '"0123"'
 * ```
 */
export function objectKey(name: string | number): Code {
  return typeof name === 'string' && !reId.test(name) && !reInt.test(name) ? JSON.stringify(name) : name;
}

/**
 * Returns a property accessor code.
 *
 * ```ts
 * propAccess('obj', 'foo'); // → obj.foo
 *
 * propAccess('obj', 9); // → obj[9]
 *
 * propAccess('obj', 'foo bar', true); // → obj?.["foo bar"]
 * ```
 *
 * @param code The value from which the property is read.
 * @param name The key of the property.
 * @param optional If `true` then optional chaining syntax is used.
 */
export function propAccess(code: Code, name: Var | string | number, optional?: boolean): Code {
  if (typeof name === 'string' && reId.test(name)) {
    return [code, optional ? '?.' : '.', name];
  }
  return [
    code,
    optional ? '?.[' : '[',
    typeof name === 'symbol' || typeof name === 'object' ? name : objectKey(name),
    ']',
  ];
}

/**
 * Returns a doc comment code.
 */
export function docComment(str: unknown): Code {
  return str == null || str === '' ? '' : '\n/**\n * ' + String(str).replace(reLf, '\n * ') + '\n */\n';
}

/**
 * Returns a comment code.
 */
export function comment(str: unknown): Code {
  return str == null || str === '' ? '' : '// ' + String(str).replace(reLf, '\n// ') + '\n';
}
