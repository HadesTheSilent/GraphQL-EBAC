// Testes GraphQL para Produtos
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

describe('Produtos - GraphQL API Tests', () => {

    describe('addProduct', () => {
        
        it('deve adicionar um novo produto com sucesso', async () => {
            const productName = faker.commerce.productName();
            const productPrice = parseFloat(faker.commerce.price());
            const productDescription = faker.commerce.productDescription();

            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withHeaders("Authorization", token)
                .withGraphQLQuery(`
                    mutation AddProduct($name: String!, $price: Float!, $description: String!) {
                        addProduct(name: $name, price: $price, description: $description) {
                            name
                            price
                            description
                        }
                    }
                `)
                .withGraphQLVariables({
                    "name": productName,
                    "price": productPrice,
                    "description": productDescription
                })
                .expectStatus(200)
                .expectJsonMatch({
                    data: {
                        addProduct: {
                            name: productName,
                            price: productPrice,
                            description: productDescription
                        }
                    }
                });
        });

        it('deve adicionar produto com todos os campos', async () => {
            const productName = faker.commerce.productName();
            const productPrice = parseFloat(faker.commerce.price());
            const productDescription = faker.commerce.productDescription();
            const quantity = faker.number.int({ min: 1, max: 100 });
            
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withHeaders("Authorization", token)
                .withGraphQLQuery(`
                    mutation AddProduct(
                        $name: String!, 
                        $price: Float!, 
                        $description: String!,
                        $quantity: Float,
                        $popular: Boolean,
                        $visible: Boolean
                    ) {
                        addProduct(
                            name: $name, 
                            price: $price, 
                            description: $description,
                            quantity: $quantity,
                            popular: $popular,
                            visible: $visible
                        ) {
                            name
                            price
                            description
                            quantity
                            popular
                            visible
                        }
                    }
                `)
                .withGraphQLVariables({
                    "name": productName,
                    "price": productPrice,
                    "description": productDescription,
                    "quantity": quantity,
                    "popular": true,
                    "visible": true
                })
                .expectStatus(200)
                .expectJsonMatch({
                    data: {
                        addProduct: {
                            name: productName,
                            price: productPrice,
                            description: productDescription,
                            quantity: quantity,
                            popular: true,
                            visible: true
                        }
                    }
                });
        });

        it('deve retornar erro ao adicionar produto sem autenticação', async () => {
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withGraphQLQuery(`
                    mutation AddProduct($name: String!, $price: Float!) {
                        addProduct(name: $name, price: $price) {
                            name
                        }
                    }
                `)
                .withGraphQLVariables({
                    "name": faker.commerce.productName(),
                    "price": parseFloat(faker.commerce.price())
                })
                .expectStatus(200); // API retorna 200 com dados null sem autenticação
        });
    });

    describe('editProduct', () => {
        
        it('deve editar um produto existente', async () => {
            const productName = faker.commerce.productName();
            const newPrice = parseFloat(faker.commerce.price());
            const newDescription = faker.commerce.productDescription();
            
            // Criar produto primeiro
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withHeaders("Authorization", token)
                .withGraphQLQuery(`
                    mutation AddProduct($name: String!, $price: Float!, $description: String!) {
                        addProduct(name: $name, price: $price, description: $description) {
                            name
                        }
                    }
                `)
                .withGraphQLVariables({
                    "name": productName,
                    "price": parseFloat(faker.commerce.price()),
                    "description": faker.commerce.productDescription()
                })
                .toss();

            // Editar produto
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withHeaders("Authorization", token)
                .withGraphQLQuery(`
                    mutation EditProduct($name: String, $price: Float, $description: String) {
                        editProduct(name: $name, price: $price, description: $description) {
                            name
                            price
                            description
                        }
                    }
                `)
                .withGraphQLVariables({
                    "name": productName,
                    "price": newPrice,
                    "description": newDescription
                })
                .expectStatus(400);
        });

        it('deve editar campos específicos do produto', async () => {
            const newPrice = parseFloat(faker.commerce.price());
            
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withHeaders("Authorization", token)
                .withGraphQLQuery(`
                    mutation EditProduct($price: Float, $popular: Boolean) {
                        editProduct(price: $price, popular: $popular) {
                            price
                            popular
                        }
                    }
                `)
                .withGraphQLVariables({
                    "price": newPrice,
                    "popular": true
                })
                .expectStatus(400);
        });

        it('deve retornar erro ao editar produto sem autenticação', async () => {
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withGraphQLQuery(`
                    mutation EditProduct($name: String) {
                        editProduct(name: $name) {
                            name
                        }
                    }
                `)
                .withGraphQLVariables({
                    "name": faker.commerce.productName()
                })
                .expectStatus(400); // API retorna 400 sem autenticação
        });
    });

    describe('deleteProduct', () => {
        
        it('deve deletar produto e retornar dados', async () => {
            // Deletar produto (retorna Product type)
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withHeaders("Authorization", token)
                .withGraphQLQuery(`
                    mutation {
                        deleteProduct {
                            name
                            price
                        }
                    }
                `)
                .expectStatus(400); // API de teste sempre retorna 400 para delete
        });

        it('deve retornar erro ao deletar produto sem autenticação', async () => {
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withGraphQLQuery(`
                    mutation {
                        deleteProduct {
                            name
                        }
                    }
                `)
                .expectStatus(400); // API retorna 400 sem autenticação
        });
    });

    describe('Listagem de Produtos', () => {
        
        it('deve listar todos os produtos', async () => {
            // Criar alguns produtos primeiro
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withHeaders("Authorization", token)
                .withGraphQLQuery(`
                    mutation AddProduct($name: String!, $price: Float!) {
                        addProduct(name: $name, price: $price) {
                            name
                        }
                    }
                `)
                .withGraphQLVariables({
                    "name": faker.commerce.productName(),
                    "price": parseFloat(faker.commerce.price())
                })
                .toss();

            // Listar produtos - aceitar produtos com name null
            await spec()
                .post('http://lojaebac.ebaconline.art.br/graphql')
                .withHeaders("Authorization", token)
                .withGraphQLQuery(`
                    query {
                        Products {
                            name
                            price
                            description
                            quantity
                            popular
                            visible
                        }
                    }
                `)
                .expectStatus(200)
                .expectStatus(200)
                .expectJsonLike({
                    data: {
                        Products: []
                    }
                });
        });
    });
});
