const sendErrorResponse = (res, errorStatusCode, error) => {
  res.status(errorStatusCode).send({
    status: errorStatusCode,
    error,
  });
};

export default sendErrorResponse;
