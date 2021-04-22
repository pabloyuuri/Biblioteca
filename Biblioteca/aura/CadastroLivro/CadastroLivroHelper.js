({
    cadastrarLivro : function(component, event, helper) {
        // objeto enviado
        let livro = component.get("v.livro");
        // método da classe do apex.        
        let action = component.get("c.cadastroLivro");

        // spinner irá ativar
        let loading = component.get("v.loading");
        component.set("v.loading", true);
        
        action.setParams({
            "livro": livro // setando objeto enviado
        });
        action.setCallback(this, (response) => {
            let responseState = response.getState();
            let responseValue = response.getReturnValue();
            
            if (responseState === 'SUCCESS') {
                console.log(responseValue);
                // se for true, irá enviar uma mensagem de SUCESS
                if (responseValue.isSuccess == true) {
                    
                    helper.showToast({"message":"Livro criado com sucesso!", "type": "success"});
                    
                    
                    // quando o livro for criado o evento personalizado irá disparar.
                    helper.fireFinishEventLivro(component);
                }
                
                else {
                    let messageError = '';
                    
                    
                    responseValue.errors.forEach((error) => {
                        messageError += error;
                        console.log(messageError);
                    });
                    helper.showToast({"message": messageError, "type": "error"});
                }
                
                
                // spinner - quando o servidor enviar a resposta, o spinner irá desaparecer.
                component.set("v.loading", false);
                console.log(loading);

            }
            
        });
        
        $A.enqueueAction(action);
    },



    showToast : function(params) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(params);
        toastEvent.fire();
    },




    fireFinishEventLivro: function(component) {
        
        var cmpEvent = component.getEvent("finish");
        cmpEvent.setParams({
            "tipo": "livro"
        });
        cmpEvent.fire();
    }
})