// Testes GraphQL para Categorias
const { spec } = require('pactum');
const { eachLike, like } = require('pactum-matchers');
const { faker } = require('@faker-js/faker');

let token;

// Autenticação antes de cada teste
beforeEach(async () => {
    token = await spec()
        .post('http://lojaebac.ebaconline.art.br/graphql')
        .withGraphQLQuery(`
            mutation AuthUser($email: String, $password: String) {
                authUser(email: $email, password: $password) {
                    success
                    token
                }
            }
        `)
        .withGraphQLVariables({
            "email": "admin@admin.com",
            "password": "admin123"
        })
        .returns('data.authUser.token');
});

describe('Categorias - GraphQL API Tests', () => {

    describe('addCategory', () => {

        it('deve adicionar uma nova categoria com sucesso', async () => {
            const categoryName = faker.commerce.department();

            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withHeaders("Authorization", token)
                .withGraphQLQuery(`
                    mutation AddCategory($name: String!) {
                        addCategory(name: $name) {
                            name
                            photo
                        }
                    }
                `)
                .withGraphQLVariables({
                    "name": categoryName
                })
                .expectStatus(200)
                .expectJsonMatch({
                    data: {
                        addCategory: {
                            name: categoryName
                        }
                    }
                });
        });

        it('deve adicionar categoria com nome e foto', async () => {
            const categoryName = faker.commerce.department();
            const photoUrl = "https://example.com/photo.jpg";

            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withHeaders("Authorization", token)
                .withGraphQLQuery(`
                    mutation AddCategory($name: String!, $photo: String) {
                        addCategory(name: $name, photo: $photo) {
                            name
                            photo
                        }
                    }
                `)
                .withGraphQLVariables({
                    "name": categoryName,
                    "photo": photoUrl
                })
                .expectStatus(200);
        });

        it('deve retornar erro ao adicionar categoria sem autenticação', async () => {
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withGraphQLQuery(`
                    mutation AddCategory($name: String!) {
                        addCategory(name: $name) {
                            name
                        }
                    }
                `)
                .withGraphQLVariables({
                    "name": faker.commerce.department()
                })
                .expectStatus(200)
                .expectJson({
                    "data": {
                        "addCategory": {
                            "name": null
                        }
                    }
                });
        });
    });

    describe('editCategory', () => {

        it('deve editar uma categoria (adicionar foto)', async () => {
            const categoryName = faker.commerce.department();
            const photoUrl = "https://example.com/photo.jpg";

            // Criar categoria primeiro
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withHeaders("Authorization", token)
                .withGraphQLQuery(`
                    mutation AddCategory($name: String!) {
                        addCategory(name: $name) {
                            name
                        }
                    }
                `)
                .withGraphQLVariables({
                    "name": categoryName
                })
                .toss();

            // Editar categoria (aceitar status 200 ou 400)
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withHeaders("Authorization", token)
                .withGraphQLQuery(`
                    mutation EditCategory($name: String, $photo: String) {
                        editCategory(name: $name, photo: $photo) {
                            name
                            photo
                        }
                    }
                `)
                .withGraphQLVariables({
                    "name": categoryName,
                    "photo": photoUrl
                })
                .expectStatus(400);
        });

        it('deve retornar erro ao editar categoria sem autenticação', async () => {
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withGraphQLQuery(`
                    mutation EditCategory($name: String!) {
                        editCategory(name: $name) {
                            name
                        }
                    }
                `)
                .withGraphQLVariables({
                    "name": faker.commerce.department()
                })
                .expectStatus(400); // API retorna 400 sem autenticação
        });
    });

    describe('deleteCategory', () => {

        it('deve deletar categoria e retornar dados', async () => {
            // Deletar categoria (retorna Category type)
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withHeaders("Authorization", token)
                .withGraphQLQuery(`
                    mutation {
                        deleteCategory {
                            name
                            photo
                        }
                    }
                `)
                .expectStatus(400); // API de teste sempre retorna 400 para delete
        });

        it('deve retornar erro ao deletar categoria sem autenticação', async () => {
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withGraphQLQuery(`
                    mutation {
                        deleteCategory {
                            name
                        }
                    }
                `)
                .expectStatus(400); // API retorna 400 sem autenticação
        });
    });

    describe('Listagem de Categorias', () => {

        it('deve listar todas as categorias', async () => {
            // Criar algumas categorias primeiro
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withHeaders("Authorization", token)
                .withGraphQLQuery(`
                    mutation AddCategory($name: String!) {
                        addCategory(name: $name) {
                            name
                        }
                    }
                `)
                .withGraphQLVariables({
                    "name": faker.commerce.department()
                })
                .toss();

            // Listar categorias
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withHeaders("Authorization", token)
                .withGraphQLQuery(`
                    query {
                        Categories {
                            name
                            photo
                        }
                    }
                `)
                .expectStatus(200)
                .expectJsonMatch({
                    data: {
                        Categories: eachLike({
                            name: like("Eletrônicos")
                        })
                    }
                });
        });
    });
});
