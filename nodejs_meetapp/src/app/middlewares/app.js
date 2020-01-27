import * as Yup from 'yup';

export default async (req, res, next) => {
  req.vars = {};
  req.methods = {
    async validateBody(rules) {
      const schema = Yup.object().shape(rules);
      if (!(await schema.isValid(req.body))) {
        return res.methods.bad('Missing or wrong provided data.');
      }

      return true;
    },
  };

  res.methods = {
    error(status, data) {
      const errors = [];
      if (!Array.isArray(data)) {
        errors.push(data);
      }

      return res.status(status).json({ errors });
    },

    bad(data) {
      return res.methods.error(res, 400, data || 'Bad request');
    },

    unauthorized(data) {
      return res.methods.error(res, 401, data || 'Unauthorized');
    },

    forbidden(data) {
      return res.methods.error(res, 403, data || 'Forbidden');
    },
  };
  return next();
};
