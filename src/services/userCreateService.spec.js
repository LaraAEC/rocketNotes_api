const UserCreateService = require('./UserCreateService');
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory");
const AppError = require('../utils/AppError');

describe("UserCreateService", () => {
  //declarando/criando as variáveis do repositório e do serviço e atribuindo o valor inicial de 'null'
  let userRepositoryInMemory  = null;
  let userCreateService = null;

  beforeEach(() => {
    //instanciando todas as classes que vamos precisar usar
    userRepositoryInMemory  = new UserRepositoryInMemory(); //instanciando nosso repositório
    userCreateService = new UserCreateService(userRepositoryInMemory); //instanciando nosso serviço passando como parâmetro nosso repositório.
    
  });

  it("user should be create", async () => {
    //criando os dados do usuário a ser cadastrado
    const user = {
      name: "User Test",
      email: "user@test.com",
      password: "123"
    };

    //Guardando na constante userCreate o retorno do cadastro do usuário 'user', traz um id nele além dos demais dados
    const userCreated = await userCreateService.execute(user);
  
    //esperando que ao criar o usuário retorne-se um 'id'
    expect(userCreated).toHaveProperty("id");
  });

  it("user not should be created with exists email", async () => {
    //Usuários criados com mesmo email, criação dos dados dos usuários
    const user1 = { 
      name: "User Test 1",
      email: "user@test.com",
      password: "123"
    };

    const user2 = {
      name: "User Test 2",
      email: "user@test.com",
      password: "456"
    };

    //cadastrando com o CreateService o primeiro usuário
    await userCreateService.execute(user1); 

    //tentando cadastrar o segundo usuário dentro do expect, esperando que seja rejeitado, e que seja igual a um new AppError com essa mensagem de erro.
    await expect(userCreateService.execute(user2)).rejects.toEqual(new AppError("Este email já encontra-se em uso."));
  });
});
 