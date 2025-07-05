import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'bluecoats/tests/helpers';

module('Acceptance | daily-rankings', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /daily-rankings', async function (assert) {
    await visit('/daily-rankings');

    assert.strictEqual(currentURL(), '/daily-rankings');
  });
});
