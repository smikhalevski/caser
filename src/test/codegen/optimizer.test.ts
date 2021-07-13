import {template as _} from '../../main/codegen/template';
import {countVarRefs, inlineVarAssignments, WalkDirection, walkFragmentChildren} from '../../main/codegen/optimizer';
import {CgNodeType} from '../../main/codegen/ast-types';

describe('walkFragmentChildren', () => {

  test('walks over fragment children', () => {
    const walkerMock = jest.fn();
    const varRef = _.var();

    walkFragmentChildren(_`aaa${varRef}bbb`.children, 0, WalkDirection.FORWARDS, walkerMock);

    expect(walkerMock).toHaveBeenCalledTimes(3);
    expect(walkerMock).toHaveBeenNthCalledWith(1, 'aaa', 0, expect.any(Array));
    expect(walkerMock).toHaveBeenNthCalledWith(2, varRef, 1, expect.any(Array));
    expect(walkerMock).toHaveBeenNthCalledWith(3, 'bbb', 2, expect.any(Array));
  });

  test('walks over retained fragments', () => {
    const walkerMock = jest.fn();
    const varRef = _.var();

    const block = _.block`ccc${varRef}ddd`;
    walkFragmentChildren(_`aaa${block}bbb`.children, 0, WalkDirection.FORWARDS, walkerMock);

    expect(walkerMock).toHaveBeenCalledTimes(6);
    expect(walkerMock).toHaveBeenNthCalledWith(1, 'aaa', 0, expect.any(Array));
    expect(walkerMock).toHaveBeenNthCalledWith(2, block, 1, expect.any(Array));
    expect(walkerMock).toHaveBeenNthCalledWith(3, 'ccc', 0, expect.any(Array));
    expect(walkerMock).toHaveBeenNthCalledWith(4, varRef, 1, expect.any(Array));
    expect(walkerMock).toHaveBeenNthCalledWith(5, 'ddd', 2, expect.any(Array));
    expect(walkerMock).toHaveBeenNthCalledWith(6, 'bbb', 2, expect.any(Array));
  });

  test('walks over variable assignments', () => {
    const walkerMock = jest.fn();
    const varRef = _.var();
    const block = _.block`ccc${varRef}ddd`;
    const varAssignment = _.assignment(varRef, block);

    walkFragmentChildren(_`aaa${varAssignment}bbb`.children, 0, WalkDirection.FORWARDS, walkerMock);

    expect(walkerMock).toHaveBeenCalledTimes(7);
    expect(walkerMock).toHaveBeenNthCalledWith(1, 'aaa', 0, expect.any(Array));
    expect(walkerMock).toHaveBeenNthCalledWith(2, varAssignment, 1, expect.any(Array));
    expect(walkerMock).toHaveBeenNthCalledWith(3, block, 0, expect.any(Array));
    expect(walkerMock).toHaveBeenNthCalledWith(4, 'ccc', 0, expect.any(Array));
    expect(walkerMock).toHaveBeenNthCalledWith(5, varRef, 1, expect.any(Array));
    expect(walkerMock).toHaveBeenNthCalledWith(6, 'ddd', 2, expect.any(Array));
    expect(walkerMock).toHaveBeenNthCalledWith(7, 'bbb', 2, expect.any(Array));
  });
});

describe('countVarRefs', () => {

  test('returns 0 if var was not referenced', () => {
    const varRef = _.var();
    expect(countVarRefs(_``.children, 0, '')).toBe(0);
    expect(countVarRefs(_`${varRef}`.children, 0, 'aaa')).toBe(0);
  });

  test('returns 1 if var was referenced once', () => {
    const varRef = _.var();
    expect(countVarRefs(_`${varRef}`.children, 0, varRef.varId)).toBe(1);
  });

  test('returns 2 if var was referenced more then once', () => {
    const varRef = _.var();
    expect(countVarRefs(_`${varRef}${varRef}`.children, 0, varRef.varId)).toBe(2);
    expect(countVarRefs(_`${varRef}${varRef}${varRef}`.children, 0, varRef.varId)).toBe(2);
  });

  test('counts vars in nested blocks', () => {
    const varRef = _.var();
    expect(countVarRefs(_`${_.block`${varRef}`}`.children, 0, varRef.varId)).toBe(1);
    expect(countVarRefs(_`${varRef}${_.block`${_.block`${varRef}`}`}${varRef}`.children, 0, varRef.varId)).toBe(2);
  });
});

