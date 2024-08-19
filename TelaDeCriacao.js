var AlgoritmoSalvo = localStorage.getItem('Algoritmo');
console.log('Algoritmo selecionado:', AlgoritmoSalvo);
var TamanhoPaginaSalvo = localStorage.getItem('TamanhoPagina');
console.log('Tamanho Página selecionado:', TamanhoPaginaSalvo);
var TamanhoRAMSalvo = localStorage.getItem('TamanhoRAM');
console.log('Tamanho RAM selecionado:', TamanhoRAMSalvo);
var quantidadePageRAM = TamanhoRAMSalvo / TamanhoPaginaSalvo;
console.log('Quantidade de Pages selecionado:', quantidadePageRAM);
var AlgoritmoFrameSalvo = localStorage.getItem('FrameAllocation');
console.log('Tipo de Frame allocation:', AlgoritmoFrameSalvo);       

var PagesExecutadas = [];
var processos = [];
var pages = [];
var RAM = [];
var contaPage = 0;
var pageocupadasRAM = 0;

criarRAMVazia();
criaVisualizacaoRAM();

function criaVisualizacaoRAM(paginaAdicionada) {
    var tabela = document.getElementById("corpoTabela");
        tabela.innerHTML = "";
    
        for (var j = 0; j < quantidadePageRAM; j++) {
            var linha = tabela.insertRow(tabela.rows.length);
            var conteudo1 = linha.insertCell(0);
            var conteudo2 = linha.insertCell(1);

            conteudo1.innerHTML = RAM[j][0]; 
            conteudo2.innerHTML = RAM[j][1];

            if (RAM[j][2] === "Ocupado" && RAM[j][1] === paginaAdicionada) {
                conteudo2.classList.add('page-added');
            } else if (RAM[j][2] === "Ocupado") {
                conteudo2.classList.remove('page-added');
            }
        }
        
}

function criarProcesso(){
    var tamanhoPaginaSalvo = parseInt(localStorage.getItem('TamanhoPagina'));//Tam. da pag. estipulado na conf.
    var tamanhoProcesso = parseInt(document.getElementById("TamanhoProcesso").value.trim());//Tam. processo digitado 
    var numeroPages =  Math.ceil(tamanhoProcesso / tamanhoPaginaSalvo);//numero pages do processo criado
    console.log('tamanhoPaginaSalvo', tamanhoPaginaSalvo);
    console.log('Numero de Pages', numeroPages);
    var nomeProcesso = document.getElementById("NomeProcesso").value.trim();//recebe o nome do processo
    console.log("Valor do nome do processo:", nomeProcesso);

    if (nomeProcesso === "" || nomeProcesso.length > 1) { // processo nao pode ser maior que uma letra e nem em branco
        alert("Por favor, preencha o nome do processo válido.");
        return;
    }

    if (isNaN(tamanhoProcesso) ) {//Não pode estar enulo o tamanho do processo
        alert("Por favor, preencha um valor válido para tamanho do processo.");
        return;
    }

    if (processos.length >= 14) {
        alert("O número máximo de processos é 14.");
        return;
    }

    var Processo = { // Cria objeto Processo
        nome: nomeProcesso,
        tamanho: tamanhoProcesso,
        numeroPages: numeroPages,
        matriz: []
    };

    for (var i = 0; i < processos.length; i++) { //impossibilita o mesmo nome de processos
        if (nomeProcesso === processos[i].nome) {
            alert("Já existe um processo com este nome!");
            return;
        }
    }

    for(i=0; i < numeroPages; i++){ //Cria Matriz do Processo
        Processo.matriz[i] = [];
        Processo.matriz[i][0] = "Page " + i + " " + nomeProcesso; //Coluna 1 = Nome da Page
        Processo.matriz[i][1] = "DR"; //Coluna 2 = Identificador = Está na Ram (RAM) ou não (DR)?
        Processo.matriz[i][2] = "DR"; //Atribui a posiçao na memoria
        pages.push(Processo.matriz[i][0]); //Armazena as novas pages na matriz pages
        localStorage.setItem('pages', JSON.stringify(pages));//salva a matriz pages atualizada em localStorage
    }

    processos.push(Processo);//armazena o processo novo na matriz processos
    console.log('Novo Processo: ', processos);//Imprime a matriz processos
    console.log('Pages: ', pages);//imprime a matriz pages
    localStorage.setItem('processos', JSON.stringify(processos));//armazena processos (atualizado) em localStorage
    criarListaProcessos(processos);//Chama a função criar lista de processos
    
    contaPagesCriadas(processos);//Chama a função conta Pages
    
    document.getElementById("TamanhoProcesso").value = " ";//Reinicializa o campo Tamanho
    document.getElementById("NomeProcesso").value = " ";//Reinicializa o campo nome

    atualizaRAM();
}

