public class RegistroEmprestimoLivroController {


    @AuraEnabled
    public static List<Leitor__c> buscaLeitor(String value) { // recebendo o value do input busca nome-rg leitor
        if (String.isBlank(value)) return new List<Leitor__c>();
        String likeOperator =  value + '%';
        // select que retorna uma lista do objeto leitor - e que é setado na variável list do js.
        return [SELECT Id, NomeCompleto__c, RG__c, Idade__c FROM Leitor__c WHERE NomeCompleto__c LIKE :likeOperator OR RG__c LIKE :value];
    }


    @AuraEnabled 
    public static List<Livro__c> buscaLivro(String value) { // recebe value do input busca nome livro.

        // retorna uma lista se o value enviado pelo usuário for vazio ou nullo.
        if (String.isBlank(value)) return new List<Livro__c>();
        
        String likeOperator =  value + '%';
        // select que retorna uma lista do objeto livro - e que é setado na variável do js.
        return [SELECT Id, Titulo__c, Autor__c, Codigo__c, QuantidadeDisponivel__c, Disponivel__c FROM Livro__c WHERE Titulo__c LIKE :likeOperator OR Codigo__c LIKE :value];
    }

    
   
    @AuraEnabled 
    public static SaveResult criarEmprestimo(Id livroId, Id leitorId ) {
        // preciso do livro pq ele é o mestre do registro-de-pedido
        // e preciso do leitor, pq ele é o mestre do registro-de-pedido

        RegistroPedido__c emprestimo = new RegistroPedido__c();
        emprestimo.DataEmprestimo__c = System.now();
        emprestimo.Livro__c = livroId;
        emprestimo.Leitor__c = leitorId;

        SaveResult result = new SaveResult(Database.insert(emprestimo, false));


        return result;
    }


    
    
    
    
    
    @AuraEnabled
    // listando pendencias do leitor.
    public static List<RegistroPedido__c> listarPendenciasLeitor(Id leitorId){

        return [SELECT Id, Livro__c, Leitor__c, Livro__r.Autor__c, DataEmprestimo__c, DuracaoEmprestimo__c, DataDevolucao__c, Livro__r.Titulo__c, Livro__r.Codigo__c FROM RegistroPedido__c WHERE Leitor__c =: leitorId  ORDER BY DataDevolucao__c];
        

    }
    






    @AuraEnabled
    public static SaveResult criarDevolucao(Id pendenciaId){



        RegistroPedido__c devolucao = new RegistroPedido__c();
        devolucao.DataDevolucao__c = System.now();
        devolucao.Id = pendenciaId;
        SaveResult result = new SaveResult(Database.update(devolucao, false));

        return result;
    }


   
    
    



   
        

    /*
    List<List<sObject>> queryLei    res = [FIND :leitor IN ALL FIELDS RETURNING Leitor__c(NomeCompleto__c)];
        
        List<Leitor__c> searchLeitor = (List<Leitor__c>)queryLeitores[0];

        List<String> leitores = new List<String>();
        
        for (Leitor__c objLeitor : searchLeitor) {
            
            leitores.add(objLeitor.NomeCompleto__c);

        }   
    
    */
}