import { type SeasonScores } from '$data/base';

const COLOR_OPTIONS = ['#38bdf8', '#ec4899', '#facc15'];

export const SEASON_2025: SeasonScores = {
  year: '2025',
  color: COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)],
  endDate: '2025-08-09',
  placement: 2,
  show: 'The Observer Effect',
  scores: [
    {
      date: '2025-06-28',
      location: 'Alliance, OH',
      name: 'Bluecoats Opening Night',
      score: null,
    },
    {
      date: '2025-06-29',
      location: 'Canton, OH',
      name: 'Party in the Plaza',
      score: null,
    },
    {
      date: '2025-07-05',
      location: 'Whitewater, WI',
      score: null,
    },
    {
      date: '2025-07-06',
      location: 'La Crosse, WI',
      name: 'River City Rhapsody',
      score: 83.3,
    },
    {
      date: '2025-07-11',
      location: 'Dubuque, IA',
      name: 'Music on the March',
      score: null,
    },
    {
      date: '2025-07-12',
      location: 'Lisle, IL',
      name: 'Calvacade of Brass',
      score: 86.5,
    },
    {
      date: '2025-07-15',
      location: 'Broken Arrow, OK',
      name: 'DCI Broken Arrow',
      score: 88.55,
    },
    {
      date: '2025-07-17',
      location: 'Denton, TX',
      name: 'DCI Denton',
      score: 90.3,
    },
    {
      date: '2025-07-18',
      location: 'Houston, TX',
      name: 'DCI Houston',
      score: 91.25,
    },
    {
      date: '2025-07-19',
      location: 'San Antonio, TX',
      name: 'DCI Southwestern Regional',
      score: 92.825,
    },
    {
      date: '2025-07-20',
      location: 'Bedford, TX',
      name: 'DCI Dallas',
      score: 92.95,
    },
    {
      date: '2025-07-25',
      location: 'Nashville, TN',
      name: 'DCI Nashville',
      score: 94.4,
    },
    {
      date: '2025-07-26',
      location: 'Atlanta, GA',
      name: 'DCI Southeastern Championship',
      score: 95.025,
    },
    {
      date: '2025-07-27',
      location: 'Winston-Salem, NC',
      name: 'NightBeat',
      score: 94.55,
    },
    {
      date: '2025-07-30',
      location: 'Glassboro, NJ',
      name: 'DCI Glassboro',
      score: 95.85,
    },
    {
      date: '2025-07-31',
      location: 'Lawrence, MA',
      name: 'DCI East Coast Showcase',
      score: null,
    },
    {
      date: '2025-08-01',
      location: 'Allentown, PA',
      name: 'DCI Eastern Classic',
      score: 96.475,
    },
    {
      date: '2025-08-04',
      location: 'Canton, OH',
      name: 'Innovations in Brass',
      score: 97.075,
    },
    {
      date: '2025-08-07',
      location: 'Indianapolis, IN',
      name: 'DCI World Championship Prelims',
      score: 97.15,
    },
    {
      date: '2025-08-08',
      location: 'Indianapolis, IN',
      name: 'DCI World Championship Semis',
      score: 97.763,
    },
    {
      date: '2025-08-09',
      location: 'Indianapolis, IN',
      name: 'DCI World Championship Finals',
      score: 98.25,
    },
  ],
};
