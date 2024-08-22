var processos = JSON.parse(localStorage.getItem('processos'));
var RAM = JSON.parse(localStorage.getItem('RAM'));
var pages = JSON.parse(localStorage.getItem('pages'));
var contaPage = parseInt(localStorage.getItem('contaPage'), 10);
var AlgoritmoSalvo = localStorage.getItem('Algoritmo');
var TamanhoPaginaSalvo = localStorage.getItem('TamanhoPagina');
var TamanhoRAMSalvo = localStorage.getItem('TamanhoRAM');
var quantidadePageRAM = TamanhoRAMSalvo / TamanhoPaginaSalvo;
var PagesExecutadas = [];
var nPageFault = 0;
var RAMLRU = [...RAM.map(row => row[1])].reverse();
console.log("A nova lista de ordem LRU: ", RAMLRU);
var DR = [];
criaArrayDR();
criaArrayPagesExecutadas();
console.log("As Pages Executadas:", PagesExecutadas);
     
console.log('processos:', processos);
console.log('RAM:', RAM);
console.log('pages:', pages);
console.log('contaPage:', contaPage);
console.log('Algoritmo selecionado:', AlgoritmoSalvo);
console.log('Tamanho Página selecionado:', TamanhoPaginaSalvo);
console.log('Tamanho RAM selecionado:', TamanhoRAMSalvo);
console.log('Quantidade de Pages selecionado:', quantidadePageRAM); 

criaVisualizacaoRAM();
//listaExecucao();
resumo();

function criaVisualizacaoRAM(paginaAdicionada) {
    var tabela = document.getElementById("corpoTabela");
        tabela.innerHTML = "";
    
        for (var j = 0; j < quantidadePageRAM; j++) {
            var linha = tabela.insertRow(tabela.rows.length);
            var conteudo1 = linha.insertCell(0);
            var conteudo2 = linha.insertCell(1);

            conteudo1.innerHTML = RAM[j][0]; 
            conteudo2.innerHTML = RAM[j][1];

            if (RAM[j][2] === "Ocupado") {
                if (RAM[j][1] === paginaAdicionada) {
                    conteudo2.classList.add('page-added');
                } else {
                    conteudo2.classList.remove('page-added');
                }
            }
        }
        
}

// Adiciona o evento de clique para iniciar a simulação
document.getElementById('simular').addEventListener('click', iniciarSimulacao);

function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

