import Route from '@ember/routing/route';

interface SeasonScores {
  year: number;
  endDate: string;
  scores: Array<{
    date: string;
    location: string;
    score: number;
  }>;
}

type IndexRouteModel = SeasonScores;

export default class IndexRoute extends Route {
  model(): IndexRouteModel {
    return {
      year: 2024,
      endDate: '2024-08-10',
      scores: [
        {
          date: '2024-07-02',
          location: 'Mason, OH',
          score: 78.75,
        },
        {
          date: '2024-07-06',
          location: 'Whitewater, WI',
          score: 81.9,
        },
        {
          date: '2024-07-07',
          location: 'LaCrosse, WI',
          score: 83.4,
        },
        {
          date: '2024-07-13',
          location: 'DeKalb, IL',
          score: 87.05,
        },
        {
          date: '2024-07-14',
          location: 'Ankeny, IA',
          score: 88.35,
        },
        {
          date: '2024-07-16',
          location: 'Broken Arrow, OK',
          score: 89.15,
        },
        {
          date: '2024-07-18',
          location: 'Denton, TX',
          score: 90.5,
        },
        {
          date: '2024-07-19',
          location: 'Houston, TX',
          score: 92.1,
        },
        {
          date: '2024-07-20',
          location: 'San Antonio, TX',
          score: 93.025,
        },
      ],
    };
  }
}
