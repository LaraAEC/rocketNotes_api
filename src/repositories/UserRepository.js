const sqliteConnection = require('../database/sqlite');

class UserRepository {
  async findByEmail(email){
    const database = await sqliteConnection(); //nomeando meu BD, criando uma constante que receberá a conexão com meu BD. Uso await há demora trata-se de conexão.
    const user = await database.get("SELECT * FROM users WHERE email = (?)", [email]) // a interrogação será substituída pela variável 
 
    return user;
  }

  async create({ name, email, password }){
    const database = await sqliteConnection(); //nomeando meu BD, criando uma constante que receberá a conexão com meu BD. Uso await há demora trata-se de conexão.
    
    const userId = await database.run( //executando uma inserção, conforme os campos e valores 
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    return { id: userId };
  }
}

module.exports = UserRepository;