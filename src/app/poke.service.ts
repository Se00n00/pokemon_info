import { Injectable, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  constructor(private http:HttpClient) { }

  getPokemon(nameOrId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${nameOrId}`);
  }
  
  getAllPokemon(id:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?offset=${id}&limit=${10}`);
  }
  
}
