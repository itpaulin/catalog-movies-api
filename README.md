# Projeto Backend - Catálogo de Filmes

Este é o backend de uma aplicação para o catálogo de filmes, construída com NestJS e Prisma ORM, utilizando PostgreSQL como banco de dados.

Pré-requisitos
Antes de começar, certifique-se de ter os seguintes softwares instalados em sua máquina:

Node.js (versão 14.x ou superior)
Docker e Docker Compose
npm (gerenciador de pacotes do Node.js)

### Passo a Passo de Configuração

1. Clonar o Repositório

```
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

2. Subir o Banco de Dados PostgreSQL com Docker
   O projeto inclui um arquivo docker-compose.yml que configura e inicia um container com o banco de dados PostgreSQL.

Execute o seguinte comando para subir o banco de dados:

```
docker-compose up -d
```

Este comando iniciará o PostgreSQL em um container Docker, rodando em segundo plano. Lembre-se de ter o Docker e abrir ele em seu computador.

3. Configuração Completa e Inicialização
   Com o banco de dados em execução, você pode configurar e iniciar a aplicação com um único comando:

```
npm run setup
```

Este comando irá:

Instalar as dependências (npm install).
Inicializar o Prisma (npx prisma generate e npx prisma migrate dev).
Iniciar a aplicação em modo de desenvolvimento (npm run start:dev).

A aplicação estará disponível em http://localhost:3000.

4. Outros Comandos Úteis
   Rodar Migrações Prisma: Se você fizer alterações no schema do Prisma e precisar aplicá-las ao banco de dados:

```
npm run prisma:init
```

Acessar o Prisma Studio: Uma interface gráfica para visualizar e editar os dados diretamente no banco:

```
npx prisma studio
```

Parar o Container Docker:

```
docker-compose down
```

Estrutura do Projeto
src/: Contém o código fonte da aplicação.
prisma/: Contém o arquivo schema.prisma que define os modelos do banco de dados.
docker-compose.yml: Arquivo para configurar e rodar o banco de dados PostgreSQL via Docker.
.env: Arquivo de configuração de variáveis de ambiente (não deve ser incluído no controle de versão).

Explicação das Variáveis de Ambiente:
DATABASE_URL: Esta variável é fundamental para a conexão da aplicação com o banco de dados PostgreSQL. O formato da URL segue o padrão postgres://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO.

TMDB_API_KEY: Esta variável é usada para autenticar as requisições à API do TMDB, que fornece os dados dos filmes. Você precisa criar uma conta no TMDB e gerar uma chave de API para obter esses dados.
[Clique aqui para ir para o site do TMDB](https://www.themoviedb.org/settings/api)
