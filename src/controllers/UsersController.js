//importações necessárias
const  { hash, compare } = require("bcryptjs"); //hash para criptografar a senha, e, compare pra usar na hora de comparar a senha antiga digitada com a que está no banco criptografada na ocasião de alteração de senha

const AppError= require("../utils/AppError");

const UserRepository = require("../repositories/UserRepository");  //importando a lógica do BD que está nesse arquivo

const sqliteConnection = require('../database/sqlite');

const UserCreateService = require("../services/UserCreateService"); //importando a regra de negócio  da criação do usuário
/**********************************************************************************************/ 

class UsersController {
  //função para criar novo usuário
  async create(request, response) {
    const { name, email, password } = request.body; //capturando os dados

    const userRepository = new UserRepository(); //instanciando a classe UserRepository da lógica do BD
    const userCreateService = new UserCreateService(userRepository); //instanciando a classe UserCreateService da lógica da criação do usuário (uma regra de negócio)

    await userCreateService.execute({ name, email, password });
    
    return response.status(201).json();
  }

  //função para atualizar dados
  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection(); //iniciando minha conexão / meu banco de dados para fazer os comandos de run, get, post etc. 
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);
    //selecionando o usuário pelo id, esta variável const user pega o meu usuário com todos os seus campos.

    //Verificação se não houver usuário, joga erro na pilha e manda mensagem.
    if (!user) {
      throw new AppError("Usuário não encontrado.");
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]); //verifica se está trocando por email já existente

    //Verificação se encontrar na tabela o email dado em uso, e, se o id do email dado
    //for diferente do id do usuário(ou seja estiver em uso por outrem) soltar erro e mensagem.
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este email já está em uso.");
    }

    //Se não houver o erro acima, prossegue e atualiza os dados, nome e email do usuário.
    user.name = name ?? user.name; //se existir conteúdo dentro de name, então esse será utilizado, senão vai deixar o que estava na tabela user.
    user.email = email ?? user.email; //se existir conteúdo dentro de email, então esse será utilizado, senão vai deixar o que estava na tabela user.

    //verificação se o usuário digitou a senha nova mas não digitou a senha antiga vou jogar um erro na pilha e mandar mensagem.
    if(password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha.");
    }

    //Se existir o password e o old_password: verificar se a old_password digitada é igual a que já está cadastrada
    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);
      if(!checkOldPassword) { //se checkOldPassword der falso, solto um erro e mensagem
        throw new AppError("A senha antiga não confere.");
      }

      //Prosseguindo e atualizando a senha, se não caiu no if() anterior
      user.password = await hash(password, 8); //usando hash pra criptografar o novo password.
    }


    //Executanddo as atualizações: uso await pego o database e executo o update
    await database.run(`
    UPDATE users SET
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`, 
    [user.name, user.email, user.password, user_id]
    );

    return response.json();
  }
}

module.exports = UsersController;

//Após fazer estas funcionalidades, de uma a uma, não esquecer de criar a rota para tornar esta funcionalidade visível. Isso vale sempre.