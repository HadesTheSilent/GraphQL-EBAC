# Automação de API GraphQL com PactumJS
### Exercício EBAC - Módulo GraphQL e PactumJS

## 📋 Descrição do Projeto

Este projeto implementa testes automatizados de API GraphQL para uma aplicação de e-commerce, incluindo:
- ✅ Testes funcionais de API para Categorias e Produtos
- ✅ Testes de contrato com Joi
- ✅ Geração automática de relatórios HTML
- ✅ Validação de schemas GraphQL

## 🛠️ Tecnologias Utilizadas

- **PactumJS** v3.6.0 - Framework para testes de API REST e GraphQL
- **Mocha** v10.3.0 - Framework de testes JavaScript
- **Joi** v17.11.0 - Validação de schemas para testes de contrato
- **Mochawesome** v7.1.3 - Gerador de relatórios HTML elegantes
- **Faker.js** v8.3.1 - Geração de dados de teste realistas
- **Pactum Matchers** v1.1.6 - Matchers para validação de respostas

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalando dependências

```bash
npm install
```

## 🚀 Executando os Testes

### Todos os testes com relatório
```bash
npm test
```

### Testes GraphQL (Categorias + Produtos)
```bash
npm run test:gql
```

### Testes REST
```bash
npm run test:rest
```

### Testes de Categorias
```bash
npm run test:categories
```

### Testes de Produtos
```bash
npm run test:products
```

### Testes de Contrato
```bash
npm run test:contract
```

### Testes de Contrato Provider/Consumer
```bash
npm run test:contractProvider
npm run test:contractConsumer
```

## 📊 Relatórios

Os relatórios são gerados automaticamente na pasta `reports/` após a execução dos testes.

Para visualizar:
1. Execute qualquer comando de teste
2. Navegue até a pasta `reports/`
3. Abra o arquivo `test-report.html` no navegador

Os relatórios incluem:
- ✅ Resultados detalhados de cada teste
- ✅ Gráficos de sucesso/falha
- ✅ Tempo de execução
- ✅ Stack traces de erros
- ✅ Código dos testes executados

## 🧪 Estrutura de Testes

### 📁 Estrutura do Projeto

```
pactum-contract/
├── test/
│   ├── graphql/
│   │   ├── category.test.js          # Testes de Categorias (GraphQL)
│   │   ├── product.test.js           # Testes de Produtos (GraphQL)
│   │   ├── user.test.js              # Testes de Usuários
│   │   └── login.test.js             # Testes de Login
│   ├── api/
│   │   ├── user.test.js              # Testes REST de Usuários
│   │   └── login.test.js             # Testes REST de Login
│   └── contract/
│       ├── category-product.contract.test.js  # Testes de Contrato
│       ├── loginProvider.test.js              # Provider de Login
│       └── loginConsumer.test.js              # Consumer de Login
├── reports/                           # Relatórios gerados (criado automaticamente)
├── package.json
├── .mocharc.json                      # Configuração do Mocha/Mochawesome
├── .gitignore
├── docker-compose.yml
└── README.md
```

## 🎯 Serviços Testados

### Categorias (Category Service)

#### ✅ addCategory
- Adicionar nova categoria com sucesso
- Validação de erro ao adicionar sem nome
- Validação de erro sem autenticação
- Teste de contrato de resposta

#### ✅ editCategory
- Editar categoria existente com sucesso
- Validação de erro com ID inválido
- Validação de erro sem autenticação
- Teste de contrato de resposta

#### ✅ deleteCategory
- Deletar categoria existente com sucesso
- Validação de erro com ID inválido
- Validação de erro sem autenticação

#### 📋 Listagem
- Listar todas as categorias

---

### Produtos (Product Service)

#### ✅ addProduct
- Adicionar novo produto com sucesso
- Validação de erro ao adicionar sem nome
- Validação de erro com preço inválido
- Validação de erro sem autenticação
- Teste de contrato de resposta

