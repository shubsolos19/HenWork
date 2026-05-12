/**
 * Standardized API response helpers.
 */

function success(res, data = null, statusCode = 200, meta = null) {
  const response = { success: true, data };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
}

function created(res, data = null) {
  return success(res, data, 201);
}

function noContent(res) {
  return res.status(204).end();
}

function paginated(res, data, total, page = 1, limit = 20) {
  return success(res, data, 200, {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

module.exports = { success, created, noContent, paginated };
