/*
creates political schema
*/
export const POLITICAL_DATA_SCHEMA_QUERY = 'WOQL.when(true).and('  + '\n' +
        'WOQL.doctype("Party")'  + '\n' +
            '.label("Party")'  + '\n' +
            '.description("Political Party"),'  + '\n' +
        'WOQL.doctype("Representative")'  + '\n' +
            '.label("Representative")'  + '\n' +
            '.description("An elected member of the US congress")'  + '\n' +
            '.property("member_of", "Party")'  + '\n' +
                '.label("Member of").cardinality(1),'  + '\n' +
        'WOQL.doctype("Similarity")'  + '\n' +
            '.label("Similarity")'  + '\n' +
            '.property("similarity", "decimal")'  + '\n' +
                '.label("Similarity")'  + '\n' +
            '.property("similar_to", "Representative")'  + '\n' +
                '.label("Similar To").cardinality(2),'  + '\n' +
        'WOQL.add_class("ArmedForcesSimilarity")'  + '\n' +
            '.label("Armed Forces")'  + '\n' +
            '.parent("Similarity"),'  + '\n' +
        'WOQL.add_class("CivilRightsSimilarity")'  + '\n' +
            '.label("Civil Rights")'  + '\n' +
            '.parent("Similarity"),'  + '\n' +
        'WOQL.add_class("HealthSimilarity")'  + '\n' +
            '.label("Health")'  + '\n' +
            '.parent("Similarity"),'  + '\n' +
        'WOQL.add_class("ImmigrationSimilarity")'  + '\n' +
            '.label("Immigration")'  + '\n' +
            '.parent("Similarity"),'  + '\n' +
        'WOQL.add_class("InternationalAffairsSimilarity")'  + '\n' +
            '.label("International Affairs")' + '\n' +
            '.parent("Similarity"),' + '\n' +
        'WOQL.add_class("TaxationSimilarity")' + '\n' +
            '.label("Taxation")' + '\n' +
            '.parent("Similarity"),' + '\n' +
        'WOQL.add_class("OverallSimilarity")' + '\n' +
            '.label("Overall")' + '\n' +
            '.parent("Similarity"))'


const csvs = {
    ArmedForcesSimilarity: "https://terminusdb.com/t/data/congress/armed_forces_weighted_similarity.csv",
    CivilRightsSimilarity: "https://terminusdb.com/t/data/congress/civil_rights_weighted_similarity.csv",
    HealthSimilarity: "https://terminusdb.com/t/data/congress/health_weighted_similarity.csv",
    ImmigrationSimilarity: "https://terminusdb.com/t/data/congress/immigration_weighted_similarity.csv",
    InternationalAffairsSimilarity: "https://terminusdb.com/t/data/congress/international_affairs_weighted_similarity.csv",
    TaxationSimilarity: "https://terminusdb.com/t/data/congress/taxation_weighted_similarity.csv",
    OverallSimilarity: "https://terminusdb.com/t/data/congress/weighted_similarity.csv"
};

export const POLITICAL_DATA_CSV = 'WOQL.get(' + '\n' +
			'WOQL.as("politician_a","v:Rep_A")' + '\n' +
			'.as("politician_b", "v:Rep_B")' + '\n' +
			'.as("party_a", "v:Party_A")' + '\n' +
			'.as("party_b", "v:Party_B")' + '\n' +
			').remote("https://terminusdb.com/t/data/congress/armed_forces_weighted_similarity.csv");' + '\n'

export const POLITICAL_DATA_WRANGLES = '[WOQL.idgen("doc:Party", ["v:Party_A"], "v:Party_A_ID"),' + '\n' +
	'WOQL.idgen("doc:Party", ["v:Party_B"], "v:Party_B_ID"),' + '\n' +
	'WOQL.idgen("doc:Representative", ["v:Rep_A"], "v:Rep_A_ID"),' + '\n' +
	'WOQL.idgen("doc:Representative", ["v:Rep_B"], "v:Rep_B_ID"),' + '\n' +
	'WOQL.typecast("v:Distance", "xsd:decimal", "v:Similarity"),' + '\n' +
	'WOQL.idgen("doc:ArmedForcesSimilarity", ["v:Rep_A", "v:Rep_B"], "v:Rel_ID"),' + '\n' +
	'WOQL.concat("v:Distance ArmedForcesSimilarity", "v:Rel_Label"),' + '\n' +
	'WOQL.concat("v:Distance ArmedForcesSimilarity between v:Rep_A and v:Rep_B", "v:Rel_Description")]'

export const POLITICAL_DATA_INSERTS = 'WOQL.and(' + '\n' +
        'WOQL.insert("v:Party_A_ID", "Party")' + '\n' +
            '.label("v:Party_A"),' + '\n' +
        'WOQL.insert("v:Party_B_ID", "Party")' + '\n' +
            '.label("v:Party_B"),' + '\n' +
        'WOQL.insert("v:Rep_A_ID", "Representative")' + '\n' +
            '.label("v:Rep_A")' + '\n' +
            '.property("member_of", "v:Party_A_ID"),' + '\n' +
        'WOQL.insert("v:Rep_B_ID", "Representative")' + '\n' +
            '.label("v:Rep_B")' + '\n' +
            '.property("member_of", "v:Party_B_ID"),' + '\n' +
        'WOQL.insert("v:Rel_ID", ArmedForcesSimilarity)' + '\n' +
            '.label("v:Rel_Label")' + '\n' +
            '.description("v:Rel_Description")' + '\n' +
            '.property("similar_to", "v:Rep_A_ID")' + '\n' +
            '.property("similar_to", "v:Rep_B_ID")' + '\n' +
            '.property("similarity", "v:Similarity"));'

/*export const POLITICAL_DATA_CSV = () => {
	for (var key in csvs){
		return 'WOQL.get(' + '\n' +
			        'WOQL.as("politician_a","v:Rep_A")' + '\n' +
			        '.as("politician_b", "v:Rep_B")' + '\n' +
			        '.as("party_a", "v:Party_A")' + '\n' +
			        '.as("party_b", "v:Party_B")' + '\n' +
			    	').remote(' + csvs[key] + ');' + '\n'
	}
}

export const POLITICAL_DATA_WRANGLES = () => {
	for (var key in csvs){
		return (
			'[WOQL.idgen("doc:Party", ["v:Party_A"], "v:Party_A_ID"),' + '\n' +
		        'WOQL.idgen("doc:Party", ["v:Party_B"], "v:Party_B_ID"),' + '\n' +
				'WOQL.idgen("doc:Representative", ["v:Rep_A"], "v:Rep_A_ID"),' + '\n' +
				'WOQL.idgen("doc:Representative", ["v:Rep_B"], "v:Rep_B_ID"),' + '\n' +
				'WOQL.typecast("v:Distance", "xsd:decimal", "v:Similarity"),' + '\n' +
				'WOQL.idgen("doc:"' + key  + ', ["v:Rep_A", "v:Rep_B"], "v:Rel_ID"),' + '\n' +
				'WOQL.concat("v:Distance "' + key + ', "v:Rel_Label"),' + '\n' +
				'WOQL.concat("v:Distance "' + key + '" between v:Rep_A and v:Rep_B", "v:Rel_Description")]'
		)
	}
}*/
