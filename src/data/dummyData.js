export const leaderboardData = [
  { id: 1, rank: 1, teamName: "Shabad's Team", playerCount: 11, totalPoints: 1250, isUser: true },
  { id: 2, rank: 2, teamName: "Virat's Warriors", playerCount: 11, totalPoints: 1210 },
  { id: 3, rank: 3, teamName: "Dhoni's Dynamos", playerCount: 11, totalPoints: 1185 },
  { id: 4, rank: 4, teamName: "Mumbai Paltan", playerCount: 11, totalPoints: 1120 },
  { id: 5, rank: 5, teamName: "Knight Riders", playerCount: 11, totalPoints: 1090 },
  { id: 6, rank: 6, teamName: "Lions XI", playerCount: 11, totalPoints: 1050 },
];

export const teamsData = [
  {
    id: 1,
    teamName: "Shabad's Team",
    totalPoints: 1250,
    players: [
      { name: "Virat Kohli", points: 250 },
      { name: "Glenn Maxwell", points: 180 },
      { name: "Jasprit Bumrah", points: 150 },
      { name: "Rashid Khan", points: 120 },
      { name: "Jos Buttler", points: 110 },
      { name: "Mohammed Shami", points: 95 },
      { name: "Hardik Pandya", points: 85 },
      { name: "Ravindra Jadeja", points: 80 },
      { name: "Yuzvendra Chahal", points: 75 },
      { name: "Shubman Gill", points: 70 },
      { name: "Arshdeep Singh", points: 35 },
    ]
  },
  {
    id: 2,
    teamName: "Virat's Warriors",
    totalPoints: 1210,
    players: [
      { name: "Rohit Sharma", points: 140 },
      { name: "KL Rahul", points: 130 },
      { name: "Suryakumar Yadav", points: 125 },
      { name: "Axar Patel", points: 110 },
      { name: "Trent Boult", points: 105 },
      { name: "Kuldeep Yadav", points: 100 },
      { name: "David Miller", points: 95 },
      { name: "Quinton de Kock", points: 90 },
      { name: "Varun Chakaravarthy", points: 85 },
      { name: "Marcus Stoinis", points: 70 },
      { name: "Avesh Khan", points: 60 },
    ]
  }
];

export const upcomingMatch = {
  matchName: "Match 6: KKR vs SRH",
  date: "Thursday, 2 April 2026 • 7:30 PM",
  teams: [
    {
      name: "KKR",
      players: [
        { name: "Andre Russell", ownedBy: "Dhoni's Dynamos" },
        { name: "Sunil Narine", ownedBy: "Shabad's Team" },
        { name: "Shreyas Iyer", ownedBy: "Knight Riders" },
        { name: "Rinku Singh", ownedBy: "Virat's Warriors" },
        { name: "Mitchell Starc", ownedBy: "Lions XI" },
      ]
    },
    {
      name: "SRH",
      players: [
        { name: "Pat Cummins", ownedBy: "Virat's Warriors" },
        { name: "Abhishek Sharma", ownedBy: "Shabad's Team" },
        { name: "Heinrich Klaasen", ownedBy: "Dhoni's Dynamos" },
        { name: "Travis Head", ownedBy: "Mumbai Paltan" },
        { name: "T Natarajan", ownedBy: "Lions XI" },
      ]
    }
  ]
};
