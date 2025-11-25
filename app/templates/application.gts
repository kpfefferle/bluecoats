import { pageTitle } from 'ember-page-title';
import NavigationBar from 'bluecoats/components/navigation-bar';

<template>
  {{pageTitle "Bluecoats Scores"}}

  <div class="min-h-full">
    <NavigationBar />
    {{outlet}}
  </div>
</template>
