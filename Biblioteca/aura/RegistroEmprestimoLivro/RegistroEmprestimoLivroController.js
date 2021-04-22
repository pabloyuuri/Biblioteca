({
    // pesquisa leitor
    handleSearchLeitor : function(component, event, helper){
        // se a tecla ENTER tiver sido precissada. - which 13 é a tecla do teclado -> ENTER.
        if (event.which === 13){
            helper.buscaLeitor(component, event);
        }    
    },

    // pesquisar o livro disponível
    handleSearchLivro : function(component, event, helper){
        // which 13 é a tecla do teclado -> ENTER.
        if (event.which === 13){
            // passando componente para ter acesso as variáveis do cmp.
            helper.buscaLivro(component, event);
        }    
    },


    // setando na variável livroId o valor do dataset do element a
    setLeitorId: function(component, event, helper) {
            // tipo empréstimo e devolução 
            // irá setar o id do leitor na variável leitorId.       
            component.set("v.leitorId", event.target.dataset.id);
        
        // tipo devolução
        if (component.get("v.tipo") === "2") { 
            helper.listarPendencias(component, event, helper);
        }
        
    },
    // setando na variável livroId o valor do dataset do element a
    setLivroId: function(component, event, helper) {
        component.set("v.livroId", event.target.dataset.id);
        // chamando função do helper - criar empréstimo.
        helper.criarEmprestimo(component, event, helper);
    },

    
    
    

    
    
    // pegando o id da pendencia para relizar a baixa
    handleBaixa: function(component, event, helper) {
        // id da pendencia
        let pendenciaId = event.target.dataset.id;
        helper.criarDevolucao(component, event, pendenciaId);
    },




 
})