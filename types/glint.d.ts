import '@glint/environment-ember-loose';
import '@glint/environment-ember-template-imports';

import type PageTitle from 'ember-page-title/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export default interface Registry extends PageTitle {}
}
