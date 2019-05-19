import dbconnect from './dbconnect';
import sendSuccessResponse from './sendSuccessResponse';

const sendDbResponse = (res, statusCode, text, values) => {
  dbconnect.query(text, values).then((result) => {
    sendSuccessResponse(res, statusCode, result.rows);
  });
};

export default sendDbResponse;
