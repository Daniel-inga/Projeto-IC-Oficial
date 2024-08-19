var selectAlgoritmo = document.getElementById("Algoritmo");
        
                // Adiciona um listener de evento 'change' ao select
                selectAlgoritmo.addEventListener('change', function() {
                    // Obtém o valor selecionado e armazena em uma variável
                    var algoritmoSelecionado = selectAlgoritmo.value;
                    console.log('Algoritmo selecionado:', algoritmoSelecionado);
                    localStorage.setItem('Algoritmo', algoritmoSelecionado);
                });
                selectAlgoritmo.dispatchEvent(new Event('change'));



                var selectTamanhoPagina = document.getElementById("TamanhoPagina");
    
                // Adiciona um listener de evento 'change' ao select
                selectTamanhoPagina.addEventListener('change', function() {
                    // Obtém o valor selecionado e armazena em uma variável
                    var tamanhoPaginaSelecionado = selectTamanhoPagina.value;
                    console.log('TamanhoPagina selecionado:', tamanhoPaginaSelecionado);
                    localStorage.setItem('TamanhoPagina', tamanhoPaginaSelecionado);
                });
                selectTamanhoPagina.dispatchEvent(new Event('change'));



                var selectTamanhoRAM = document.getElementById("TamanhoRAM");
    
                // Adiciona um listener de evento 'change' ao select
                selectTamanhoRAM.addEventListener('change', function() {
                    // Obtém o valor selecionado e armazena em uma variável
                    var tamanhoRAMSelecionado = selectTamanhoRAM.value;
                    console.log('TamanhoRAM selecionado:', tamanhoRAMSelecionado);
                    localStorage.setItem('TamanhoRAM', tamanhoRAMSelecionado);
                });
                selectTamanhoRAM.dispatchEvent(new Event('change'));



                /*var selectAlocacao = document.getElementById("Alocacao");
    
            // Adiciona um listener de evento 'change' ao select
            selectAlocacao.addEventListener('change', function() {
                // Obtém o valor selecionado e armazena em uma variável
                var AlocacaoSelecionado = selectAlocacao.value;
                console.log('Alocacao selecionado:', AlocacaoSelecionado);
            });
            selectAlocacao.dispatchEvent(new Event('change'));*/



            var selectFrameAllocation = document.getElementById("FrameAllocation");
    
            // Adiciona um listener de evento 'change' ao select
            selectFrameAllocation.addEventListener('change', function() {
                // Obtém o valor selecionado e armazena em uma variável
                var FrameAllocationSelecionado = selectFrameAllocation.value;
                console.log('FrameAllocation selecionado:', FrameAllocationSelecionado);
                localStorage.setItem('FrameAllocation', FrameAllocationSelecionado);
            });
            selectFrameAllocation.dispatchEvent(new Event('change'));


            document.getElementById('SALVAR').addEventListener('click', function() {
                window.location.href = "TelaDeCriacao";
            });