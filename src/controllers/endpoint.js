const { ValidationError, Op, Sequelize } = require("sequelize");
const auth = require('../auth/auth')
const { Employe, Phone, Address } = require("../db/sequelize");

module.exports = (app) => {

    
  /** load employe by contrat type or  statut */
  app.get("/api/v1/employees/search/", auth, ( req, resp) => {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;

    // console.log(page, typeof page);
    const statut = req.query.statut ?? "";
    const type_of_contrat = req.query.type ?? "";
    const has_contrat = req.query.contrat ?? true;

    Employe.findAndCountAll({
      include: [
        {
          model: Phone,
        },
        {
          model: Address,
        },
      ],
      where: {
        [Op.or]: [
          { statut: statut },
          { type_of_contrat: type_of_contrat },
          { contrat: has_contrat },
        ],
      },
      offset: page,
      limit: 12,
      order: [["salary", "ASC"] ,[ 'employe_pk', 'ASC']],
    })
      .then(({ count, rows }) => {
        return resp.json({
          message: `${count} employee(s) in the database, actually...`,
          data: rows,
          timestamp: new Date(),
          code: 200,
          succcess: true,
          pagination: {
            count: count,
            page: page,
            size: 12,
          },
        });
      })
      .catch((err) => {
        return resp.status(500).json({
          message: "error occuring while loading employees",
          code: 500,
          error: err,
          timestamp: new Date(),
          succcess: false,
        });
      });
  });

  /** get all employees */
  app.get("/api/v1/employees/", auth, ( req, resp) => {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;

    console.log(page, typeof page);

    Employe.findAndCountAll({
      include: [
        {
          model: Phone,
        },
        {
          model: Address,
        },
      ],
      offset: page,
      limit: 12,
      order: [["salary", "ASC"]],
    })
      .then(({ count, rows }) => {
        return resp.json({
          message: `${count} employee(s) in the database, actually...`,
          data: rows,
          timestamp: new Date(),
          code: 200,
          succcess: true,
          pagination: {
            count: count,
            page: page,
            size: 18,
          },
        });
      })
      .catch((err) => {
        return resp.status(500).json({
          message: `error occuring while loagding employee page ${page}`,
          code: 500,
          succcess: false,
          error: err,
          timestamp: new Date(),
        });
      });
  });

  /**  get all employees in the database */
  app.get("/api/v1/employees/all/", auth, (req, resp) => {
    Employe.findAll({
      include: [
        {
          model: Phone,
        },
        {
          model: Address,
        },
      ],
    })
      .then((employes) => {
        return resp.json({ message: "all employee", data: employes });
      })
      .catch((err) => {
        message = `error occured while loading the users into the database`;
        return resp.status(500).json({
          message: message,
          timestamp: new Date(),
          code: 500,
          succcess: false,
          error: err,
        });
      });
  });

  /** load employee by pk */
  app.get("/api/v1/employees/:pk/",auth, (req, resp) => {
    const pk = parseInt(req.params.pk);

    Employe.findByPk(pk, {
      include: [{ model: Phone }, { model: Address }],
    })
      .then((employe) => {
        if (employe === null) {
          console.log(employe);

          const message = `employee with pk ${pk} not found!!!`;
          return resp.status(404).json({
            message: message,
            timestamp: new Date(),
            code: 404,
            succcess: false,
            error: null,
          });
        }

        /** works the result */
        return resp.json({
          data: employe,
          message: "employe found successfully",
          code: 200,
          succcess: true,
        });
      })
      .catch((err) => {
        const message = `error occurring while getting employee`;
        return resp.status(500).json({
          message: message,
          timestamp: new Date(),
          code: 500,
          succcess: false,
          error: err,
        });
      });
  });

  /** delete an emplyee by his id */
  app.delete("/api/v1/employees/:pk/", auth,  (req, resp) => {
    const pk = req.params.pk;

    Employe.findOne({
      include: [{ model: Phone }, { model: Address }],
      where: {
        employe_pk: `${pk}`,
      },
    })
      .then((employee) => {
        if (!employee) {
          const message = `employee with pk ${pk} not found`;
          return resp.status(404).json({
            message: message,
            timestamp: new Date(),
            code: 404,
            succcess: false,
          });
        }

        // destroy the employee in the database
        return Employe.destroy({
          where: {
            employe_pk: pk,
          },
        }).then((_) => {
          /** return the employee found */
          const message = `Employee with pk ${pk} has been found successfully delete`;
          return resp.json({
            message: message,
            data: employee,
            timestamp: new Date(),
            code: 200,
            succcess: true,
          });
        });
      })
      .catch((err) => {
        const message = `An error occured while loading employe with pk ${pk}`;
        return resp.status(500).json({
          message: message,
          timestamp: new Date(),
          code: 500,
          succcess: false,
          error: err,
        });
      });
  });

  /** save new employee in the database */
  app.post("/api/v1/employees/", auth, (req, resp) => {
    console.log(req.body);

    Employe.create(req.body, {
      include: [
        { model: Phone, require: true} ,
        { model: Address, require: true}
      ],
      returning: true ,
      save: false
    })
      .then((employee) => {
        /*** create phone associate with this employee */
        const message = `employee has been created successfully in the database`;
        return resp.json({
          message: message,
          data: employee,
          timestamp: new Date(),
          code: 200,
          succcess: true,
        });
      })
      .catch((err) => {
        if (err instanceof ValidationError) {
          const message = `validation error check all the attributes`;
          return resp.status(401).json({
            message: message,
            timestamp: new Date(),
            code: 401,
            succcess: false,
            error: err,
          });
        }

        const message = `Error occurring while trying to insert the employee int the database`;
        return resp.status(500).json({
          message: message,
          timestamp: new Date(),
          code: 500,
          succcess: false,
          error: err,
        });
      });
  });

  /*** update an employee */
  app.put("/api/v1/employees/:pk/", auth, (req, resp) => {
    const pk = parseInt(req.params.pk)

    if ( typeof(pk) !== 'number') {
        return resp.status(401).json({
            message: 'pk is required to update employee' ,
            timestamp: new Date(),
            succcess: false,
            code: 401
        })
    }
       

    Employe.findByPk(parseInt(pk))
      .then((employee) => {
        
        if (!employee) {
          return resp.status(404).json({
            message: `employee with pk ${pk} not found!!!`,
            timestamp: new Date(),
            code: 404,
          });
        }

        return Employe.update(req.body, {
          where: {
            employe_pk: pk,
          },
        },{ include:[Phone, Address]}).then(_ => {
          return resp.json({
            message: "employee has been update successfully",
            data: employee,
            succcess: true,
            code: 200,
            timestamp: new Date(),
          });
        });


      }).catch((err) => {
        return resp.status(500).json({
          message: "error occurring while updating employee",
          code: 500,
          error: err,
          succcess: false,
          timestamp: new Date(),
        });
      });
  });


  app.get('/api/v1/statistics/', auth ,async (req, resp) => {
      const statut = await Employe.findAll({
        attributes:[
            'statut' ,
            [ Sequelize.fn('COUNT', Sequelize.col('statut')) , 'number'] ,
        ] ,
        group:[ 'statut',]
      })

      const type_of_contrat = await Employe.findAll({
        attributes:[
            'type_of_contrat' ,
            [Sequelize.fn('COUNT', Sequelize.col('type_of_contrat')), 'number_type_of_contrat'] ,
        ] ,
        group: ['type_of_contrat']

      })

      const contrat = await Employe.findAll({
         attributes: [
            'contrat' ,
            [Sequelize.fn('COUNT' , Sequelize.col('contrat')), 'number_of_contrat']
         ],
         group: ['contrat']
      })

      return resp.json({
        data: {
            statut:statut, 
            type_of_contrat: type_of_contrat ,
            contrat:contrat
        }
      })
  })



};
