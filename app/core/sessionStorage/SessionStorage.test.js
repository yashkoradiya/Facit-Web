import * as sessionStorage from './index';

describe('Session Storage', () => {
  it('should set an item', () => {
    sessionStorage.setItem('testKey', { foo: 'bar' });
    const storedValue = sessionStorage.getItem('testKey');
    expect(storedValue).not.toBeNull();
  });

  it('should remove item', () => {
    sessionStorage.setItem('testKey', { foo: 'bar' });
    sessionStorage.removeItem('testKey');
    const removedValue = sessionStorage.getItem('testKey');
    expect(removedValue).toBeNull();
    sessionStorage.clear();
  });
});
