/*
creates political schema
*/
export const POLITICAL_DATA_SCHEMA_QUERY =' WOQL.when(true).and(' + '\n' +
    'WOQL.doctype("Party")' + '\n' +
        '.label("Party")' + '\n' +
        '.description("Political Party"),' + '\n' +
    'WOQL.doctype("Representative")' + '\n' +
        '.label("Representative")' + '\n' +
        '.description("An elected member of the Dublin Council")' + '\n' +
        '.property("member_of", "Party")' + '\n' +
        '.label("Member of").cardinality(1),' + '\n' +
    'WOQL.doctype("Similarity")' + '\n' +
        '.label("Similarity")' + '\n' +
        '.property("similarity", "decimal")' + '\n' +
        '.label("Similarity")' + '\n' +
        '.property("similar_to", "Representative")' + '\n' +
        '.label("Similar To").cardinality(2))'


export const POLITICAL_DATA_CSV = 'WOQL.get(' + '\n' +
        'WOQL.as("councillor_a","v:Rep_A")' + '\n' +
        '.as("councillor_b", "v:Rep_B")' + '\n' +
        '.as("party_a", "v:Party_A")' + '\n' +
        '.as("party_b", "v:Party_B")' + '\n' +
        '.as("distance", "v:Distance")' + '\n' +
    ').remote("https://terminusdb.com/t/data/council/weighted_similarity.csv")'

export const POLITICAL_DATA_WRANGLES = '[WOQL.idgen("doc:Party", ["v:Party_A"], "v:Party_A_ID"),'  + '\n' +
    'WOQL.idgen("doc:Party", ["v:Party_B"], "v:Party_B_ID"),'  + '\n' +
    'WOQL.idgen("doc:Representative", ["v:Rep_A"], "v:Rep_A_ID"),'  + '\n' +
    'WOQL.idgen("doc:Representative", ["v:Rep_B"], "v:Rep_B_ID"),'  + '\n' +
    'WOQL.typecast("v:Distance", "xsd:decimal", "v:Similarity"),'  + '\n' +
    'WOQL.idgen("doc:Similarity", ["v:Rep_A", "v:Rep_B"], "v:Rel_ID"),'  + '\n' +
    'WOQL.concat("v:Distance Overall Similarity","v:Rel_Label"),' + '\n' +
    'WOQL.concat("v:Distance Overall Similarity between v:Rep_A and v:Rep_B", "v:Rel_Description")]'

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
    'WOQL.insert("v:Rel_ID", "Similarity")' + '\n' +
        '.label("v:Rel_Label")' + '\n' +
        '.description("v:Rel_Description")' + '\n' +
        '.property("similar_to", "v:Rep_A_ID")' + '\n' +
        '.property("similar_to", "v:Rep_B_ID")' + '\n' +
        '.property("similarity", "v:Similarity"))'


export const POLITICAL_SHOW_DOCUMENTS = 'WOQL.limit(300).and(' + '\n' +
        'WOQL.triple("v:Subject","similar_to","v:Value"),' + '\n' +
        'WOQL.triple("v:Subject","similar_to","v:Value2"),' + '\n' +
        'WOQL.triple("v:Subject","similarity","v:Similarity"),' + '\n' +
        'WOQL.triple("v:Value","member_of","v:Party"),' + '\n' +
        'WOQL.triple("v:Value2","member_of","v:Party2"),' + '\n' +
        'WOQL.not().eq("v:Value","v:Value2"),' + '\n' +
        'WOQL.opt().triple("v:Value2","label","v:Lab2"),' + '\n' +
        'WOQL.opt().triple("v:Value","label","v:Lab1"))'  // eval dosent work
