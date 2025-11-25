import { type TOC } from '@ember/component/template-only';
import { concat } from '@ember/helper';
import { on } from '@ember/modifier';

import { type DailyRankingsModel } from 'bluecoats/routes/daily-rankings';
import DailyRankingsController from 'bluecoats/controllers/daily-rankings';

import DaySlider from 'bluecoats/components/daily-rankings/day-slider';
import Table from 'bluecoats/components/daily-rankings/table';
import Card from 'bluecoats/components/shared/card';
import PageContent from 'bluecoats/components/shared/page-content';
import PageHeader from 'bluecoats/components/shared/page-header';

import { pageTitle } from 'ember-page-title';
import { eq, gt, notEq } from 'ember-truth-helpers';

interface DailyRankingsSignature {
  Args: {
    controller: DailyRankingsController;
    model: DailyRankingsModel;
  };
}

<template>
  {{pageTitle "Daily Rankings"}}

  <PageHeader
    @title="Daily Rankings"
    @subtitle={{if
      (eq @controller.selectedDay 0)
      "Finals Day"
      (concat
        @controller.selectedDay
        (if (gt @controller.selectedDay 1) " days" " day")
        " before DCI Finals"
      )
    }}
  >
    {{#if (notEq @controller.selectedDay @controller.currentDay)}}
      <button
        {{on "click" @controller.resetToToday}}
        class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        type="button"
      >
        Reset to Today
      </button>
    {{/if}}
  </PageHeader>
  <PageContent>
    <div class="grid grid-cols-1 gap-4">
      <Card>
        <DaySlider
          @maximum={{@controller.maxDay}}
          @onChange={{@controller.onSelectedDayChange}}
          @value={{@controller.selectedDay}}
        />
      </Card>
      <Card @disablePadding={{true}}>
        <Table @rankings={{@controller.dailyRankings}} />
      </Card>
    </div>
  </PageContent>
</template> satisfies TOC<DailyRankingsSignature>;
