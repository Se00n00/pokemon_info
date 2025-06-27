import { Component, signal } from '@angular/core';
import { PokeService } from '../poke.service';
import { TitleCasePipe } from '@angular/common';
import { FastAverageColor } from "fast-average-color";
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
// import ColorThief from 'color-thief-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { CommonModule } from '@angular/common';
// import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [TitleCasePipe,RouterLink,CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  binding = ""
  allpokemons:any = []
  randomfivepokemons:any = []
  newdata:any = []
  currentTotal = signal(0)

  private searchSubject = new Subject<string>();  // To handle debouncing
  constructor(private pokemonService: PokeService,private http:HttpClient) {
    this.searchSubject.pipe(
      debounceTime(500),  // Wait 500ms before sending API request
      distinctUntilChanged() // Only trigger if input is different
    ).subscribe(value => {
      this.callApi(value);
    });
  }
  ngOnInit() {
    // this.searchTerm.pipe(
    //   debounceTime(500), // Wait for user to stop typing
    //   distinctUntilChanged(), // Avoid duplicate searches
    //   switchMap(term => this.pokemonService.getPokemon(term))
    // ).subscribe(data => {
    //   this.searchResults = data ? [data] : [];
    // });
    this.getAllPokemon()

    this.getrandom()
  }

  getrandom(){
    for(let i=1;i<=5;i++){
      let j = Math.floor(Math.random()*(1-1000))
      this.randomfivepokemons.push(this.getsinglepoken(j))
    }
    console.log(this.randomfivepokemons)
  }


  onInputChange() {
    if (!this.binding.trim()) {
      this.getAllPokemon();
      return;
    }
    this.searchSubject.next(this.binding.trim().toLowerCase());
  }

  callApi(query: string) {
    this.getsinglepoken(query).subscribe(data => {
      this.allpokemons.unshift({
        name: data.name,
        url: `https://pokeapi.co/api/v2/pokemon/${data.id}/`,
        imageUrl: this.getPokemonImage(`https://pokeapi.co/api/v2/pokemon/${data.id}/`),
        bgColor: 'transparent',
        logo: this.getlogo(`https://pokeapi.co/api/v2/pokemon/${data.id}/`)
      });
    });
  }


  getAllPokemon(){
    
    this.pokemonService.getAllPokemon(this.currentTotal()).subscribe(data=>{
      this.allpokemons = data.results.map((pokemon: any) => ({
        name: pokemon.name,
        url: pokemon.url,
        imageUrl: this.getPokemonImage(pokemon.url),
        bgColor: 'transparent', // Default background color
        logo: this.getlogo(pokemon.url)
      }));
    })
  }
  getsinglepoken(pokemon: any) {
    return this.pokemonService.getPokemon(pokemon); // return Observable
  }

  loadmore(){
    this.currentTotal.update(value => value=value+10)
    this.getAllPokemon();
  }

  loadprev(){
    if(this.currentTotal() > 0){
      this.currentTotal.update(value => value=value-10)
      this.getAllPokemon();
    }
  }

  getlogo(url: string): string {
    const id = url.split('/').filter(x => x).pop();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }
  

  getPokemonImage(url: string): string {
    const id = url.split('/').filter(x => x).pop()
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  }

  setBackgroundColor(event: any, index: number) {
    const img = event.target;
    const fac = new FastAverageColor();
  
    fac.getColorAsync(img)
      .then((color) => {
        this.allpokemons[index].bgColor = color.hex; // Set background color
      })
      .catch((error) => {
        console.error("Color extraction failed:", error);
        this.allpokemons[index].bgColor = "#ccc"; // Fallback color
      });
  }

  searchTerm = new Subject<string>();
  searchResults: any[] = [];
  searchPokemon(event: any) {
    const query = event.target.value.trim().toLowerCase();
    if (query) {
      this.searchTerm.next(query);
    } else {
      this.searchResults = [];
    }
  }
  
}
