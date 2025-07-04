import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'bluecoats/tests/helpers';

module('Acceptance | scores-by-day', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /scores-by-day', async function (assert) {
    await visit('/scores-by-day');

    assert.strictEqual(currentURL(), '/scores-by-day');
  });
});
