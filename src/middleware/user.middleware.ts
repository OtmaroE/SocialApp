import { validateJWT } from '../users/helpers/jwt';

export function attachUserToReq(req, res, next) {
  req.user = {};
  if (!req.headers.authorization || req.headers.authorization === null) return next();
  const valid = validateJWT(req.headers.authorization);
  if (valid.id) req.user = valid;
  next();
}