import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FluigAuthService } from '../auth/fluig-auth.service';
import { Processo } from '../../interfaces/processo';

type genericBody = { [key: string]: any } | null

@Injectable({
  providedIn: 'root'
})
export class FluigService {
  urlFluig = environment.URL_FLUIG

  constructor(
    private http: HttpClient,
    private fluigAuth: FluigAuthService
  ) { }

  getTabelaFilho(alcada: Processo, tabelaPai: string, tabelaFilho: string) {
    const body = {
      "name": tabelaPai,
      "fields": [],
      "constraints": this.getConstraintsPaixFilho(alcada, tabelaFilho),
      "order": []
    }
    const endpoint = '/api/public/ecm/dataset/datasets'

    return this.callFluigApi("POST", endpoint, body)
  }

  callFluigApi(type: string, endpoint: string, body: genericBody = null) {
    const url = `${this.urlFluig}${endpoint}`
    const headers = this.fluigAuth.getOAuthHeader(type, url)

    if (body) {
      return this.http.post(url, body, { headers })
    } else {
      return this.http.post(url, { headers })
    }
  }

  getConstraintsPaixFilho(alcada: Processo, tablename: string) {
    const c1 = this.getConstraint("tablename", tablename)
    const c2 = this.getConstraint("metadata#id", alcada.documentId)
    const c3 = this.getConstraint("metadata#version", alcada.version)

    return [c1, c2, c3]
  }

  getConstraint(field: string, value: any) {
    const constraint = { "_field": field, "_initialValue": value, "_finalValue": value, "_type": 1 }

    return constraint
  }
}