function iniciarSimulacao() {
    var texto = document.getElementById('texto');
    texto.innerHTML = ''; // Limpa o texto anterior
    criaVisualizacaoRAM();
    criaVisualizacaoDR();
    //Seleciona uma Page aleatória
    var pageAleatoria = pages[getRandomIndex(pages.length)];
    console.log("A page executada é:", pageAleatoria);
    criaPageTable(pageAleatoria);
    var inicio = document.createElement('p');
    inicio.textContent = 'Iniciando execução...';
    texto.appendChild(inicio);
    setTimeout(() => {
        var mensagem = document.createElement('p');
        mensagem.textContent = "Procurando a página: " + pageAleatoria + " na PageTable";
        texto.appendChild(mensagem);

        var resultado = document.getElementById('texto');
        setTimeout(() => {
        var mensagens = ""; // Variável para acumular as mensagens
        var pageFault = true;
        
        for (var i = 0; i < RAM.length; i++) {
            // Verifica se a página está na RAM
            if (pageAleatoria === RAM[i][1]) { // Usando comparação correta
                mensagens += '<p style="color: green;">A page já está na memória RAM!</p>';
                pageFault = false;
                if(AlgoritmoSalvo == "LRU"){
                    var pageNova = PagesExecutadas.at(-1);
                    console.log("A nova page para a RAM: ", pageNova);
                    var primeiraPage = RAMLRU.filter(page => page === pageNova);
                    var restanteLista = RAMLRU.filter(page => page !== pageNova);
                    console.log("primeira page: ", primeiraPage);
                    console.log("restanteLista: ", restanteLista);

                    RAMLRU = [...primeiraPage, ...restanteLista];
                    console.log("A nova lista de ordem LRU: ", RAMLRU);
                }
                setTimeout(() => {
                    var mensagemFinal = document.createElement('p');
                    mensagemFinal.textContent = "Execução encerrada!";
                    texto.appendChild(mensagemFinal);
                }, 1000);
                break;
            } 
        }
        if(pageFault){
                nPageFault += 1; 
                resumo();
                mensagens += '<p style="color: red;">Page Fault!!! A page não está na memória RAM!</p>';
                var condicao = 0;
                for(var i = 0; i < RAM.length; i++){
                    if(RAM[i][1] === "Vazio"){
                        RAM[i][1] = pageAleatoria;
                        RAM[i][2] = "Ocupada;"
                        condicao = 1;
                        atualizaProcessos();
                        RAMLRU = [...RAM.map(row => row[1])].reverse();
                        var restanteDR = DR.filter(page => page !== pageAleatoria);
                        DR = [...restanteDR];
                        console.log("DR: ", DR);
                        setTimeout(() => {
                        criaVisualizacaoRAM();
                        criaVisualizacaoDR();
                        var mensagem = document.createElement('p');
                        mensagem.textContent = "A Page foi inserida na memória RAM!";
                        texto.appendChild(mensagem);
                            setTimeout(() => {
                            var mensagemFinal = document.createElement('p');
                            mensagemFinal.textContent = "Execução encerrada!";
                            texto.appendChild(mensagemFinal);
                            }, 1000);
                        }, 1000);
                        break;
                    }
                }
                if(condicao == 0){
                    trocaRAM();
                    setTimeout(() => {
                        var mensagemFinal = document.createElement('p');
                        mensagemFinal.textContent = "Execução encerrada!";
                        texto.appendChild(mensagemFinal);
                    }, 4000);
                }
                
        }  
        // Atualiza o conteúdo da div com todas as mensagens
        resultado.innerHTML += mensagens;
        
        return resultado;
        }, 1000); // Atraso de 1 segundo antes de mostrar a página aleatória
    }, 1000); // Atraso de 1 segundo antes de iniciar a simulação
    PagesExecutadas.push(pageAleatoria);
    console.log("As Pages Executadas:", PagesExecutadas);
    //listaExecucao();
}   

function criaArrayPagesExecutadas(){
    for(var i = 0; i < RAM.length; i++){
        if(RAM[i][2] === "Ocupado"){
            PagesExecutadas.push(RAM[i][1]);
        }
    }
}

/*function listaExecucao(){
    var container = document.getElementById('container');
    container.innerHTML = '';
    for(var i = 0; i < PagesExecutadas.length; i++){
        var bloco = document.createElement('div');
            bloco.className = 'bloco';
            bloco.textContent = PagesExecutadas[i];
            container.appendChild(bloco);
    }
}*/

function fifo(){
    setTimeout(() => {
    var texto = document.getElementById('texto');
    var mensagem1 = document.createElement('p');
    mensagem1.textContent = 'Realizando a troca...';
    texto.appendChild(mensagem1);

    setTimeout(() => {
    if(RAM.length > 0){
        var indice = 0;
        var pageVelhaRAM = PagesExecutadas.shift();
        var pageNovaRAM = PagesExecutadas.at(-1);


        console.log("A page executada fifo é", pageNovaRAM);

        for(var j = 0; j < RAM.length; j++){
            if(pageVelhaRAM === RAM[j][1]){
                indice = j;
                RAM[indice][1] = "Vazio";
                RAM[indice][2] = "";
                break;
            }
        }
        console.log("indice", indice);
        console.log("page indice", RAM[indice][1]);
        console.log("A page "+ pageVelhaRAM + " foi removida.");

        for(var i = 0; i < RAM.length; i++){
            if(RAM[i][1] === "Vazio"){
                RAM[i][1] = pageNovaRAM;
                RAM[i][2] = "Ocupado";
                break;
            }
        }

        var pageVelhaDR = pageNovaRAM;
        var pageNovaDR = pageVelhaRAM;

            for(var k = 0; k < DR.length; k++){
                if(DR[k] == pageVelhaDR){
                    DR[k] = pageNovaDR;
                }
           }
        console.log("DR: ", DR);
        console.log("RAM após troca: ", RAM);
        criaVisualizacaoRAM(pageNovaRAM);
        criaVisualizacaoDR(pageVelhaRAM);   
        var mensagem2 = document.createElement('p');
            
        mensagem2.textContent = 'A RAM já foi carregada com a page em execução!';
        texto.appendChild(mensagem2);
        atualizaProcessos();
        }
    }, 1000);
}, 1000);
}

