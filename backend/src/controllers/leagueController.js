import { createLeague, getLeagueById, getUserLeagues } from '../services/leagueService.js';

export const postLeague = async (req, res, next) => {
  try {
    const { name, privacy } = req.body || {};
    // Never trust ownerId from client body; strictly derive from authenticated req.userId
    const league = await createLeague({ name, privacy, ownerId: req.userId });
    res.status(201).json({ league });
  } catch (error) {
    next(error);
  }
};

export const getLeague = async (req, res, next) => {
  try {
    const league = await getLeagueById(req.params.id, req.userId);
    res.json({ league });
  } catch (error) {
    next(error);
  }
};

export const getLeagues = async (req, res, next) => {
  try {
    const leagues = await getUserLeagues(req.userId);
    res.json({ leagues });
  } catch (error) {
    next(error);
  }
};
