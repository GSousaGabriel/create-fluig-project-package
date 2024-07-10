import { Injectable, WritableSignal, signal } from '@angular/core';
import { Atividade } from '../../interfaces/atividade';
import { Processo, integracoesProcesso } from '../../interfaces/processo';
import { UpdatedUnformattedData } from '../../interfaces/updated-unformatted-data';

@Injectable({
  providedIn: 'root'
})
export class ProcessDataService {
  private processoSignal: WritableSignal<Processo | {}> = signal({});
  readonly showProcessoSignal = this.processoSignal.asReadonly();
  private atividadesSignal: WritableSignal<Atividade[]> = signal([]);
  readonly showAtividadesSignal = this.atividadesSignal.asReadonly();
  private unformattedDataSignal: WritableSignal<UpdatedUnformattedData | {}> = signal({});
  readonly showUnformattedDataSignal = this.unformattedDataSignal.asReadonly();

  constructor() { }

  setProcessData(newValue: Processo) {
    this.processoSignal.set(newValue);
  }

  setAtividades(newValue: Atividade[]) {
    this.atividadesSignal.set(newValue);
  }

  updateIntegracoes(newValue: integracoesProcesso) {
    this.processoSignal.update(oldValue => {
      return { ...oldValue, newValue }
    });
  }

  setUnformattedData(newValue: UpdatedUnformattedData) {
    newValue.processo = this.showProcessoSignal() as Processo

    this.unformattedDataSignal.set(newValue)
  }
}
