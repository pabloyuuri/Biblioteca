public with sharing class BibliotecaController {
    
    @AuraEnabled
    public static List<Livro__c> livros() {

        return [SELECT Titulo__c, Autor__c, Quantidade__c, QuantidadeDisponivel__c, TotalEmprestimos__c FROM Livro__c Order BY Titulo__c ASC];
    }

    @AuraEnabled
    public static List<Leitor__c> leitores() {

        return [SELECT NomeCompleto__c, Idade__c, RG__c FROM Leitor__c ORDER BY NomeCompleto__c ASC];
    }

    @AuraEnabled
    public static List<RegistroPedido__c> registrosPedidos(String nomeLivro, String nomeLeitor, String status) {
        
        String query = 'SELECT Livro__r.Titulo__c, Livro__r.Autor__c, Leitor__r.NomeCompleto__c, DataEmprestimo__c, DataDevolucao__c, DuracaoEmprestimo__c FROM RegistroPedido__c WHERE Id != null';
        // se o nomeLivro não for nulo e nem vazio, consulte  o titulo do livro 
        if (!String.isBlank(nomeLivro)) {
            nomeLivro += '%'; // encontrar todos os valores que começam com o nomeLivro
            query += ' AND Livro__r.Titulo__c LIKE :nomeLivro';
        }
        // se o nomeLeitor for nulo e nem vazio, consulte o Nome completo do Leitor
        if (!String.isBlank(nomeLeitor)) {
            nomeLeitor += '%'; // encontrar todos os valores que começam com o nomeLeitor
            query += ' AND Leitor__r.NomeCompleto__c LIKE :nomeLeitor';
        }
        // se o status não for nulo e nem vazio
        if (!String.isBlank(status)) {
            if (status == '1') { // se o status for igual a empréstimo-emprestado,
                // consulte os registros que tem a data de devolução igual a null.
                query += ' AND DataDevolucao__c = NULL';
            }
            else if (status == '2') { // senão se, status for igual a devolução-devolvidos
                // consulte os registros que os campos que tem a dataDevolução preenchida.
                query += ' AND DataDevolucao__c != NULL';
            }
        }
        // ordene por createDate de maneira decrescente
        query += ' ORDER BY CREATEDDATE DESC';


        // método query da classe Database -  SOQL dinâmico 
        // consulta.
        return Database.query(query);


    }
    // criando devolução, reaproveitando método da classe RegistroEmprestimolivroController que é criarDevolução.
    @AuraEnabled
    public static SaveResult criarDevolucao(Id emprestimoId){
        return RegistroEmprestimoLivroController.criarDevolucao(emprestimoId);
    }
}