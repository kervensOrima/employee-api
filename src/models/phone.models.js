

const Phone = (sequelize, DataTypes) => {
    return sequelize.define('Phone', {
        phone_pk: {
            type: DataTypes.INTEGER ,
            autoIncrement: true,
            primaryKey: true
        },
        phoneNumber : {
            type: DataTypes.STRING ,
            allowNull: false ,
            unique:true,
            field: 'phone_number' ,
            // validate: {
            //     isValid() {
            //         const phone = this.getDataValue('phoneNumber')

            //     }
            // }
        }

    },{
        tableName: 'Phone' ,
        timestamp: false,
        createdAt: 'created_at' ,
        updatedAt:'updated_at'
    })
}

module.exports = Phone