describe('inlineVarAssignments', () => {

  test('removes unused assignment', () => {
    const varRef = _.var();
    const block = _.block`aaa${_.assignment(varRef, 'AAA')}bbb`;

    inlineVarAssignments(block);

    expect(block.children).toEqual(['aaa', '', 'bbb']);
  });

  test('removes unused assignment if it uses the assigned var', () => {
    const varRef = _.var();
    const block = _.block`aaa${_.assignment(varRef, _`${varRef}AAA`)}bbb`;

    inlineVarAssignments(block);

    expect(block.children).toEqual(['aaa', '', 'bbb']);
  });

  test('inlines var assignment that uses assigned var', () => {
    const varRef = _.var();
    const block = _.block`aaa${_.assignment(varRef, _`${varRef}AAA`)}bbb${varRef}`;

    inlineVarAssignments(block);

    expect(block.children).toEqual(['aaa', '', 'bbb', '', '', varRef, 'AAA', '']);
  });

  test('inlines single var assignment', () => {
    const varRef = _.var();
    const block = _.block`aaa${_.assignment(varRef, 'AAA')}bbb${varRef}`;

    inlineVarAssignments(block);

    expect(block.children).toEqual(['aaa', '', 'bbb', '', 'AAA', '']);
  });

  test('inlines var assignment if var was already referenced', () => {
    const varRef = _.var();
    const block = _.block`${varRef}aaa${_.assignment(varRef, 'AAA')}bbb${varRef}`;

    inlineVarAssignments(block);

    expect(block.children).toEqual(['', varRef, 'aaa', '', 'bbb', '', 'AAA', '']);
  });

  test('inlines var assignment in scope of an enclosing block', () => {
    const varRef = _.var();
    const block = _.block`aaa${_.block`${_.assignment(varRef, 'AAA')}bbb${varRef}`}ccc${varRef}`;

    inlineVarAssignments(block);

    expect(block.children).toEqual([
      'aaa',
      {
        nodeType: CgNodeType.FRAGMENT,
        retained: true,
        children: ['', '', 'bbb', '', 'AAA', ''],
      },
      'ccc',
      varRef,
      '',
    ]);
  });

  test('inlines var assignment into another assignment', () => {
    const varRef1 = _.var();
    const varRef2 = _.var();
    const block = _.block`aaa${_.assignment(varRef1, 'AAA')}${_.assignment(varRef2, _`BBB${varRef1}CCC`)}${varRef2}${varRef2}`;

    inlineVarAssignments(block);

    expect(block.children).toEqual([
      'aaa',
      '',
      '',
      {
        nodeType: 'VAR_ASSIGNMENT',
        retained: false,
        varId: varRef2.varId,
        children: ['BBB', '', 'AAA', 'CCC'],
      },
      '',
      varRef2,
      '',
      varRef2,
      '',
    ]);
  });

  test('inlines sequential assignments', () => {
    const varRef = _.var();
    const block = _.block`${_.assignment(varRef, 'AAA')}${_.assignment(varRef, _`${varRef}BBB`)}${varRef}`;

    inlineVarAssignments(block);

    expect(block.children).toEqual(['', '', '', '', '', '', '', '', 'AAA', 'BBB', '']);
  });

  test('preserves retained var assignment', () => {
    const varRef = _.var();
    const block = _.block`${_.assignment(varRef, 'AAA', true)}${varRef}`;

    inlineVarAssignments(block);

    expect(block.children).toEqual([
      '',
      {
        nodeType: 'VAR_ASSIGNMENT',
        retained: true,
        varId: varRef.varId,
        children: ['AAA'],
      },
      '',
      {
        nodeType: 'VAR_REF',
        recyclable: false,
        varId: varRef.varId,
      },
      '',
    ]);
  });

  test('preserves retained var assignment even if var is not referenced', () => {
    const varRef = _.var();
    const block = _.block`${_.assignment(varRef, 'AAA', true)}`;

    inlineVarAssignments(block);

    expect(block.children).toEqual([
      '',
      {
        nodeType: 'VAR_ASSIGNMENT',
        retained: true,
        varId: varRef.varId,
        children: ['AAA'],
      },
      '',
    ]);
  });
});
