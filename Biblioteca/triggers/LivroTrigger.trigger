trigger LivroTrigger on Livro__c (before insert, after insert, after delete) {
  if(Trigger.isInsert) {
    if (Trigger.isBefore) {


      // 
      List<Livro__c> livros = (List<Livro__c>) trigger.new;
      // Conjunto
      Set<String> codigosLivros = new Set<String>();

      for (Livro__c livro : livros) {
        if (livro.Codigo__c != null) {
          // add a lista do novo registro no conjunto.
          codigosLivros.add(livro.Codigo__c);
        }
      }

      Map<String, Id> obterLivroMap = new Map<String, Id>();

      for (Livro__c livro : [SELECT Id, Codigo__c FROM Livro__c WHERE  Codigo__c IN: codigosLivros]) {
        // vazio
        obterLivroMap.put(livro.Codigo__c, livro.Id);
      }

    
      // o loop for irá receber o trigger new convertido em list do objeto livro__c
      for (Livro__c livro : livros ) {
        // se o código livro que foi recebido for null, irá ocorrer o método addError - "..."
        if (livro.Codigo__c == null) {
          livro.addError('Código é obrigatório no cadastro do livro');
        }
        // se na key do Map tiver o valor enviado pelo o usuário,
        if (obterLivroMap.containsKey(livro.Codigo__c)) {
          // então irá disparar meu addError.
          livro.addError(String.format(System.label.Codigo_Duplicado, new List<String>{livro.Codigo__c}));

        }
      }
    }

  }
}