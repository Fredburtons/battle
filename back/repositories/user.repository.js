const db = require('./index.js');
const log = require('../logger');

class UserRepository {

  constructor() {
    this.options = {
      include: [{model: db.models.Rank, as: "rank"}]
    };
  }
  
  findById(id) {
    return db.models.User.findById(id, this.options);
  }

  findByEmail(email) {
    return db.models.User.findOne({
      where: {email: email}
    }, this.options);
  }

  findByName(username) {
    return db.models.User.findOne({
      where: {name: username}
    }, this.options);
  }

  findAll(params={}) {
    params["include"] = this.options.include;
    return db.models.User.findAll(params);
  }

  add(user) {
    return db.transaction(t => {
        return db.models.User.create({
         email: user.email,
         name: user.name,
         password: user.password,
         icon: user.icon,
         score: user.score,
         rank_id: 1
      }, {transaction: t});
    });
  }

  update(id, newUser) {
    return db.models.Rank.findAll({order: '"minScore" DESC'}).then(ranks => {

      for(let i in ranks) {
        if(newUser.score >= ranks[i].minScore) {
          newUser.rank_id = ranks[i].id;
          break;
        }
      }

      try {
        return newUser.save();
      } catch(error) {
        return db.models.User.findById(id)
          .then(user => {
            return user.update(newUser);
          })
          .catch(error => {
            log.error(error);
          });
      }

    });
  }

  addAll(users) {

    let usersToSave = users.map(user => {
      return {
        email: user.email,
        name: user.name,
        password: user.password,
        icon: user.icon,
        score: user.score
      }
    });

    return db.transaction(t => {
        return db.models.User.bulkCreate(usersToSave, {transaction: t});
    });
  }

  delete(id) {
    return db.transaction(t => {
      return db.models.User.findById(id).then(user => {
        return user.destroy({transaction: t});
      });
    });
  }

}

module.exports = UserRepository;