#### ✅ editProduct
- Editar produto existente com sucesso
- Editar apenas campos específicos
- Validação de erro com ID inválido
- Validação de erro sem autenticação
- Teste de contrato de resposta

#### ✅ deleteProduct
- Deletar produto existente com sucesso
- Validação de erro com ID inválido
- Validação de erro sem autenticação

#### 📋 Listagem
- Listar todos os produtos
- Buscar produto por ID

---

## 🔒 Testes de Contrato

### Schemas Validados com Joi

#### Categoria (addCategory)
```javascript
{
  data: {
    addCategory: {
      id: String (required),
      name: String (required)
    }
  }
}
```

#### Produto (addProduct)
```javascript
{
  data: {
    addProduct: {
      id: String (required),
      name: String (required),
      price: Number positive (required),
      description: String (required),
      category: {
        id: String (required),
        name: String (required)
      }
    }
  }
}
```

### Validações Implementadas

- ✅ Tipos de dados corretos (String, Number, etc.)
- ✅ Campos obrigatórios presentes
- ✅ Valores positivos para preços
- ✅ Estrutura de resposta GraphQL válida
- ✅ Relacionamentos entre entidades

## 🌐 Configuração da API

**URL da API GraphQL:** `http://lojaebac.ebaconline.art.br/graphql`

**Credenciais de Teste:**
- Email: `admin@admin.com`
- Senha: `admin123`

## 📝 Exemplos de Uso

### Executando teste específico de Categorias

```bash
npm run test:categories
```

### Executando todos os testes de contrato

```bash
npm run test:contract
```

### Visualizando relatórios

Após executar os testes, abra o relatório no navegador:

```bash
# Windows
start reports/test-report.html

# Mac/Linux
open reports/test-report.html
```

## 🎨 Características dos Testes

### Dados Dinâmicos
- Utiliza Faker.js para gerar dados realistas
- Cada execução utiliza dados diferentes
- Evita conflitos de dados em testes paralelos

### Assertions Robustas
- Validação de schemas com Joi
- Matchers do PactumJS para validações flexíveis
- Verificação de tipos de dados
- Validação de estruturas GraphQL

### Isolamento de Testes
- Setup e teardown adequados
- Cada teste cria seus próprios dados
- Autenticação renovada para cada teste
- Limpeza automática de dados

## 🐛 Troubleshooting

### Erros de autenticação
Verifique as credenciais em cada arquivo de teste:
```javascript
"email": "admin@admin.com",
"password": "admin123"
```

### Timeout nos testes
Aumente o timeout no `.mocharc.json` se necessário:
```json
{
  "timeout": 15000
}
```

### API indisponível
Verifique se a URL da API está acessível:
```bash
curl -X POST http://lojaebac.ebaconline.art.br/graphql
```

## 📚 Documentação Adicional

- [PactumJS Documentation](https://pactumjs.github.io/)
- [Mocha Documentation](https://mochajs.org/)
- [Joi Documentation](https://joi.dev/)
- [Mochawesome Documentation](https://github.com/adamgruber/mochawesome)

## 👨‍💻 Autor

Desenvolvido para o curso EBAC - Engenheiro de Qualidade de Software

## 📄 Licença

ISC License

---

## ✅ Checklist do Exercício

- [x] Criar novo repositório para o módulo
- [x] Implementar testes de API para Categorias
  - [x] addCategory
  - [x] editCategory
  - [x] deleteCategory
- [x] Implementar testes de API para Produtos
  - [x] addProduct
  - [x] editProduct
  - [x] deleteProduct
- [x] Criar suítes de teste separadas para cada serviço
- [x] Implementar testes de contrato com Joi
  - [x] Ao menos um método de Categorias
  - [x] Ao menos um método de Produtos
- [x] Implementar geração de relatórios (Mochawesome)
- [x] Validar contratos usando GraphQL
- [x] Documentação completa

---

**🎉 Projeto completo e pronto para uso!**
