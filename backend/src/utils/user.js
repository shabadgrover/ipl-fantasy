/**
 * Returns a safe public representation of a user (never includes passwordHash).
 * @param {object} user
 */
export const toPublicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});
