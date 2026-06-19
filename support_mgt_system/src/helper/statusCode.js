export const STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,   // Request accept process is not closed
  BAD_REQUEST: 400,     // Invalid Data
  NOT_FOUND: 404,      // User not Found
  UNAUTHORIZE: 401,     // Login first
  FORBIDDEN: 403, // Access denied your role is not access this
  CONFILICT: 409, // Duplicate Resourses -->> email already exits
  UNPROCESSIABLE_ENTITY: 422,  // Validation Error
  SERVER_ERROR: 500,
};

export const TICKET_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in-progress",
  CLOSED: "close",
};
