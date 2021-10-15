<p  align="center">
<a href="https://conectando-socios.netlify.app/">
		<img src="/images/logo.png" alt="Logo Conectando Sócios" title="Logo Conectando Sócios" />
	</a>
</p>

#

<p align="center">
  Projeto desenvolvido pro TCC do curso de Engenharia de Software na Instituição Unicesumar.
</p>

<p align="center">
  Api construída com Node JS e MySQL.
</p>

<p align="center">
    <a href="https://github.com/matheusmhq/conectando-socios-react-js/blob/main/LICENSE" alt="license">
        <img src="https://img.shields.io/github/license/matheusmhq/tmdb-react-js?style=plastic" />
    </a>
</p>

<p align="center">
  <a href="#demo">Demo</a> •
  <a href="#bibliotecas">Bibliotecas</a> •
    <a href="#diagrama-de-classes">Diagrama de classes</a> •
  <a href="#rotas">Rotas</a> •
  <a href="#iniciando">Iniciando</a>   
</p>

# Demo

Clique no link para acessar o front em React JS consumindo essa api! 
[Conectando Sócios - Live ◀️](https://conectando-socios.netlify.app/)

## Bibliotecas

As principais bibliotecas usadas nesse projeto:

| Biblioteca             | Descrição   |
| :-------------:|--------------|
| [Node](https://nodejs.org/) | Uma biblioteca JavaScript runtime construída em cima do motor V8 do Chrome. |
| [Express](https://expressjs.com/) | O Express é um framework para aplicativo da web do Node.js mínimo e flexível que fornece um conjunto robusto de recursos para aplicativos web e móvel. |
| [MySQL](https://github.com/sidorares/node-mysql2) | Cliente MySQL para Node.js com foco no desempenho. Suporta instruções preparadas, codificações não utf8, protocolo de log binário, compressão, SSL e muito mais. |

# Diagrama de classes

<p  align="center">
<a href="https://conectando-socios.netlify.app/">
		<img src="/images/class_diagram.jpg" alt="Diagrama de classes do Conectando Sócios" title="Diagrama de calsses do Conectando Sócios" />
	</a>
</p>

# Rotas

- Auth 
    ```
    routes.post("/user/login", AuthController.login);
    ```

- User
    ```
    routes.post("/user/register", UserController.store);
    routes.put("/user/:id/update", UserController.update);
    routes.get("/user/:id", UserController.show);
    routes.get("/verify-email/:email", UserController.verifyEmail);
    routes.post("/user/change-password", UserController.changePassword);
    ```

- State
    ```
    routes.get("/state", StateController.index);
    ```

- City
    ```
    routes.get("/city", CityController.index);
    ```

- Project
    ```
    routes.get("/projects", ProjectController.index);
    routes.post("/project/register", ProjectController.store);
    routes.put("/project/:id/update", ProjectController.update);
    routes.get("/project/:id", ProjectController.show);
    routes.delete("/project/:id", ProjectController.destroy);
    ```

- Project Types
    ```
    routes.get("/project-types", ProjectTypesController.index);
    routes.post("/project-types/register", ProjectTypesController.store);
    routes.put("/project-types/:id/update", ProjectTypesController.update);
    routes.get("/project-types/:id", ProjectTypesController.show);
    routes.delete("/project-types/:id", ProjectTypesController.destroy);
    ```

- Project Save
    ```
    routes.get("/projects-save", ProjectSaveController.index);
    routes.post("/project-save/register", ProjectSaveController.store);
    routes.delete("/project-save/:id", ProjectSaveController.destroy);
    ```

- OBS: Todas as páginas que contém listagem estão **_páginadas_**.

# Iniciando

- Clonar esse repositório

  ```
  git clone git@github.com:matheusmhq/conectando-socios-node.git

  cd conectando-socios-node
  ```

- Instale as dependências

  ```
  yarn install
  ```

- Agora é só rodar **yarn dev**

- A aplicação irá abrir no seguinte endereço `http://localhost:3333`
