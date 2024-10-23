const clientId = '4807d59064254ecaabfdd4ed14d68f1f'; //credenciais referentes à conta no spotify criada com o email da fatec
const clientSecret = 'ebcb6a341d214ac7bee5673846a003d6';

//Função para obter o token de acesso
async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', //informação disponível na documentação da API
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret) //transforma esse trecho dentro do parenteses em base64, como descrito necessário na documentação da API
        },
        body: 'grant_type=client_credentials' //informação disponível na documentação da API
    });

    const data = await response.json();
    return data.access_token; //retorna o token de acesso
}


// Função para exibir os resultados
function exibeResultados(item, tipo) {
    const resultsDiv = document.getElementById('results'); //pegar div do html onde serão escritos os resultados
    resultsDiv.innerHTML = ''; // Limpa os resultados anteriores
    resultsDiv.className = 'resultsItem';

    
    for (var i = 0; i < item.length; i++) { //Loop para adicionar as informações de cada música retornada
        const itemElement = document.createElement('div');
        
        let content; //Variável que receberá o conteúdo a ser exibido

        if (tipo === 'track') {
            var preview; //validação para caso a música não tenha preview. Se tiver, adicionará o audio no html.
            if(item[i].preview_url != null) {
                preview ='<audio controls src=' + item[i].preview_url + ' controlsList="nodownload noplaybackrate"></audio>';
            } else {
                preview = "<p>Sem preview disponível</p>";
            }
            
            //Definição do conteúdo a ser inserido para cada música
            content = `
                <li><p><strong>${item[i].name}</strong> <br> 
                <span class="nomeArtista">by ${item[i].artists[0].name}</span></p>
                ${preview}</li>
            `;

        } else if (tipo === 'album') {
            //recebe foto do álbum
            const albumCover = item[i].images.length > 0 ? item[i].images[0].url : '';
           
            //Definição do conteúdo a ser inserido para cada album
            content = `
                <li>
                    <p><strong>${item[i].name}</strong> <br>
                    <img src="${albumCover}" alt="Capa do álbum" style="width: 100px; height: auto;"> <br>
                    <span class="nomeArtista">by ${item[i].artists[0].name}</span></p>
                </li>`;

        } else if (tipo === 'artist') {
            const artistCover = item[i].images.length > 0 ? item[i].images[0].url : ''; //Pega a primeira imagem de capa do artista
            
            //Definição do conteúdo a ser inserido para cada artista
            content = `
                <li>
                    <p><strong>${item[i].name}</strong></p>
                    <img src="${artistCover}" alt="Foto do artista" style="width: 100px; height: auto;">
                </li>`;
                    
        }
                
        //Adiciona de fato o coteúdo ao HTML
        itemElement.innerHTML = content;
        resultsDiv.appendChild(itemElement);
    };
}
        
//Função para limpar a tela, ao pressionar o botão "limpar" no html.
function limpar() {
    var resultsDiv = document.getElementById('results'); //pegar div do html onde serão escritos os resultados
    var filtrosDiv = document.getElementById('filtros');
    var inputs = filtrosDiv.querySelectorAll("input"); //Seleciona todos os elementos do tipo "input" da div filtros
    
    //Limpa os resultados anteriores
    resultsDiv.className = "";
    resultsDiv.innerHTML = null; 
    
    //Para cada input da div filtros, limpa o campo
    inputs.forEach(input => {
        if (input.type == "radio") {
            input.checked = false; //desmarca os radiobuttons
        } else {
            input.value = ""; //esvazia os campos de texto
        }
    })

}
        

