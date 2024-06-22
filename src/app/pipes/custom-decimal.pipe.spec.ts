import { CustomDecimalPipe } from './custom-decimal.pipe';

describe('CustomDecimalPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomDecimalPipe();
    expect(pipe).toBeTruthy();
  });
});
