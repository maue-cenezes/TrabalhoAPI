<h1 align='center'>Trabalho APIs - Spotify API</h1>
<h4 align='center'>Programação em Scripts - ADSMA4 - Fatec São Caetano do Sul</h4>

Esse trabalho foi proposto pelo professor Semirames pela disciplina _Programação em Scripts_, no 4° semestre do curso de _Análise e Desenvolvimento de Sistemas_. O projeto que escolhemos foi criar uma aplicação web simples que conecta-se com a API `Spotify Web API` para fazer buscas de músicas, artistas e álbuns.

------------  

# Conteúdo
=========================

* [Requisitos](#requisitos)
* [Arquivos](#arquivos)
* [Como usar](#como-usar)
* [Funções](#funções)
* [Tecnologias usadas ](#tecnologias-usadas )
* [Autores](#autores)

--------------

# Requisitos
=========================
Para utilizar o projeto não é necessário fazer nenhuma configuração, apenas baixar os arquivos e executar no navegador!
Entretanto, é importante pontuar que para usar a `Spotify Web API` para fazer buscas é necessário obter e utilizar um `Token de Acesso`. Para obter esse token, alguns processos foram necessários:
* Criar uma conta no Spotify;
* Acessar a página da [Spotify Web API](https://developer.spotify.com/documentation/web-api) e configurar o Dashboard para aplicações;
  * Criar um App e configurá-lo;
* Gerar as credenciais na seção "opções" do aplicativo.

Após isso, foi possível obter as credenciais necessárias para fazer a requisição do `Token de Acesso`, usando a seguinte chamada:
``` javascript
const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', 
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret) 
        },
        body: 'grant_type=client_credentials' 
    });
```
Em um cenário real, seria de suma importância que as informações de `clientId` e `clientSecret` não fossem expostas no código, pois elas são credenciais de um usuário. Porém, tendo em vista que esse proeto tem cunho acadêmico, não entramos no mérito de esconder esses valores.


--------------

# Arquivos
=========================
O projeto contém 4 arquivos:

├── index.html --> Arquivo principal do site;
├── style.css --> Estilos da página;
├── script.js  --> Lógica de busca e interação com a API;
└── .readMe.md -->  Este arquivo.


--------------

# Como usar
=========================  
Para usar o projeto, basta baixar todos os arquivos e executar o `index.html` no seu navegador.
Alternativamente, nós hospedamos o trabalho no domínio do nosso grupo, o qual criamos para essa disciplina. Você pode acessar por aqui: http://projetoprogscript.great-site.net/TrabalhoAPIs/cauejanis/.

--------------  

# Funções
=========================  
O código dentro do arquivo `app.js` contém 4 funções, sendo elas:
- `async function getAccessToken()`
Usada para fazer a requisição do token de acesso, com as credenciais fornecidas;
- `function exibeResultados(item, tipo)`
Usada para percorrer toda a lista de resultados, organizar o conteúdo e exibir no HTML;
- `async function searchSong()`
Usada para fazer a requisição de busca em si, passando os parâmetros fornecidos pelo usuário no HTML;
- `function limpar()`
Usada para limpar a tela, removendo todos os resultados atuais.

Para mais detalhes do funcionamento de cada função, verifique o arquivo `app.js` e veja os comentários! 

--------------  

# Tecnologias usadas  
Para o desenvolvimento do projeto, foram usadas as seguintes tecnologias:
* HTML5: Estrutura básica da página.
* CSS3: Estilos para o layout da página.
* Fontawesome: Framework para estilização via CSS3 de forma ágil e prática.
* JavaScript: Manipulação da lógica de busca e interação com a API do Spotify.
* Spotify Web API: Para buscar dados das músicas.

--------------


# Autores
- Cauê Nunes de Menezes;
- Janis Gabriela Santos de Oliveira


