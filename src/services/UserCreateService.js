//importações necessárias
const  { hash } = require("bcryptjs"); //hash para criptografar a senha, e, compare pra usar na hora de comparar a senha antiga digitada com a que está no banco criptografada na ocasião de alteração de senha

const AppError= require("../utils/AppError");

class UserCreateService {
  constructor(userRepository) {
    this.userRepository = userRepository;

  }

  async execute({ name, email, password }) {
   
    const checkUserExists =  await this.userRepository.findByEmail(email); //uso o await pois é assíncrono lida com requisição para o BD
    
    if(checkUserExists) {
      throw new AppError("Este email já encontra-se em uso.");
    }

    const hashedPassword = await hash(password, 8); //senha e fator de complexidade //Como ese método é uma promise preciso usar o await

    const userCreated = await this.userRepository.create({ name, email, password: hashedPassword });
   
    return userCreated;

  }
}

module.exports = UserCreateService;