import { describe, expect, it } from 'vitest';
import { isActiveRoute } from '../../src/lib/components/nav/types';

describe('isActiveRoute', () => {
  it('matches an exact route id', () => {
    expect(isActiveRoute('/tour', '/tour')).toBe(true);
  });

  it('matches a child route id', () => {
    expect(isActiveRoute('/tour/[year]', '/tour')).toBe(true);
  });

  it('does not match a sibling route', () => {
    expect(isActiveRoute('/score-history', '/tour')).toBe(false);
  });

  it('matches the root route exactly, never its children', () => {
    expect(isActiveRoute('/', '/')).toBe(true);
    expect(isActiveRoute('/tour/[year]', '/')).toBe(false);
  });

  it('handles a null route id (error page)', () => {
    expect(isActiveRoute(null, '/tour')).toBe(false);
  });
});