function LRU(){
    setTimeout(() => {
        var texto = document.getElementById('texto');
        var mensagem1 = document.createElement('p');
        mensagem1.textContent = 'Realizando a troca...';
        texto.appendChild(mensagem1);
        setTimeout(() => {
            var pageNova = PagesExecutadas.at(-1);
            console.log("A nova page para a RAM: ", pageNova);

            var pageExcluida = RAMLRU.at(-1); 
            console.log("pageExcluida: ", pageExcluida);
            var restanteLista = RAMLRU.filter(page => page !== pageExcluida);
            console.log("primeira page: ", pageNova);
            console.log("restanteLista: ", restanteLista);

            RAMLRU = [pageNova, ...restanteLista];
            console.log("A nova lista de ordem LRU: ", RAMLRU);


            for(var j = 0; j < RAM.length; j++){
                if(pageExcluida === RAM[j][1]){
                    indice = j;
                    RAM[indice][1] = "Vazio";
                    RAM[indice][2] = "";
                    break;
                }
            }

            for(var i = 0; i < RAM.length; i++){
                if(RAM[i][1] === "Vazio"){
                    RAM[i][1] = pageNova;
                    RAM[i][2] = "Ocupado";
                    break;
                }
            }

            var pageVelhaDR = pageNova;
            var pageNovaDR = pageExcluida;

            for(var k = 0; k < DR.length; k++){
                if(DR[k] == pageVelhaDR){
                    DR[k] = pageNovaDR;
                }
           }
        console.log("DR: ", DR);
        console.log("RAM após troca: ", RAM);
        criaVisualizacaoRAM(pageNova);
        criaVisualizacaoDR(pageExcluida);    
        var mensagem2 = document.createElement('p');
            
        mensagem2.textContent = 'A RAM já foi carregada com a page em execução!';
        texto.appendChild(mensagem2);
        atualizaProcessos();
        }, 1000);    
    }, 1000);
}

function trocaRAM(){
    if(AlgoritmoSalvo == "FIFO"){
        fifo();
        console.log("A função FIFO foi chamada!");
    }if (AlgoritmoSalvo == "LRU"){
        LRU();
        console.log("A função LRU foi chamada!");
    }
}

function criaArrayDR(){
    
    for(var i =0; i < processos.length; i++){
        var processo = processos[i];
        for(var j =0; j < processo.matriz.length; j++){
            if(processo.matriz[j][1] === "DR"){
                DR.push(processo.matriz[j][0]);
            }
        }
    }
    console.log("DR: ", DR);
    criaVisualizacaoDR();
}

function criaVisualizacaoDR(paginaRemovida) {
    var tabelaDR = document.getElementById("corpoTabelaDR");
    tabelaDR.innerHTML = "";

    var numColunas = 8; // Defina o número de colunas desejado
    var numLinhas = Math.ceil(DR.length / numColunas); // Calcula o número de linhas necessárias

    for (var linhaIndex = 0; linhaIndex < numLinhas; linhaIndex++) {
        var linha = tabelaDR.insertRow(tabelaDR.rows.length);

        for (var colIndex = 0; colIndex < numColunas; colIndex++) {
            var colunaIndex = linhaIndex * numColunas + colIndex;
            if (colunaIndex < DR.length) {
                var celula = linha.insertCell(colIndex);
                celula.innerHTML = DR[colunaIndex];

                if (DR[colunaIndex] === paginaRemovida) {
                    celula.classList.add('page-removed');
                } else {
                    celula.classList.remove('page-removed');
                }
            }
        }
    }
}

