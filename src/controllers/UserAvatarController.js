const knex = require("../database/knex");

const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarController {
  async update(request, response){
    const user_id = request.user.id; //buscando o id do usuário
    const avatarFileName = request.file.filename; //buscando o arquivo que foi mandado pelo usuário, que ele fez o upload
    
    const diskStorage = new DiskStorage(); //instanciando essa classe para usar neste código

    const user = await knex("users") //ir na tabela 'users'
    .where({ id: user_id }).first() //e buscar onde o id do usuário seja igual ao user_id

    if(!user) { //verificando se o usuário existe
      throw new AppError("Somente usuários autenticados podem mudar o avatar", 401);
    }

    if(user.avatar){ //verificando se dentro do usuário já existe um avatar
      await diskStorage.deleteFile(user.avatar); //usando a função deleteFile da classe diskStorage passando como parâmetro o que desejo deletar
    }

    const filename = await diskStorage.saveFile(avatarFileName); //salvando a foto que foi feita upload e guardando nessa constante
    user.avatar = filename; //alterando meu campo avatar

    await knex("users").update(user).where({ id: user_id }); //salvando no BD, atualizando meu BD

    return response.json(user); //retornando o usuário com a imagem já atualizada
  }
}

module.exports = UserAvatarController;