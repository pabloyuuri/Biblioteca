trigger LeitorTrigger on Leitor__c (before insert, after insert, after delete) {

  if (Trigger.isInsert) {
    if (Trigger.isBefore) {
      // lista dos novos registros
      List<Leitor__c> leitores = (List<Leitor__c>) trigger.new;


      Set<String> rgs = new Set<String>();


      for (Leitor__c leitor : leitores) {
        if (leitor.RG__c != null) {
          rgs.add(leitor.RG__c);
        }
      }

     
      Map<String, Id> obterLeitor = new Map<String, Id>();
     for (Leitor__c leitor : [SELECT Id, RG__c FROM Leitor__c WHERE RG__c IN: rgs]) {
       // vazio
      obterLeitor.put(leitor.RG__c, leitor.Id);
     } 


     // validando insert leitor

     for (Leitor__c leitor : leitores) {
       // se rg
       if (leitor.RG__c == null) {
         leitor.addError('RG é obrigatório no cadastro de leitor');
       }

       if (obterLeitor.containsKey(leitor.RG__c)) {
         leitor.addError(String.format(System.Label.RG_duplicado, new List<String>{leitor.RG__c}));
       }
     }

    }
  }

}