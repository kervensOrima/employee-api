
const STATUT = ['ACTIF' , 'INACTIF', ]
const TYPE_OF_CONTRACT = ['CDI', 'CDD', 'DEFAULT' ]

const Employe = (sequelize, DataTypes) => {

    return sequelize.define('Employe' ,{
        employe_pk: {
            type: DataTypes.INTEGER ,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        code:{
            type:DataTypes.UUID ,
            defaultValue: DataTypes.UUIDV4 ,
        } ,
        firstName:{
            type: DataTypes.STRING ,
            allowNull: false,
            // validate: {

            // }
        } ,
        lastName:{
            type: DataTypes.STRING ,
            allowNull: false ,
            // validate: {

            // }
        } ,
        salary:{
            type: DataTypes.DOUBLE ,
            allowNull: false,
            // validate: {

            // }
        } ,
        contrat:{
            type: DataTypes.BOOLEAN ,
            defaultValue: false ,
            allowNull: true ,
        } ,
        type_of_contrat:{
            type: DataTypes.STRING ,
            allowNull: false, 
            defaultValue: 'DEFAULT',
            validate: {

                isValid() {
                    const type = this.getDataValue('type_of_contrat')   
    
                    if(! TYPE_OF_CONTRACT.includes(type)) {
                        throw new Error('Type of contrat is invalid')
                    }
                }
            } ,
           
        } ,
        hiring_date:{
            type: DataTypes.DATE ,
            defaultValue: DataTypes.NOW ,
        } ,
        statut:{
            type: DataTypes.STRING ,
            allowNull: true ,
            defaultValue:'INACTIF' ,
            // validate: {

            //     isValid() {
            //         const statut = this.getDataValue('statut')

            //         if(!STATUT.includes(statut)) {
            //             throw new Error('status invalid')
            //         }
            //     }
            // }

        }

    }, {
        timestamp: true ,
        updatedAt: 'updated_at' ,
        createdAt: false ,
        tableName: 'Employe'
    })
}




module.exports = Employe