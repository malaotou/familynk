/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        account: { // 賬號
            type: DataTypes.STRING,
            allowNull: false
        },
        password:{ // 密碼
            type:DataTypes.STRING,
            allowNull:false
        },
        avatarsrc: { //頭像
            type: DataTypes.BLOB('long'),
            allowNull: true
        },
        fileaddress:{//头像文件路径
            type:DataTypes.STRING,
            allowNull:true
        },
        fileExt:{//头像拓展名
            type:DataTypes.STRING,
            allowNull:true
        },
        name: { // 姓名，用於企業用戶認證
            type: DataTypes.STRING,
            allowNull: true
        },
        nickname:{//昵称
            type: DataTypes.STRING,
            allowNull: true
        },
        gender:{//性别
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue:0
        },
        creator: { //創建人
            type: DataTypes.BIGINT,
            allowNull: true
        },
        created_date: { //創建時間
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue:sequelize.NOW
        },
        modified_by: { //修改人
            type: DataTypes.BIGINT,
            allowNull: true
        },
        modified_date: { //修改時間
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue:sequelize.NOW
        },
        disabled:{ //0启用1禁用
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue:false
        }

    }, {
        tableName: 'td_user',
        freezeTableName: false
    });
};
