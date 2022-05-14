// tests/mock.test.js
const fn = mock.fn()

expect(fn).not.toHaveBeenCalled()

fn()
expect(fn).toHaveBeenCalled()
