import {countVarRefs, inlineVars, ts} from '../main/ts-dsl';

describe('ts', () => {

  test('', () => {
    const var1 = ts.var();
    const var2 = ts.var();

    const a = ts`aaa${ts.assign(var1, ts`AAA`)}bbb${ts.assign(var2, ts`XXX${var1}ZZZ`)}ccc${var2}`;

    inlineVars(a.children)

    // const q = countVarRefs(a.children, 0, leVar.id);

    expect(a).toBe('')
  })
});
