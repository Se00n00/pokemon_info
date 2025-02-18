import { Component, signal } from '@angular/core';
import { PokeService } from '../poke.service';
import { TitleCasePipe } from '@angular/common';
import { FastAverageColor } from "fast-average-color";
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// import ColorThief from 'color-thief-browser';



@Component({
  selector: 'app-home',
  imports: [TitleCasePipe,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  allpokemons:any = []
  newdata:any = []
  currentTotal = signal(0)

  constructor(private pokemonService: PokeService,private http:HttpClient) {}
  ngOnInit() {
    this.getAllPokemon()
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
  getsinglepoken(pokemon:string){
    this.pokemonService.getPokemon(pokemon).subscribe(data => {
      console.log(data)
      return data
    });
  }
  loadmore(){
    this.currentTotal.update(value => value=value+10)

    this.pokemonService.getAllPokemon(this.currentTotal()).subscribe(data=>{
      const newPokemons = data.results.map((pokemon: any) => ({
        name: pokemon.name,
        url: pokemon.url,
        imageUrl: this.getPokemonImage(pokemon.url),
        bgColor: 'transparent', // Default background color
        logo: this.getlogo(pokemon.url)
      }));
      this.allpokemons.push(...newPokemons);
    })
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

  
  
}
