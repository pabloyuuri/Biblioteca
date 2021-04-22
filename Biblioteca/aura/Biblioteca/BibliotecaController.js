({
    init : function(component, event, helper) {
        helper.livros(component, event, helper);
        helper.leitores(component, event, helper);
        helper.registrosPedidos(component, event, helper);
    },
    // ABRINDO MODALS
    openCadastroLeitor: function(component) {
        component.set("v.modalCadastroLeitor", true);
    },

    openCadastroLivro : function(component) {
        component.set("v.modalCadastroLivro", true);
    },
    
    openCadastroEmprestimo: function(component, event) {
        component.set("v.modalCadastroEmprestimo", true);
    },

    openCadastroDevolucao: function(component, event) {
        component.set("v.modalCadastroDevolucao", true);
    },

    
    // FECHANDO MODALS 
    handleClickButtonleitor: function(component) {
            component.set("v.modalCadastroLeitor", false);    
    },

    handleClickButtonLivro: function(component) {
        component.set("v.modalCadastroLivro", false);
    },

    handleClickButtonEmprestimo: function(component) {
        component.set("v.modalCadastroEmprestimo", false);
    },

    handleClickButtonDevolucao: function(component) {
        component.set("v.modalCadastroDevolucao", false);
    },



    // FECHAR MODALS COM EVENT PERSONALIZADO
    handleModalUpdateTable: function(component, event, helper) {

        let tipo = event.getParam("tipo");

        console.log(tipo);

        if (tipo === "emprestimo") {
            // LISTA DE PENDENCIAS 
            helper.registrosPedidos(component, event, helper);
            component.set("v.", false);
        }
        else if (tipo === "devolucao") {
            helper.registrosPedidos(component, event, helper);
            component.set("v.modalCadastroDevolucao", false);

        }
        else if (tipo === "livro") {
            helper.livros(component, event, helper);
            component.set("v.modalCadastroLivro", false);
        }
        else if (tipo === "leitor") {
            helper.leitores(component, event, helper);
            component.set("v.modalCadastroLeitor", false);
        }


    },
    // dando baixa do livro para devolução.
    baixaLivro: function(component, event, helper) {
        helper.criarDevolucao(component, event, helper, event.target.dataset.id);
    },

    limparFiltro: function(component, event, helper) {
        component.set("v.filtroTitulo", "");
        component.set("v.filtroLeitor", "");
        component.set("v.filtroStatus", "");

        helper.registrosPedidos(component, event, helper);
    },

    filtrar: function(component, event, helper) {
        helper.registrosPedidos(component, event, helper);
    }

    
})