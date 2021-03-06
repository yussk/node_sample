/**
 * userテーブルの定義を設定する
 */

// ユーザテーブルのスキーマ定義
function def(seq) {
    var User = seq.define('user', {
        // プライマリキー
        id : { type: 'varchar(32)', primaryKey: true },

        // ユーザID
        uid : { type: 'varchar(32)' },

        // ユーザ名（名）
        firstname : { type: 'varchar(32)' },
        // ユーザ名（姓）
        lastname : { type: 'varchar(32)' },

        // 年齢
        age : { type: 'tinyint(2)' },

        // パスワード。ハッシュ化された文字列が入る
        password : { type: 'varchar(32)' },

        // ユーザの権限
        user_role : { type: 'varchar(32)' },

        // タグ
        tags : { type: 'varchar(32)' },

        // ???
        servers : { type: 'varchar(32)' },

        // ステータス。デフォルト1で、0は削除を示す
        status          : { type: 'tinyint(1)', defaultValue: 1 }
    }, {
        charset         : 'utf8',
        collate         : 'utf8_general_ci',
        underscored     : true,
        freezeTableName : true
    });

    return {
        seq   : seq,
        model : User
    }
}

exports.define = function(seq) {
    if (typeof(seq) === 'undefined') {
        var seq = require('../dbconn').master();
    }
    return def(seq).model;
}

// 指定したユーザ名とパスワードに一致するユーザを取得する
exports.find = function(uid, password, callback) {
    console.log('user.find');
    var seq = require('../dbconn').master();
    var User = def(seq).model;
    User
        .find({ where: ['uid = ? AND password = ? AND status = ?', uid, password, 1] })
        .success(function(user) {
            if (user !== null) {
                callback(null, user);
            } else {
                callback('指定されたユーザは見つかりませんでした。');
            }
        })
        .error(function(err) {
            console.log(err);
            callback(err);
        });
};

// ユーザ一覧を取得する（権限での絞り込みあり）
exports.findAll = function(role, callback) {
    var seq  = require('../dbconn').master();
    var User = def(seq).model;

    User
        .findAll({ where: ['user_role LIKE ? AND status = 1', '%'+role+'%', 1] })
        .success(function(users) {
            if (users !== null) {
                callback(null, users);
            } else {
                callback('指定のユーザ一覧を取得できませんでした。');
            }
        })
        .error(function(err) {
            console.log(err);
            callback(err);
        });
};

exports.findByUid = function(uid, callback) {
    var seq  = require('../dbconn').master();
    var User = def(seq).model;

    User
        .find({ where: ['uid = ?', uid] })
        .success(function(user) {
            if (user) {
                callback(null, user);
            } else {
                callback('指定されたユーザはいません。');
            }
        })
        .error(function(err) {
            console.log(err);
            callback(err);
        });
};

exports.update = function(uid, firstName, lastName, age, callback) {
    var seq  = require('../dbconn').master();
    var User = def(seq).model;

    User
        .find({ where: ['uid = ?', uid] })
        .success(function(user) {
            if (!user) return callback('指定されたユーザはいません。');
            user.updateAttributes({
                firstname : firstName,
                lastname  : lastName,
                age       : age
            })
            .success(function(_user) {
                callback(null, _user);
            })
            .error(function(err) {
                console.log(err);
                callback(err);
            });
        })
        .error(function(err) {
            console.log(err);
            callback(err);
        });
};

exports.add = function(obj, callback) {
    var seq = require('../dbconn').master();
    var User = def(seq).model;

    User
        .build({
            uid : obj.uid,
            firstname : obj.firstname,
            lastname  : obj.lastname,
            age       : obj.age,
            password  : obj.password,
            user_role : obj.user_role,
            tags      : obj.tags,
            servers   : obj.servers
        })
        .save()
        .success(function(user) {
            callback(null, user);
        })
        .error(function(err) {
            console.log(err);
            callback(err);
        });
};
