import { type TOC } from '@ember/component/template-only';

import { type IndexRouteModel } from 'bluecoats/routes/index';
import type IndexController from 'bluecoats/controllers/index';

import FitAllToggle from 'bluecoats/components/score-history/fit-all-toggle';
import SeasonScoresChart from 'bluecoats/components/score-history/season-scores-chart';
import SeasonSelect from 'bluecoats/components/score-history/season-select';
import Card from 'bluecoats/components/shared/card';
import PageContent from 'bluecoats/components/shared/page-content';
import PageHeader from 'bluecoats/components/shared/page-header';

import { pageTitle } from 'ember-page-title';

interface IndexSignature {
  Args: {
    controller: IndexController;
    model: IndexRouteModel;
  };
}

<template>
  {{pageTitle "Score History"}}

  <PageHeader @title="Score History" @subtitle="Relative to DCI Finals" />
  <PageContent>
    <div class="grid grid-cols-1 gap-4">
      <Card>
        <div class="grid grid-cols-1 gap-4">
          <SeasonSelect
            @onSelectedYearsChange={{@controller.onSelectedYearsChange}}
            @seasonScores={{@model}}
            @selectedYears={{@controller.selectedYears}}
          />
          <FitAllToggle
            @fitAllSeasons={{@controller.fitAll}}
            @onFitAllSeasonsChange={{@controller.onFitAllChange}}
          />
        </div>
      </Card>
      <Card>
        <div class="min-h-svh flex flex-col overflow-x-auto">
          <SeasonScoresChart
            @fitAllSeasons={{@controller.fitAll}}
            @seasonScores={{@model}}
            @selectedYears={{@controller.selectedYears}}
          />
        </div>
      </Card>
    </div>
  </PageContent>
</template> satisfies TOC<IndexSignature>;
