import {FragmentChild, IFragmentCgNode, IVarAssignmentCgNode, IVarRefCgNode} from './ast-types';

/**
 * Child that can be processed by the codegen tag.
 */
export type CgTemplateChild = Array<FragmentChild> | FragmentChild | number | boolean | null | undefined;

/**
 * The template string tag that produces the codegen nodes.
 */
export interface ICgTemplate {

  /**
   * Creates a new fragment.
   */
  (strs: TemplateStringsArray | CgTemplateChild, ...params: Array<CgTemplateChild>): IFragmentCgNode;

  /**
   * Creates a new retained fragment. It creates a scope in which {@link IVarAssignmentCgNode} would to be inlined
   * during optimization. Usually this should be used to markup code blocks in the source.
   */
  block(strs: TemplateStringsArray | CgTemplateChild, ...params: Array<CgTemplateChild>): IFragmentCgNode;

  /**
   * Returns the new variable assignment.
   *
   * @param varRef The variable that is being assigned.
   * @param value The value that is assigned to the variable.
   * @param retained If `true` then this assignment would always be preserved in the output. Otherwise it can be inlined
   *     if used once or removed if unused.
   */
  assignment(varRef: IVarRefCgNode, value: CgTemplateChild, retained?: boolean): IVarAssignmentCgNode;

  /**
   * Returns the new variable reference.
   */
  var(): IVarRefCgNode;
}
