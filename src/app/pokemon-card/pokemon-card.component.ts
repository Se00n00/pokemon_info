import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TitleCasePipe } from '@angular/common';
import { FastAverageColor } from "fast-average-color";
import { PokeService } from '../poke.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-card',
  imports: [TitleCasePipe,RouterLink,CommonModule],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.css'
})
export class PokemonCardComponent implements OnInit {
  pokemonName: string = "";
  pokemon:any = {}
  pokemon_meta:any = {}
  constructor(private route: ActivatedRoute, private titleService: Title, private poke:PokeService) {}

  ngOnInit() {
    this.pokemonName = this.route.snapshot.paramMap.get('string') || ""
    this.titleService.setTitle(this.pokemonName);
    this.getpokemon()
    this.getpokemonmeta(this.route.snapshot.paramMap.get('url')|| "",this.route.snapshot.paramMap.get('id')|| "")
    console.log(this.pokemon_meta)
  }

  getpokemon(){
    this.poke.getPokemon(this.pokemonName).subscribe(data=> {
      this.pokemon = data
      console.log(this.pokemon)}
    )
  }

  getpokemonmeta(url:string,id:any){
    this.pokemon_meta.bgColor = 'transparent'
    this.pokemon_meta.url = url
    this.pokemon_meta.id = id
    this.pokemon_meta.imageUrl = this.getPokemonImage(this.pokemon_meta.url)
    this.pokemon_meta.logo = this.getlogo(this.pokemon_meta.url)
  }

  getPokemonImage(url: string): string {
    const id = url.split('/').filter(x => x).pop()
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  }

  getlogo(url: string): string {
    const id = url.split('/').filter(x => x).pop();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  }

  setBackgroundColor(event: any, id:any) {
    const img = event.target;
    const fac = new FastAverageColor();
  
    fac.getColorAsync(img)
      .then((color) => {
        this.pokemon_meta.bgColor = color.hex; // Set background color
      })
      .catch((error) => {
        console.error("Color extraction failed:", error);
        this.pokemon_meta.bgColor = "#ccc"; // Fallback color
      });
  }
}
