const knex = require("../database/knex"); //importando o knex para usá-lo aqui para manipular meu BD universalmente em termo de linguagem de BD.

class TagsController{
  async index(request, response) {
    const user_id = request.user.id;

    const tags = await knex("tags")
    .where({ user_id }) //vai na tabela tags e onde tem o user_id igual a este (não coloquei assim user_id: user_id pois quando são iguais não preciso colocar nesse formato)
    .groupBy("name") //agrupa por nome e remove nomes iguais, para resolver duplicada de nomes de um campo do BD

    return response.json(tags);
  }

}

module.exports = TagsController;

//Após fazer estas funcionalidades, de uma a uma, não esquecer de criar a rota para tornar esta funcionalidade visível. Isso vale sempre.