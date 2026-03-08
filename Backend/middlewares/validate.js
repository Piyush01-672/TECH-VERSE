const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorDetails = error.details.map((detail) => ({
      message: detail.message,
      path: detail.path,
    }));
    return res.status(400).json({
      message: "Validation Error",
      errors: errorDetails,
    });
  }
  next();
};

module.exports = validate;
