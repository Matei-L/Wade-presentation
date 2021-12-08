import { Component, AfterViewInit } from '@angular/core';
import * as dataFactory from '@rdfjs/data-model';
import { newEngine } from 'quadstore-comunica';
import { Quad, Quadstore } from 'quadstore';
import {EXAMPLES} from './examples.js';
import { OnInit } from '@angular/core';
import Yasgui from '@triply/yasgui';
import leveljs from 'level-js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  quads: Array<Quad> = [];
  quadstore: Quadstore;
  alert: string = '';
  yasgui: Yasgui;

  ngOnInit(): void {
    this.upsertQuadStore();
    this.upsertYasgui();
  }

  ngAfterViewInit(): void {
    this.upsertQuadStore();
    this.upsertYasgui();
  }

  /*
  ########################################
  #Yasgui 
  ########################################
  */
  upsertYasgui(): void {
    if(!!document.getElementById("yasgui")) {
      this.yasgui = new Yasgui(document.getElementById("yasgui"), {
        copyEndpointOnNewTab: false,
      });
      if (Object.keys(this.yasgui._tabs).length <= 1) {
        this.insertYasguiExamples();
      }
    }
  }

  insertYasguiExamples(): void {
    EXAMPLES.forEach(example => {
      const tab = this.yasgui.addTab(
        true,
        { ...Yasgui.Tab.getDefaults(), name: example.name }
      );
      tab.setQuery(example.value);
    });
  }

  async pushIasguiResultToQuadstore(): Promise<void> {
    if (!('json' in this.yasgui.getTab().getYasr().results &&
        'head' in this.yasgui.getTab().getYasr().results['json'] &&
        'vars' in this.yasgui.getTab().getYasr().results['json']['head'] &&
        this.yasgui.getTab().getYasr().results['json']['head']['vars'].length === 3)) {
      this.alert ='Result should be of type <s, p, o> in order to be saved in quadstore';
      return;
    }

    const q = this.yasgui.getTab().getEndpoint();
    const heads = this.yasgui.getTab().getYasr().results['json']['head']['vars'];
    const results = this.yasgui.getTab().getYasr().results['json']['results']['bindings'];
    await results.forEach(async result => {
        const s = result[heads[0]]['value'];
        const p = result[heads[1]]['value'];
        const o = result[heads[2]]['value'];
        await this.insertQuad(s,p,o,q);
    });
  }

  /*
  ########################################
  #QuadStore
  ########################################
  */
  upsertQuadStore(): void {
    if(!this.quadstore) {
      this.quadstore = new Quadstore({
        backend: leveljs('quadstore.db'),
        comunica: newEngine(),
        dataFactory,
      });
    }
  }

  async sparqlQuadStore(): Promise<void> {
    await this.quadstore.open();
    const response = await this.quadstore.sparql(this.yasgui.getTab().getQuery());
    this.yasgui.getTab().getYasr().setResponse(this.parseQuadstoreSparqlResult(response));
    this.yasgui.getTab().getYasr().draw();
  }

  async insertDummyQuads(): Promise<void> {
    await this.quadstore.open();
    await this.quadstore.multiPut([
      this.buildQuad('http://example/book1', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://schema.org/Book', 'http://example/shelf_A'),
      this.buildQuad('http://example/book1', 'http://schema.org/author', 'A.N.Other', 'http://example/shelf_A'),
      this.buildQuad('http://example/book1', 'http://schema.org/name', 'A new book', 'http://example/shelf_A'),
      this.buildQuad('http://example/book2', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://schema.org/Book', 'http://example/shelf_A'),
      this.buildQuad('http://example/book2', 'http://schema.org/author', "T.H.Same", 'http://example/shelf_A'),
      this.buildQuad('http://example/book2', 'http://schema.org/name', "A book", 'http://example/shelf_A'),
      this.buildQuad('http://example/book3', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://schema.org/Book', 'http://example/shelf_B'),
      this.buildQuad('http://example/book3', 'http://schema.org/author', "S.O.M.Other", 'http://example/shelf_B'),
      this.buildQuad('http://example/book3', 'http://schema.org/name', "A really old book", 'http://example/shelf_B'),
    ]);
    await this.getQuads();
  }

  async insertQuad(s,p,o,q): Promise<void> {
    await this.quadstore.open();
    await this.quadstore.put(this.buildQuad(s,p,o,q));
  }

  async updateQuads(): Promise<void> {
    await this.quadstore.open();
    const { items } = await this.quadstore.get({});
    await this.quadstore.multiPatch(items, this.quads);
    await this.getQuads();
  }

  async getQuads(): Promise<void> {
    await this.quadstore.open();
    const { items } = await this.quadstore.get({});
    this.quads = items;
  }

  async deleteQuad(i: number): Promise<void> {
    await this.quadstore.open();
    const { items } = await this.quadstore.get({});
    await this.quadstore.del(items[i]);
    await this.getQuads();
  }

  /*
  ########################################
  #Utils
  ########################################
  */

  buildQuad(s: string, p: string, o: string, g: string): Quad {
    return dataFactory.quad(dataFactory.namedNode(s), dataFactory.namedNode(p), dataFactory.namedNode(o), dataFactory.namedNode(g));
  }

  parseQuadstoreSparqlResult(result: any): void {
    return result.variables ? {
      head: {
        vars: result.variables.map(v => v.substr(1))
      },
      results: {
        bindings: result.items.map(binding => 
          Object.fromEntries(Object.entries(binding).map(
            pair => [pair[0].substr(1),{
              value: pair[1]['value'],
                type: pair[1]['datatype'] &&
                      (pair[1]['datatype']['value'] === 'http://www.w3.org/2001/XMLSchema#string' ||
                       pair[1]['datatype']['value'] === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString')?
                  'literal' : pair[1]['termType'] === 'BlankNode'? 'bnode' : pair[1]['termType'] === 'DefaultGraph'? 'defaultGraph':'uri', 'xml:lang' : pair[1]['language']
            }])
          ))
      }
    } : result
  }

  closeAlert(): void {
    this.alert = '';
  }

}
