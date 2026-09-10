import { createLeague, getLeagueById } from '../services/leagueService.js';

export const postLeague = async (req, res, next) => {
  try {
    const league = await createLeague(req.body);
    res.status(201).json({ league });
  } catch (error) {
    next(error);
  }
};

export const getLeague = async (req, res, next) => {
  try {
    const league = await getLeagueById(req.params.id);
    res.json({ league });
  } catch (error) {
    next(error);
  }
};
