const sendSuccessResponse = (res, successStatusCode, data) => {
  res.status(successStatusCode).send({
    status: successStatusCode,
    data,
  });
};

export default sendSuccessResponse;
