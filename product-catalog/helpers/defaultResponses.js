export const methodNotSupportedResponse = (res) => {
  res.status(400).send(`This request method is not supported`);
};
