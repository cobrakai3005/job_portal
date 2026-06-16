export const validate = (schema) => (req, res, next) => {
  try {
    console.log(req.body);

    const data = {
      ...req.body,
      company_id: Number(req.params.companyId),
    };

    req.body = schema.parse(data);

    next();
  } catch (error) {
    const formattedErrors = error.issues.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
  }
};