function atualizaProcessos() {
    // Primeiro, marcaremos todas as páginas como "DR"
    for (var j = 0; j < processos.length; j++) {
        var processo = processos[j];
        if (processo && processo.matriz) {
            for (var k = 0; k < processo.matriz.length; k++) {
                processo.matriz[k][1] = "DR";
                processo.matriz[k][2] = "DR"; // Defina a posição como "DR" inicialmente
            }
        }
    }

    // Em seguida, atualizaremos as páginas que estão na RAM
    for (var i = 0; i < RAM.length; i++) {
        var paginaRAM = RAM[i][1];
        for (var j = 0; j < processos.length; j++) {
            var processo = processos[j];
            if (processo && processo.matriz) {
                for (var k = 0; k < processo.matriz.length; k++) {
                    if (paginaRAM === processo.matriz[k][0]) {
                        processo.matriz[k][1] = "RAM";
                        processo.matriz[k][2] = "Posição " + RAM[i][0];
                    }
                }
            }
        }
    }

    // Atualiza o localStorage com os processos atualizados
    localStorage.setItem('processos', JSON.stringify(processos));
    console.log("Processos atualizados: ", processos);
    
    
}

function criaPageTable(pageAleatoria){

    var processoEncontrado = null; 
    for(var i = 0; i < processos.length; i ++){
        var processo = processos[i];
        for (var k = 0; k < processo.matriz.length; k++){
            if(pageAleatoria === processo.matriz[k][0]){
                processoEncontrado = processo;
                break; 
            }
        }
        if(processoEncontrado){
            break; 
        }
    }

    var pageTable = document.getElementById("corpoPageTable");
    pageTable.innerHTML = "";
    if(processoEncontrado){
        for (var j = 0; j < processoEncontrado.matriz.length; j++) {
            var linha = pageTable.insertRow(pageTable.rows.length);
            var conteudo1 = linha.insertCell(0);
            var conteudo2 = linha.insertCell(1);
            var conteudo3 = linha.insertCell(2);

            conteudo1.innerHTML = processo.matriz[j][0]; 
            conteudo2.innerHTML = processo.matriz[j][1];
            conteudo3.innerHTML = processo.matriz[j][2];


            if (processoEncontrado.matriz[j][0] === pageAleatoria) {
                // Define um atraso para aplicar a classe highlight
                (function(linha) {
                    setTimeout(function() {
                        linha.classList.add('highlight');
                    }, 1000); // Atraso de 1000 milissegundos (1 segundo)
                })(linha);
            }
        }
    }
}

function resumo(){
    var texto = document.getElementById('resumo');
    texto.innerHTML = ''; // Limpa o texto anterior

    var mensagem1 = document.createElement('p');
    mensagem1.textContent = 'Tamanho da RAM: '+ TamanhoRAMSalvo+ ' kB';
    texto.appendChild(mensagem1);

    var mensagem2 = document.createElement('p');
    mensagem2.textContent = 'Tamanho das Páginas: '+ TamanhoPaginaSalvo + ' kB';
    texto.appendChild(mensagem2);

    var mensagem3 = document.createElement('p');
    mensagem3.textContent = 'Algoritmo de Substituição de Páginas: '+ AlgoritmoSalvo;
    texto.appendChild(mensagem3);

    var mensagem4 = document.createElement('p');
    mensagem4.textContent = 'Numero de Page Fault: '+ nPageFault;
    texto.appendChild(mensagem4);
}