export const BANK_BALANACE_SCHEMA = 'WOQL.doctype("BankAccount").label("Bank Account")' + '\n' +
    '.property("owner","xsd:string")' + '\n' +
       '.label("balance")' + '\n' +
       '.cardinality(1)' + '\n' +
    '.property("balance","xsd:nonNegativeInteger")' + '\n' +
       '.label("owner")' + '\n' +
       '.cardinality(1)'

export const BANK_BALANANCE_DOCUMENTS = 'WOQL.and(' + '\n' +
	'WOQL.add_triple("doc:mike", "type", "scm:BankAccount"),' + '\n' +
	'WOQL.add_triple("doc:mike", "owner", "mike"),' + '\n' +
	'WOQL.add_triple("doc:mike", "balance", 123))'

export const QUERY_TO_EDIT_WRONG = 'let vars = function(sl) {return sl.map( s => "v:" + s)}'  + '\n' +
	'let [balance,new_balance] = vars(["Balance", "New Balance"])'  + '\n' +
	'WOQL.and('  + '\n' +
		'WOQL.triple("doc:mike", "scm:balance", balance),'  + '\n' +
		'WOQL.delete_triple("doc:mike", "scm:balance", balance),'  + '\n' +
		'WOQL.eval(WOQL.minus(balance, 130), new_balance),'  + '\n' +
		'WOQL.add_triple("doc:mike", "scm:balance", new_balance))'


export const QUERY_TO_EDIT_CORRECT = 'let vars = function(sl) {return sl.map( s => "v:" + s)}' + '\n' +
	'let [balance,new_balance] = vars(["Balance", "New Balance"])' + '\n' +
	'WOQL.and(' + '\n' +
	  'WOQL.triple("doc:mike", "scm:balance", balance),' + '\n' +
	  'WOQL.delete_triple("doc:mike", "scm:balance", balance),' + '\n' +
	  'WOQL.eval(WOQL.minus(balance, 13), new_balance),' + '\n' +
	  'WOQL.add_triple("doc:mike", "scm:balance", new_balance))'
