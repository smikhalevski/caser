import {cg} from '../../main/cg/cg-template';
import {compileTsSource} from '../../main/cg/cg-compiler';

describe('ts', () => {

  test('', () => {

    const parentValueVar = cg.var();


    const indexVar = cg.var();
    const valueVar = cg.var();
    const qqqVar = cg.var();

    const n = cg.block`export function validateFoo(${parentValueVar}){${cg(
        cg.block`if(Array.isArray(${parentValueVar})){${cg(
            cg.block`for(${indexVar}=0;${indexVar}<${parentValueVar}.length;${indexVar}++){${cg(
                cg.let(valueVar, cg`arr[${indexVar}]`),
                cg`r.isArr(${valueVar})`,
            )}}`,
            cg.let(qqqVar, cg`123`),
        )}}`,
    )}}`;

    expect(compileTsSource(n)).toBe('');
  });
});
