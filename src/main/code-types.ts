/**
 * The placeholder that denotes a variable reference in a code fragment.
 */
export type Var = symbol;

/**
 * The variable declaration.
 */
export interface VarDeclare {
  type: 'varDeclare';
  var: Var;
  children: Code[];
}

/**
 * The variable assignment.
 */
export interface VarAssign {
  type: 'varAssign';
  var: Var;
  children: Code[];
}

/**
 * The code fragment.
 */
export type Code = Code[] | Var | VarDeclare | VarAssign | string | number | boolean | null | undefined;

/**
 * Var-value pair.
 */
export type Binding = [Var, unknown];

/**
 * Returns the unique variable name.
 */
export type VarRenamer = (v: Var) => string;
