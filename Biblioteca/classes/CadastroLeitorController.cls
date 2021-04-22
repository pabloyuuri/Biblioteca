public with sharing class CadastroLeitorController {
  
  @AuraEnabled
  public static SaveResult cadastroLeitor(Leitor__c leitor) {
    
    Database.SaveResult saveLeitor = Database.insert(leitor, false);

    SaveResult result = new SaveResult(saveLeitor);

    return result;
  }

}