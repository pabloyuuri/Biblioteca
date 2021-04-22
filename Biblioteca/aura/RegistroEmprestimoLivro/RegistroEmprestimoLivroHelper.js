({  // buscar o nome-ou-rg do leitor 
    buscaLeitor: function(component, event, helper) {

        component.set("v.loading", true);
        component.set("v.messageLeitor", null);
        // pegando método da controller - MÉTODO DA CLASSE DO APEX
        let action = component.get("c.buscaLeitor");

        // setando parâmetros do método da controller
        // leitorSearch é a variável que está no value do input.
        action.setParams({
            "value": component.get("v.leitorSearch")
        });

        action.setCallback(this, function(response) {

            let responseValue = response.getReturnValue();
            let state = response.getState();
            
            // se for sucesso,
            if(state === 'SUCCESS') {
                
                // seta o valor do retorno do método da classe do apex
                // na variável array-list que é a leitoresResult
                if (responseValue.length === 0 ) {
                    component.set("v.messageLeitor", "Nenhum leitor encontrado para a pesquisa " + '"' + component.get("v.leitorSearch") + '"');
                }
                component.set("v.leitoresResult", responseValue);

                component.set("v.loading", false);
            }

            else if (state === "ERROR") {
                console.log(response.getError());
            }
        });


        $A.enqueueAction(action);

    },

    // irá buscar o livro disponível.
    buscaLivro: function(component, event, helper) {
        // SPINNER VAI ATIVAR AO PESQUISAR O LIVRO.
        component.set("v.loading", true);

        component.set("v.messageLivro", null);
        // método da classe do  apex.
        let action = component.get("c.buscaLivro");
        // setando parâmetro do método da classe do apex,
        // o valor setado é do input que 
        // que está com a variável livroSearch
        action.setParams({
            "value": component.get("v.livroSearch")
        });

        action.setCallback(this, function(response) {

            let responseValue = response.getReturnValue();
            let state = response.getState();

            if(state === 'SUCCESS') {
                    

                if (responseValue.length === 0 ) {
                    component.set("v.messageLivro", "Nenhum livro encontrado para a pesquisa " + '"' + component.get("v.livroSearch") + '"');
                }
                // setando na array-list o retorno do método da classe do apex.
                component.set("v.livrosResult", responseValue);

                // spinner irá desativar ao terminar a setagem da consulta
                component.set("v.loading", false);
            }

            else if (state === "ERROR") {
                console.log(response.getError());
            }
        });

        $A.enqueueAction(action);
    },
    
    
    // a função criar empréstimo irá chamar 
    // um método da classe do apex.

    criarEmprestimo: function(component, event, helper) {

        component.set("v.loading", true);

        let action = component.get("c.criarEmprestimo");
        // pegando o id do livro e o id do leitor e 
        // argumentando no método da classe do apex.
        action.setParams({
            "livroId": component.get("v.livroId"),
            "leitorId": component.get("v.leitorId")
        });

        action.setCallback(this, (response) => {
            let responseValue = response.getReturnValue();
            let getState = response.getState();
            
            if ( getState === "SUCCESS") {
                if (responseValue.isSuccess) {
                    helper.showToast({
                        "message": "Empréstimo do livro realizado com sucesso",
                        "type": "success"
                    });
                    helper.fireFinishEventEmprestimo(component);
                }
              
                else {
                    let x = '';
                    responseValue.errors.forEach(function(error) {
                        x += error;
                    });
                    helper.showToast({
                        "message": x,
                        "type": "error"
                    });
                    component.set("v.loading", false);
                }
            }   
            else if(getState === "ERROR") {
                
            }
        })
        $A.enqueueAction(action);
    },


    // listando dependencias do leitor
    listarPendencias: function(component, event, helper) {

        component.set("v.messagePendencias", null);

        // chamando o método da classe do apex
        let action = component.get("c.listarPendenciasLeitor");
        // argumentando no método da classe do apex,
        // o id do leitor.
        action.setParams({
            "leitorId" : component.get("v.leitorId")
        });
        console.log(action.getParams());
        action.setCallback(this, function(response) {

            let responseValue = response.getReturnValue();
            let state = response.getState();

            if(state === 'SUCCESS') {
                
                if (responseValue.length === 0) {
                    component.set("v.messagePendencias", "Nenhum registro de empréstimo encontrado");
                }
                // a variável pendencias será setada
                // com o valor do método da classe do apex.
                component.set("v.pendencias", responseValue);
            }
        });


        $A.enqueueAction(action);

    },
    

    // chamando método da classe do apex.
    criarDevolucao: function(component, event, pendenciaId) {

        component.set("v.loading", true);

        let helper = this;
        // método da classe do apex
        let action = component.get("c.criarDevolucao");
        // o método recebe como argumento a pendenciaId.
        action.setParams({
            "pendenciaId" : pendenciaId
        });

        action.setCallback(this, function(response) {

            let responseValue = response.getReturnValue();
            let state = response.getState();

            if(state === 'SUCCESS') {

                if (responseValue.isSuccess) {
                    helper.showToast({
                        "message": "Devolução feita com sucesso",
                        "type": "success"
                    });

                    
                    helper.fireFinishEventDevolucao(component, event);

                    let pendencias = component.get("v.pendencias");

                    pendencias.forEach(function(item) {
                        if (item.Id === pendenciaId) {
                            item.DataDevolucao__c = (new Date()).getTime();
                        }
                    });

                    component.set("v.pendencias", pendencias);

                    component.set("v.loading", false);
                }
              
                else {
                    let x = '';
                    responseValue.errors.forEach(function(error) {
                        x += error;
                    });
                    helper.showToast({
                        "message": x,
                        "type": "error"
                    });
                }

                

            }
            else if(state === "ERROR") {
                console.log(responseValue);
            }
        });


        $A.enqueueAction(action);

    },

    

    showToast : function(params) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(params);
        toastEvent.fire();
    },

    
    
        fireFinishEventEmprestimo: function(component) {
            var cmpEvent = component.getEvent("finish");
            cmpEvent.setParams({
                "tipo": "emprestimo"
            });
            console.log(cmpEvent);
            cmpEvent.fire();
        },

        fireFinishEventDevolucao: function(component) {
            
            var cmpEvent = component.getEvent("finish");
            cmpEvent.setParams({
                "tipo": "devolucao"
            });
            cmpEvent.fire();
        },


        /*
        fireFinishEventDevolucaoSair: function(component) {
            
            var cmpEvent = component.getEvent("finish");
            cmpEvent.setParams({
                "tipo": "devolucao-sair"
            });
            cmpEvent.fire();
        }
        */
})