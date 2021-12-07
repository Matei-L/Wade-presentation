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
    }
  ]