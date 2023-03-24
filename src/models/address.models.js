
/** address model here */
const Address = (sequelize, DataTypes) => {
  
    return sequelize.define('Address', {
        address_pk: {
            type: DataTypes.INTEGER ,
            autoIncrement: true,
            primaryKey: true
        },
        street : {
            type: DataTypes.STRING ,
            allowNull: false ,
            // validate: {

            // }
        } ,
        city:{
            type: DataTypes.STRING ,
            allowNull: false,
            // validate:{

            // }
        } ,
        postal_code: {
            type: DataTypes.STRING ,
            allowNull: false,
            // validate: {

            // }
        }

    }, {
        tableName : 'Address' ,
        timestamp: false ,
        createdAt: false ,
        updatedAt: false
    })
}


module.exports = Address