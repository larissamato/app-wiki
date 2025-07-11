# Sistema de Base de Conhecimento Empresarial
Este projeto é um sistema abrangente de base de conhecimento, projetado para otimizar o autoatendimento de clientes e a gestão de informações para equipes de suporte. Ele oferece um repositório centralizado para artigos, guias e soluções, melhorando a eficiência operacional e a satisfação do cliente.

### ⚙️ Tecnologias Utilizadas
Este projeto é construído com uma arquitetura moderna e utiliza as seguintes tecnologias:

**Frontend**

React

**Backend**

Laravel (PHP)

**Banco de Dados**

MariaDB

**Serviços Adicionais**

Redis (DragonflyDB): Utilizado para cache, sessões e filas de trabalho.

Nginx: Servidor web e proxy reverso.

Soketi: Servidor de websockets compatível com Pusher para comunicação em tempo real.

Mailpit: Servidor de e-mail de desenvolvimento para testar o envio de e-mails.

Minio: Servidor de armazenamento de objetos compatível com S3 para anexos de artigos.

### 🚀 Configuração do Ambiente de Desenvolvimento
Siga os passos abaixo para configurar e executar o projeto em seu ambiente local:

>Pré-requisitos:
Certifique-se de ter o Docker e o Node instalados em sua máquina

**Passos de Configuração**
- Clonar o repositório
```bash
git clone https://github.com/larissamato/app-wiki
cd app-wiki
```

- Configurar Variáveis de Ambiente:

Crie um arquivo .env na raiz do web e na raiz da api, copiando o arquivo de exemplo:
```bash
cd web
cp .env.example .env

cd api
cp .env.example .env
```

- Iniciar o backend:
```bash
cd api
composer install
docker-compose up -d --build
docker-compose exec app php artisan migrate:fresh && docker-compose exec app php artisan db:seed --class TestingAppWebSeeder
```
- Documentação swagger do backend:
```bash
cd api
npm install
npm run dev
```
O backend estará disponível no endereço local [http://localhost:4501/apidoc](http://localhost:4501/apidoc)

- Mailpit:
O servidor de teste de email estará disponível no endereço local [http://localhost:8025/](http://localhost:8025/)

- Iniciar po frontend:
```bash
cd web
npm install
npm run dev
```
O frontend estará disponível no endereço local [http://localhost:5173/](http://localhost:5173/) ou [http://localhost:5174/](http://localhost:5174/)

### 🔒 Acessos
O usuário admin -> admin@testing.local
O usuário comum -> customer@testing.local
Senha de ambos -> password
