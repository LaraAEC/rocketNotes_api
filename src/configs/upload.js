const path = require("path"); //vamos usar o path para facilitar andar pelas pastas
const multer = require("multer"); //Após instalar, importar a biblioteca multer (usada para fazer o upload do arquivo)
const crypto = require("crypto"); // importando essa biblioteca para gerar um hash para usar no filename

const TMP_FOLDER = path.resolve(__dirname,"..", "..", "tmp"); //dois pontos para sair dessa pasta, depois mais dois pontos pra sair da pasta src, e na raiz teremos uma pasta "tmp" (pasta temporária).

const UPLOADS_FOLDER = path.resolve(TMP_FOLDER,"uploads"); //dentro desta pasta teremos uma pasta "uploads" (pasta onde a foto realmente vai ficar).

const MULTER = {
  storage: multer.diskStorage({
  destination: TMP_FOLDER, //destino, a princípio, pasta temporária
  filename(request, file, callback){ //vamos passar o nome do arquivo através dessa função
    const fileHash = crypto.randomBytes(10).toString("hex"); //criptografei, gerei aleatório preenchendo um intervalo de 10 bytes, coloquei em formato hexadecimal
    const fileName = `${fileHash}-${file.originalname}`; //nome do arquivo será o hash formado e mais o nome original do arquivo importado

    return callback(null, fileName);
  },
  }),
};

module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
}