// Função para buscar músicas no Spotify em si
async function searchSong() {
    //Verifica a conexão do navegador
    if (!navigator.onLine) {
        //Se offline, mostra a mensagem e sai da função
        document.getElementById('avisoOff').style.display = 'block';
        return;
    } else {
        //Esconde a mensagem caso online
        document.getElementById('avisoOff').style.display = 'none';
    }

    const query = document.getElementById('searchInput').value; //Pegar valor da caixa de texto
    const accessToken = await getAccessToken(); //Pegar token de acesso com base no client id e secret id, na funçao getAccessToken()
    const select = document.querySelector('input[name="tipo"]:checked'); //Pega a seleção do filtro "tipo"
    const tipo = select ? select.value : 'track'; //Se não houver seleção, define "track" como padrão
    var pais = document.getElementById("pais").value //Pega o valor do filtro "País"
    var limite = parseInt(document.getElementById("limite").value); //Tentar pegar o limite
    var offset = parseInt(document.getElementById("offset").value); //Pega o valor do filtro "OffSet"

    const txtBuscar = document.getElementById('searchInput');
    //Verificação de campo vazio, se tiver, chama o estilo para deixar vermelho e a e função para tremer a caixa de texto; dps para a execução da função sem buscar na API
    if (query.trim() == "") {
        txtBuscar.classList.add("animation"); //Chama a animação do CSS
        animation(txtBuscar);
        return;
    } else {
        txtBuscar.classList.remove("animation");
    }

    //Verificação de filtros de busca
    if (pais == "") {
        pais = "BR"; //Define como valor padrão a disponibilidade do Brasil
    }

    if (isNaN(limite) || limite <= 0) {
        limite = 10;  // Definir um valor padrão de 10 caso não de pra converter ou seja < que 1
    } else {
        validarFiltro(document.getElementById("limite"), 50);
    }

    if (isNaN(offset) || offset <= 0) {
        offset = 0;
    } else {
        validarFiltro(document.getElementById("offset"), 1000);
    }

    //Inserir filtros de busca na url da api e fazer a requisição com método GET.
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=${tipo}&market=${pais}&limit=${limite}&offset=${offset}`, { 
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken //token de acesso obtido na função getAccessToken()
        }
    });

    //Validação de erros na requisição para a API
    if (!response.ok) {
        const errorData = await response.json(); //reconhecer o erro
        console.error("Erro na requisição:", errorData); //exibir mensagem de erro
    } else {
        const data = await response.json(); //pegar valor de retorno do Get caso não tenha erros
        
        //Puxa a função exibeResultados e passa o array de retorno de acordo com o filtro
        if (tipo === 'track') {
            exibeResultados(data.tracks.items, tipo);
        } else if (tipo === 'album') {
            exibeResultados(data.albums.items, tipo);
        } else if (tipo === 'artist') {
            exibeResultados(data.artists.items, tipo);
        }
    }
}


//Ativa a função de busca ao clicar "Enter"
document.getElementById('searchInput').addEventListener
    ('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchSong();
        }
    }
);

//Evento para exibir/esconder aba de filtros
const filterButton = document.getElementById('filterButton');
const filtros = document.getElementById('filtros');

filterButton.addEventListener('click', () => {
    if (filtros.classList.contains('show')) {
        filtros.classList.remove('show');
        filtros.classList.add('hide');

        //Espera a transição acabar e remove o display
        setTimeout(() => {
            filtros.style.display = 'none';
            filtros.classList.remove('hide');
        }, 500);
    } else {
        filtros.style.display = 'flex'; 
        setTimeout(() => {
            filtros.classList.add('show');
        }, 10);
    }
});

//Função de animação do searchInput
function animation(campo) {
    const pos = campo.getBoundingClientRect().left; //retorna posição do campo e a distância pra esquerda do viewport (responsivo)
    
    // Vibração: desloca para a esquerda e para a direita
    let cont = 0; //Contador de vibrações

    const i = setInterval(() => {
        if (cont < 10) { 
            //Altera a translação da direita pra esquerda a cada cont++
            campo.style.transform = cont % 2 === 0 ? 'translateX(-2px)' : 'translateX(2px)';
            cont++;
        } else {
            clearInterval(i);
            campo.style.transform = ''; //Reseta pra posição original
        }
    }, 50); //Tempo em ms da translação
}

//Função que valida os inputs dos filtros numéricos
function validarFiltro(campo, limite) {
    if (campo.value > limite) {
        alert("O valor do filtro " + campo.name + " deve ser menor ou igual a " + limite + ".");
    }
}
