const { Op, ValidationError, UniqueConstraintError } = require("sequelize");
const { User } = require("../db/sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = require("../auth/secret");
const auth = require("../auth/auth");

module.exports = (app) => {
  /***  login endpoint for who want to connected to our api */
  app.post("/api/v1/login/", (req, resp) => {
    if (req.body === null) {
      return resp.json({
        message: "username and pass is required",
        timestamp: new Date(),
        code: 401,
        success: false,
      });
    }
    User.findOne({
      where: {
        username: {
          [Op.eq]: req.body.username,
        },
      },
    })
      .then((user) => {
        if (!user) {
          return resp.status(404).json({
            message: `${req.body.username} not found!!!`,
            timestamp: new Date(),
            success: false,
            code: 404,
          });
        }

        if (!user.enabled) {
          return resp.status(404).json({
            message: `${user.username} is enable check the admin to anebled your account...`,
            timestamp: new Date(),
            success: false,
            code: 404,
          });
        }


        bcrypt.compare(req.body.password, user.password)
          .then(isvalid => {

            if (!isvalid) {
              return resp.status(404).json({
                message: `${req.body.username} your password is invalid...`,
                success: false,
                code: 404,
                timestamp: new Date(),
              });
            }


            /** password and username is valid now we gonna load sign the user */
            const token = jwt.sign(
              { data: user},
              SECRET,
              {  expiresIn: "24h",}
            );

            return resp.json({
              message: "user has been login successfully",
              data: user,
              timestamp: new Date(),
              token: token,
              success: true,
            });


          })
          .catch(err => {
            return resp.status(500).json({
              message: "error occuring while compare user password",
              timestamp: new Date(),
              code: 500,
              success: false,
              error: err,
            });
          });
      })
      .catch((err) => {
        return resp.status(500).json({
          message: "error occuring while loading user...",
          success: false,
          error: err,
          code: 500,
          timestamp: new Date(),
        });
      });
  });

  /*** creater a user in the databse */
  app.post("/api/v1/users/", auth,  (req, resp) => {
    const user = { ...req.body };

    console.log(user);

    bcrypt
      .hash(user.password, 10)
      .then((hashPassword) => {

        user.password = hashPassword;
        user.enabled = true;

        User.create(user, {
          attributes: {
            exclude: ["password"],
          },
        })
          .then((user) => {
            return resp.json({
              data: user,
              message: `user has been added successfully in the database`,
              success: true,
              timestamp: new Date(),
            });
          })
          .catch((error) => {
            if (error instanceof UniqueConstraintError) {
              return resp.status(401).json({
                message: error.errors[0].message,
                timestamp: new Date(),
                error,
                success: false,
              });
            }

            return resp.status(500).json({
              message:
                "internal server error while register the user in the database",
              error: error,
              timestamp: new Date(),
              success: false,
            });
          });
      })
      .catch((err) => {
        return resp.status(500).json({
          message: "internal server error while hash the password",
          error: err,
          timestamp: new Date(),
          success: false,
        });
      });
  });

  app.get("/api/v1/users/", auth, (req, resp) => {
    const enabled = !req.query.enabled ? true : false;

    User.findAll({
      where: {
        enabled: enabled,
      },
      attributes: {
        exclude: ["password"],
      },
    })
      .then((users) => {
        return resp.json({
          data: users,
          timestamp: new Date(),
          code: 200,
          success: true,
        });
      })
      .catch((err) => {
        return resp.status(500).json({
          message: "error occuring while loading users on the dabase",
        });
      });
  });
};
