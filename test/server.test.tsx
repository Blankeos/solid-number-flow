import { describe, expect, it } from 'vitest';
import { renderToString } from 'solid-js/web';
import NumberFlow from 'src';

describe('Hello', () => {
  it('renders a hello component', () => {
    const string = renderToString(() => <NumberFlow value={123} />);
    expect(string).toContain('123');
  });
});
