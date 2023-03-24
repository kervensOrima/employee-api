const { Sequelize , DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')

const AddressModel = require('../models/address.models')
const PhoneModel = require('../models/phone.models')
const EmployeModel = require('../models/employe.models')
const UserModel = require('../models/user.models')

/** create the database here */
const sequelize = new Sequelize('employee_db' , 'root', '' , {
    host:'localhost' ,
    port: 3306,
    logging: true,
    dialect:'mysql'
})


/***  call all object here to create all tables */
const Address = AddressModel(sequelize, DataTypes)
const Phone = PhoneModel(sequelize, DataTypes)
const Employe = EmployeModel(sequelize, DataTypes) 
const User = UserModel(sequelize, DataTypes)


/** models relationship */

/** employee has many address employee phone will be present in table address */
Employe.hasMany(Address , {
    foreignKey: {
        type: DataTypes.INTEGER ,
        name : 'employe_id' ,
    }
})

Address.belongsTo(Employe, {
    foreignKey: {
        type: DataTypes.INTEGER ,
        name : 'employe_id' ,
    } 
})

/**  employee has many phone number employee key will be present is phone table */
Employe.hasMany(Phone, {
    foreignKey: {
        type:DataTypes.INTEGER ,
        name:'employe_id'
    }
})

Phone.belongsTo(Employe, {
    foreignKey: {
        type:DataTypes.INTEGER ,
        name:'employe_id'
    }  
})






/** authenticate to the data base here  */

sequelize.authenticate()
     .then(_=> {
        console.log('connected to the database successfully')
     })
     .catch(err => {
        console.log(`Error to connected to the database try again, ${err}`)
     })


/*** synchronour all model to the database */
const initDatabase = () => {
    return sequelize.sync({force: false, alter: false})
    .then(_ => {
      console.log('sync successfully to the database')

      /** 
      bcrypt.hash("admin@gmail.com", 10)
            .then( hash => {

               return User.create({
                    username:"admin@gmail.com" ,
                    password: hash ,
                    role: 'admin, user' ,
                    enabled: true
                })
                .then( user => {
                    console.log(`user has been created successfully : ${user.toJSON()}`)
                })
            })
            .catch( err=> {
                console.log(`${err} error to hash password...`)
            })
       */

    })
    .catch(err=>{
      console.log(`Error wile trying to create a table: ${err}`)
    })
}


module.exports = { 
    initDatabase ,
    Employe,
    User ,
    Address,
    Phone
}