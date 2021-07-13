import {cg, compileTsSource} from '../../main';

describe('', () => {

  test('', () => {
    const v1 = cg.var();
    const v2 = cg.var();

    const node = cg(
        cg.block(
            cg.let(v1, 'aaa'),
            cg.block(v1, 'qqq'),
        ),
        cg.block(
            cg.let(v2, 'bbb'),
            cg.block(v2, 'qqq'),
        ),
    );

    expect(compileTsSource(node)).toBe('');
  });
});
