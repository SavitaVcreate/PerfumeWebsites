import { Dummy } from './dummy';

describe('Dummy', () => {
  it('should create an instance', () => {
    const directive = new Dummy();
    expect(directive).toBeTruthy();
  });
});
