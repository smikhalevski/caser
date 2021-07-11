import {countVarRefs, inlineVars, ts} from '../../main/cg/cg-dsl';

describe('ts', () => {

  test('', () => {
    const var1 = ts.var();
    const var2 = ts.var();

    const a = ts`aaa${ts.let(var1, ts`AAA`)}bbb${ts.let(var2, ts`XXX${var1}ZZZ`)}ccc${var2}`;

    inlineVars(a.children)

    // const q = countVarRefs(a.children, 0, leVar.id);

    expect(a).toBe('')
  })
});
