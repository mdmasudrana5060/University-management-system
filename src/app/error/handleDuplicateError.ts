/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSource, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"])"/);
  const extractedMessage = match && match[1];

  const errorSources: TErrorSource = [
    {
      path: ' ',
      message: `${extractedMessage} is already exist`,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: 'Invalid Id',
    errorSources,
  };
};

export default handleDuplicateError;
