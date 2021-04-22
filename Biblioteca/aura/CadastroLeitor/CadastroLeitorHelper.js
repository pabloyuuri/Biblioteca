({
    createNovoLeitor : function(component, event, helper) {
        // objeto enviado
        const leitor = component.get("v.leitor");
        
        // spinner que irá ativar quando chamar o método da classe do apex
        component.set("v.loading", true);
        

        // pegando o método da classe do apex
        let action = component.get("c.cadastroLeitor");

        // setando-argumentando o objeto enviado pelo usuário no método da classe do apex
        action.setParams({
            "leitor":leitor
        });


        action.setCallback(this, (response) => {
            let responseState = response.getState();
            let responseValue = response.getReturnValue();

            if (responseState === 'SUCCESS') {
                console.log(responseValue);
                
                // se for sucesso irá enviar a mensagem de sucess da function toast.
                if (responseValue.isSuccess == true) {
                    helper.showToast({"message":"Leitor criado com sucesso!", "type": "success"});

                    // se for sucesso irá disparar o evento personalizado
                    helper.fireFinishEventLeitor(component);
                }
                
                
                // SENÃO, irá disparar o erro(s)
                else {
                    let messageError = '';
                    responseValue.errors.forEach((error) => {
                        messageError += error;
                    });
                    helper.showToast({"message":messageError, "type": "error"});
                }
                
                
                // spinner irá desativar quando terminar o processo da resposta do servidor.
                component.set("v.loading", false);

            }
            
        });

        $A.enqueueAction(action);

    },

    
    showToast : function(params) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(params);
        toastEvent.fire();
    },

    fireFinishEventLeitor: function(component) {
        
        var cmpEvent = component.getEvent("finish");
        cmpEvent.setParams({
            "tipo": "leitor"
        });
        cmpEvent.fire();
    }
})