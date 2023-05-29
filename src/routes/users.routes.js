const { Router } = require("express");
const multer = require("multer"); //importando o multer
const uploadConfig = require("../configs/upload"); // importando minhas configurações de upload, arquivo upload.js na pasta de configurações

const UsersController = require("../controllers/UsersController");

const UserAvatarController = require("../controllers/UserAvatarController");

const ensureAuthenticated = require("../middleware/ensureAuthenticated"); // importando meu middleware para utilizar nas rotas

const  usersRoutes = Router();

//Inicializando o multer dentro de uma constante chamada upload
const upload = multer(uploadConfig.MULTER); //A Biblioteca multer foi guardada na constante MULTER lá em seu arquivo de origem para que aqui pudéssemos selecionar outra biblioteca, se necessário, que também seria configurada lá em outra constante.

const usersController = new UsersController(); //instanciando a classe. Toda classe precisa ser instanciada para ser usada.

const userAvatarController = new UserAvatarController();

//ESTA É A CONTINUAÇÃO DO ENDEREÇO (3).
usersRoutes.post("/", usersController.create); //uso está rota para me encaminhar para a funcionalidade que irá criar a table Users.
usersRoutes.put("/", ensureAuthenticated, usersController.update); //uso esta rota para me encaminhar para a funcionalidade que irá atualizar algum dado da table Users, já criada, por isso preciso passar o id desse usuário para fazer a alteração na pessoa certa, ele já vai com o middleware, vou usar esse id na funcionalidade do Controler que é responsável pelo update.
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update); //uso está rota para fazer upload da imagem através do comando upload.single("avatar"), e depois me encaminhar para a funcionalidade que irá atualizar a foto do perfil do usuário que chamo de avatar.

module.exports = usersRoutes;