function contaPagesCriadas(processos){
    contaPage = 0;
    for (i = 0; i < processos.length; i++){
        contaPage = contaPage + processos[i].numeroPages;//Roda o loop ate contar todos os 
    console.log('Pages Total = ', contaPage);//imprime            //numeros de pages de 
    }                                                                    //cada processo na matriz processo
}

function criarListaProcessos(processos){
    var Lista = document.getElementById("corpoLista");
    Lista.innerHTML = "";
    
    for (var i = 0; i < processos.length; i++){
        var linha = Lista.insertRow(Lista.rows.length);
        var conteudo1 = linha.insertCell(0);
        var conteudo2 = linha.insertCell(1);
        //var conteudo3 = linha.insertCell(2);
        conteudo1.innerHTML = "Processo " + processos[i].nome;
        conteudo2.innerHTML = "Quantidade de Pages " + processos[i].numeroPages;
        //conteudo3.innerHTML = "Pages na RAM: " + pagesnaRAM;
    }
}

function limparProcessos(){
    processos = [];
    pages = [];
    localStorage.removeItem('processos');
    localStorage.removeItem('pages');
    var Lista = document.getElementById("corpoLista");
    Lista.innerHTML = "";
    
    contaPagesCriadas(processos);
    console.log('Processos excluídos.');
    pageocupadasRAM = 0;
    criarRAMVazia();
    BarraProgrssoRAM();
}

function criarRAMVazia() {

    RAM = [];
    for(var i = 0; i < quantidadePageRAM; i++){
        RAM[i] = []; 
        RAM[i][0] = i;
        RAM[i][1] = "Vazio";
    } 
    console.log('RAM:', RAM); 
}

function atualizaRAM() {
    // Limpa a RAM antes de adicionar novas páginas
    RAM.forEach(entry => {
        entry[1] = "Vazio"; // Marca como vazio
        entry[2] = ""; // Limpa a informação adicional
    });

    let ramIndex = 0; // Índice atual na RAM para alocação
    pageocupadasRAM = 0; // Reseta a contagem

    // Obtém o algoritmo de alocação salvo
    var AlgoritmoFrameSalvo = localStorage.getItem('FrameAllocation');
    console.log('Algoritmo de Frame Allocation:', AlgoritmoFrameSalvo);

    if (AlgoritmoFrameSalvo === 'Igual') {
        let numProcesses = processos.length;

        if (numProcesses === 0) {
            console.log('Nenhum processo para alocar.');
            return;
        }

        // Calcula o número de páginas que cada processo deve receber
        let pagesPerProcess = Math.floor(quantidadePageRAM / numProcesses);
        console.log('Número de processos:', numProcesses);
        console.log('Páginas por processo (Igual):', pagesPerProcess);

        // Itera sobre todos os processos
        for (let i = 0; i < processos.length; i++) {
            let processo = processos[i];
            let numPagesToAdd = pagesPerProcess; // Cada processo recebe o mesmo número de páginas

            // Adiciona as páginas de forma sequencial
            for (let j = 0; j < numPagesToAdd; j++) {
                if (ramIndex >= quantidadePageRAM) break; // Verifica se ainda há espaço na RAM

                // Atualiza a RAM com a página
                if (j < processo.matriz.length) { // Verifica se a matriz do processo tem a página
                    RAM[ramIndex][1] = processo.matriz[j][0]; // Nome da página
                    RAM[ramIndex][2] = "Ocupado"; // Marca como ocupado
                    ramIndex++; // Move para o próximo índice na RAM
                }
            }
        }
    } else if (AlgoritmoFrameSalvo === 'Proporcional à tamanho') {
        // Calcular o total de tamanho dos processos
        let totalTamanhoProcessos = processos.reduce((total, processo) => total + processo.tamanho, 0);
        console.log('Tamanho total dos processos:', totalTamanhoProcessos);

        // Itera sobre todos os processos
        for (let i = 0; i < processos.length; i++) {
            let processo = processos[i];
            let proporcao = processo.tamanho / totalTamanhoProcessos;
            let numPagesToAdd = Math.round(proporcao * quantidadePageRAM); // Quantidade proporcional de páginas

            console.log('Processo:', processo.nome);
            console.log('Número de páginas a adicionar (Proporcional à tamanho):', numPagesToAdd);

            // Adiciona as páginas de forma sequencial
            for (let j = 0; j < numPagesToAdd; j++) {
                if (ramIndex >= quantidadePageRAM) break; // Verifica se ainda há espaço na RAM

                // Atualiza a RAM com a página
                if (j < processo.matriz.length) { // Verifica se a matriz do processo tem a página
                    RAM[ramIndex][1] = processo.matriz[j][0]; // Nome da página
                    RAM[ramIndex][2] = "Ocupado"; // Marca como ocupado
                    ramIndex++; // Move para o próximo índice na RAM
                }
            }
        }
    } else {
        console.error('Algoritmo de Frame Allocation desconhecido.');
    }

    pageocupadasRAM = ramIndex;

    // Atualiza a exibição da RAM
    console.log('RAM Atualizada:', RAM);
    BarraProgrssoRAM();
    atualizaProcesso();
    carregarRAM();
}

