import { Component, AfterViewInit } from '@angular/core';
import * as dataFactory from '@rdfjs/data-model';
import { newEngine } from 'quadstore-comunica';
import { OnInit } from '@angular/core';
import { Quad, Quadstore } from 'quadstore';
import Yasgui from '@triply/yasgui';
import leveljs from 'level-js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  quads: Array<Quad> = [];
  quadstore: Quadstore;
  yasgui: Yasgui;

  ngOnInit(): void {
    this.upsertQuadStore();
    this.upsertYasgui();
  }

  ngAfterViewInit(): void {
    this.upsertQuadStore();
    this.upsertYasgui();
  }

  upsertYasgui(): void {
    if(!!document.getElementById("yasgui")) {
      this.yasgui = new Yasgui(document.getElementById("yasgui"), {
        copyEndpointOnNewTab: false,
      });
    }
  }

  upsertQuadStore(): void {
    if(!this.quadstore) {
      this.quadstore = new Quadstore({
        backend: leveljs('quadstore'),
        comunica: newEngine(),
        dataFactory,
      });
    }
  }

  async insertDummyQuads(): Promise<void> {
    await this.quadstore.open();
    await this.quadstore.multiPut([
      this.buildQuad('matei l', 'nu doarme', '06/12/2021', 'efecte-facultate'),
      this.buildQuad('matei c', 'nu doarme', '07/12/2021', 'efecte-facultate'),
      this.buildQuad('mihnea', 'plange', 'pe facebook', 'efecte-facultate'),
    ]);
    await this.getQuads();
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

  buildQuad(s: string, p: string, o: string, g: string): Quad {
    return dataFactory.quad(dataFactory.namedNode(s), dataFactory.namedNode(p), dataFactory.namedNode(o), dataFactory.namedNode(g));
  }

}
