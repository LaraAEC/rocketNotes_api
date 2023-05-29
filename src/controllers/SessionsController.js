const knex = require("../database/knex"); //importando minha conexão com meu BD
const AppError = require("../utils/AppError") // importo para tratar os erros e mostrar mensagens para o usuário
const { compare } = require("bcryptjs"); //preciso importar esse método para comparar senhas criptografadas
const authConfig = require("../configs/auth"); //configurações de autenticação da nossa Aplicação, arquivo que criamos o token
const { sign } = require("jsonwebtoken"); //importando o sign, que é um método do json web token, para de fato gerar esse token com conteúdo dentro


class SessionsController {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email }).first(); //'first' para pegar apenas um email, e trazer os dados do usuário que possui esse email filtrado

    if(!user) { //se usuário não existir, valor Falso
      throw new AppError("E-mail e/ou senha incorreta", 401); //jogando uma exceção e tratando ela
    }

    const passwordMatched = await compare(password, user.password);

    if(!passwordMatched) { //se a senha não for igual, valor do passwordMatch Falso
      throw new AppError("E-mail e/ou senha incorreta", 401); //jogando uma exceção e tratando ela
    }

    const { secret, expiresIn } = authConfig.jwt; 
    const token = sign({}, secret, { //criando de fato meu token, insiro objeto vazio, a frase secreta e um objeto com o conteúdo e tempo de expiração
      subject: String(user.id), //colocando meu id como conteúdo do token; usando o parse String() para garantir que será string
      expiresIn //data de expiração já configurada como 1 dia em auth.js que, ao importar, chamei aqui de authConfig
    });

    return response.json({ user, token }); //devolvendo usuário e token
  }
}

module.exports = SessionsController;