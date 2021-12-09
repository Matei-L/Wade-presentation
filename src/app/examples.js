export const EXAMPLES = [
    {
      name: 'Select * From Quadstore',
      value: `SELECT * WHERE { GRAPH ?g { ?s ?p ?o} }`
    },
    {
      name: 'Delete * From Quadstore',
      value: `DELETE { GRAPH ?g { ?s ?p ?o} } WHERE { GRAPH ?g { ?s ?p ?o} }`
    },
    {
      name: 'Insert into Quadstore',
      value: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX schema: <http://schema.org/>
INSERT DATA
{ 
  GRAPH <http://example/shelf_A> {
    <http://example/book1> a schema:Book ;
                           schema:name "A new book" ;
                           schema:author "A.N.Other" .
    <http://example/book2> a schema:Book ;
                           schema:name "A book" ;
                           schema:author "T.H.Same" .
  }
  GRAPH <http://example/shelf_B> {
    <http://example/book3> a schema:Book ;
                           schema:name "A really old book" ;
                           schema:author "S.O.M.Other" .
  }
}`
    },
    {
      name: 'Update in Quadstore',
      value: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX schema: <http://schema.org/>
DELETE
{
  GRAPH  <http://example/shelf_A> { <http://example/book1> <http://schema.org/author> "A.N.Other" }
}
INSERT 
{ 
  GRAPH  <http://example/shelf_A> { <http://example/book1> <http://schema.org/author> "A.N.Other2" }
}
WHERE
{
  GRAPH  <http://example/shelf_A> { <http://example/book1> <http://schema.org/author> "A.N.Other" }
}`
    },
    {
      name: 'Select United States regions from WikiData',
      value: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX wd: <http://www.wikidata.org/entity/>
      PREFIX wdt: <http://www.wikidata.org/prop/direct/>
      
      SELECT DISTINCT  ?region ?isPartOf ?country
      where
      {
      
        ?region wdt:P17 wd:Q30.
        ?region wdt:P31 wd:Q82794
      
        bind("is-in-country" as ?isPartOf) 
        bind("United States" as ?country) 
      
      }
LIMIT 10`
    },
	{
      name: 'Select Belgium regions from WikiData',
      value: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX wd: <http://www.wikidata.org/entity/>
      PREFIX wdt: <http://www.wikidata.org/prop/direct/>
      
      SELECT DISTINCT  ?region ?isPartOf ?country
      where
      {
      
        ?region wdt:P17 wd:Q31.
        ?region wdt:P31 wd:Q82794
      
        bind("is-in-country" as ?isPartOf) 
        bind("Belgium" as ?country) 
      
      }
LIMIT 10`
    },
    {
      name: 'Select United States regions from DBPedia',
      value: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dbr: <http://dbpedia.org/resource/>
      
      select * 
      where
      {
        ?region rdf:type dbo:Region.
        ?region dbo:country dbr:United_States 
        bind("is-in-country" as ?isPartOf) 
        bind("United States" as ?country) 
      }

LIMIT 10`
    },
	{
      name: 'Select Belgium regions from DBPedia',
      value: `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dbr: <http://dbpedia.org/resource/>
      
      select * 
      where
      {
        ?region rdf:type dbo:Region.
        ?region dbo:country dbr:Belgium 
        bind("is-in-country" as ?isPartOf) 
        bind("Belgium" as ?country) 
      }

LIMIT 10`
    },
    {
      name:"Select United States regions from Quadstore",
      value:'SELECT * WHERE { GRAPH  ?graph { ?region ?isPartOf "United States". bind( "United States" as ?country) }}'
    },
    {
      name:"Select Belgium regions from Quadstore",
      value: 'SELECT * WHERE { GRAPH  ?graph  { ?region ?isPartOf "Belgium". bind( "Belgium" as ?country) }  }'
    }
  ]