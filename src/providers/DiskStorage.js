//Uma das funcionalidades da pasta 'provider' a qual guarda algumas funcionalidades

const fs = require("fs"); //importando para lidar com manipulação de arquivos
const path = require('path'); //importando para ajudar na navegação entre pastas
const uploadConfig = require("../configs/upload"); //importando o arquivo 'uploadConfig.js' que contém as pastas temporária e definitiva, e o multer

class DiskStorage { //classe com as duas funções de save e delete / mesmo nome do arquivo

  //função para salvar um arquivo
  async saveFile(file){ //arquivo passado como parâmetro
    await fs.promises.rename( //usando o fs para manipular os arquivos e o rename para realocá-lo. Usando a função rename do fs que serve para realocar arquivo.
      path.resolve(uploadConfig.TMP_FOLDER, file), //passo da onde sai e o nome do arquivo, tirando o arquivo da pasta temporária
      path.resolve(uploadConfig.UPLOADS_FOLDER, file) //passo para onde vai e o nome do arquivo, colocando o arquivo na pasta de uploads
    );
    return file; //retornando as informações desse arquivo
  }

  //função para deletar um arquivo
  async deleteFile(file) { //arquivo passado como parâmetro
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file); //buscando o nosso arquivo (file), que encontra-se localizado dentro do endereço passado aqui.
    
    try {
      await fs.promises.stat(filePath); //usa-se a função stat do fs para buscar o arquivo e mostrar seu estado
    } catch {
      return //uso um return se houver erro para parar minha função sem crashar.
    }

    await fs.promises.unlink(filePath); //usa-se a função do fs unlink para deletar o arquivo
 
  }
}

module.exports = DiskStorage;