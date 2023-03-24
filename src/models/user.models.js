
const ROLE  = ['USER', 'ADMIN', ]

const User = (sequelize, DataTypes) => {

    return  sequelize.define('User' , {
        user_pk: {
            type: DataTypes.INTEGER ,
            primaryKey: true ,
            autoIncrement: true,
        },
        username:{
            type:DataTypes.STRING ,
            unique: true,
            allowNull:false,
            validate: {

            }
        } ,
        password: {
            type: DataTypes.STRING ,
            allowNull: false ,
            validate: {

            }
        } ,
        role:{
            type: DataTypes.STRING ,
            allowNull: false, 
            validate: {

            } ,


        } ,
        enabled:{
            type: DataTypes.BOOLEAN ,
            defaultvalue: true ,
        }

    }, {
        timestamp: true, 
        createdAt: 'created_at' ,
        updatedAt: 'updated_at' ,
        tableName:'User'
    })
}


module.exports = User 