function BarraProgrssoRAM(){
    var capacidadeRAM = quantidadePageRAM;
    var capacidadeUsada = pageocupadasRAM;
    var porcentagem = 0;
    
    if (capacidadeUsada <= capacidadeRAM) {
        porcentagem = parseInt((capacidadeUsada / capacidadeRAM) * 100);
    }
    else {
        porcentagem = 100;
    }
    var barraProgresso = document.getElementById('barraProgressoRAM');
    barraProgresso.value = porcentagem;

    var porcentagemValor = document.getElementById('Porcentagem');
    porcentagemValor.textContent = porcentagem + '%';
}

function atualizaProcesso() {
    // Limpa a informação de localização na RAM de todos os processos
    processos.forEach(processo => {
        processo.matriz.forEach(page => {
            page[1] = "DR"; // Identificador padrão (não está na RAM)
            page[2] = "DR"; // Informação de localização padrão
        });
    });

    // Atualiza a informação da RAM nos processos
    RAM.forEach(entry => {
        if (entry[1] !== "Vazio") { // Se a página não estiver vazia
            // Encontre o processo correspondente
            processos.forEach(processo => {
                processo.matriz.forEach(page => {
                    if (page[0] === entry[1]) { // Verifica se a página corresponde
                        page[1] = "RAM"; // Marca como na RAM
                        page[2] = "Posição " + entry[0]; // Atualiza a posição na memória
                    }
                });
            });
        }
    });

    // Imprime o array processos atualizado
    console.log('Processos Atualizados:', processos);
}

document.getElementById('proximo').addEventListener('click', function() {
    salvarDados();
    // Redirecionar para a TelaDeSimulacao
    window.location.href = "TelaDeSimulacao";
});

function salvarDados() {
    localStorage.setItem('processos', JSON.stringify(processos));
    localStorage.setItem('pages', JSON.stringify(pages));
    localStorage.setItem('quantidadePageRAM', quantidadePageRAM);
    localStorage.setItem('RAM', JSON.stringify(RAM));
    localStorage.setItem('pageocupadasRAM', pageocupadasRAM);
    console.log('Dados salvos em localStorage.');
}

function carregarRAM() {
    //criaArrayPagesExecutadas();
    var texto = document.getElementById('texto');
    texto.innerHTML = ''; // Limpa o texto anterior

    var inicio = document.createElement('p');
    inicio.textContent = 'Carregando a memória de acordo com o algoritmo ' + AlgoritmoFrameSalvo;
    texto.appendChild(inicio);

    setTimeout(() => {
        var inicio = document.createElement('p');
        inicio.textContent = 'Carregando as pages do novo processo criado...' ;
        texto.appendChild(inicio);
        setTimeout(() => {
            criaVisualizacaoRAM();
        }, 1000);
    }, 1000);
    setTimeout(() => {
        var inicio = document.createElement('p');
        inicio.textContent = 'RAM carregada com sucesso!' ;
        texto.appendChild(inicio);
    }, 3000);
}

/*function criaArrayPagesExecutadas(){
    for(var i = 0; i < RAM.length; i++){
        if(RAM[i][2] === "Ocupado"){
            PagesExecutadas.push(RAM[i][1]);
        }
    }
}*/

//document.getElementById('').addEventListener('click', carregarRAM);
