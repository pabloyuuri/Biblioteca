@isTest
private class CadastroLeitorControllerTest {
    
    
    
    @isTest static void CadastroLeitorControllerTest() {
        
        
        Leitor__c objTest = new Leitor__c(
            Nome__c = 'Pablo',
            Sobrenome__c = 'Yuri',
            Idade__c = 2,
             RG__c = '0000000000'
        );
        
        SaveResult testeLeitor = CadastroLeitorController.cadastroLeitor(objTest);

    }
}