({

    // CONSULTA QUE RETORNA UMA LISTA DE LIVROS DA BIBLIOTECA
    livros : function(component, event, helper) {

        component.set("v.loading", true);

        let action = component.get("c.livros");
        
        action.setCallback(this, (response) => {
            let state = response.getState();
            let responseValue = response.getReturnValue();
            
            if(state === 'SUCCESS') {   
                component.set("v.livros", responseValue );

                component.set("v.loading", false);
            }
        })

        $A.enqueueAction(action);
        
    },
    // CONSULTA QUE RETORNA UMA LISTA  DE LEITORES DA BIBLIOTECA
    leitores: function(component, event, helper) {

        component.set("v.loading", true);
        let action = component.get("c.leitores");

        action.setCallback(this, (response) => {
            let responseValue = response.getReturnValue();
            let state = response.getState();

            if(state === "SUCCESS") {
                
                component.set("v.leitores", responseValue);
                component.set("v.loading", false);
            }
        })

        $A.enqueueAction(action);
    },



    // FAZER CONSULTA SOQL 
    registrosPedidos : function(component, event, helper) {

        component.set("v.loading", true);

        let action = component.get("c.registrosPedidos");

        action.setParams({
            "nomeLivro": component.get("v.filtroTitulo"),
            "nomeLeitor": component.get("v.filtroLeitor"),
            "status": component.get("v.filtroStatus")
        })
        
        action.setCallback(this, (response) => {
            let responseValue = response.getReturnValue();
            let state = response.getState();
        
            if (state === "SUCCESS") {
                console.log(responseValue);
                component.set("v.registroPedidos", responseValue);
                component.set("v.loading", false);
            }
            else if (state === "ERROR") {
                console.log(response);
            }
        })

        $A.enqueueAction(action);
    },




    // CRIANDO DEVOLUÇÃO - AO PRESSIONAR O LINK "DAR BAIXA"
    criarDevolucao : function(component, event, helper, emprestimoId) {
        // pegando método da classe do apex.
        let action = component.get("c.criarDevolucao");

        // setando o id do emprestimo.
        action.setParams({
            "emprestimoId": emprestimoId
        });
        
        action.setCallback(this, (response) => {
            let responseValue = response.getReturnValue();
            let state = response.getState();
        
            if (state === "SUCCESS") {
                console.log(responseValue);
                if (responseValue.isSuccess) {
                    helper.showToast({
                        "message": "Devolução feita com sucesso",
                        "type": "success"
                    });
                    let registros = component.get("v.registroPedidos");

                    registros.forEach(function(item) {
                        if (item.Id === emprestimoId) {
                            item.DataDevolucao__c = (new Date()).getTime();
                        }
                    });

                    // setando na array registro e pedidos, para atualizar os reg.pedidos o
                    // return do método da classe do apex.
                    component.set("v.registroPedidos", registros);
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
            else if (state === "ERROR") {
                console.log(response);
            }
        })

        $A.enqueueAction(action);
    },


    showToast : function(params) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(params);
        toastEvent.fire();
    }


    
})