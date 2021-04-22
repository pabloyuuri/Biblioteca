public with sharing class CadastroLivroController {
    @AuraEnabled
    public static SaveResult cadastroLivro(Livro__c livro) {
        
        Database.SaveResult saveLivro = Database.insert(livro, false);
        
        
        SaveResult result = new SaveResult(saveLivro);
        return result;
    }
}