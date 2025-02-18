import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokeService } from './poke.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'Pokemon_info';
  pokemon: any;
  pokemonName = 'pikachu';
  allpokemons = []

  constructor(private pokemonService: PokeService) {}
  ngOnInit() {
    // this.getAllPokemon()
    this.getPokemon();
  }
  getPokemon() {
    this.pokemonService.getPokemon(this.pokemonName).subscribe(data => {
      console.log(data); // ✅ Logs API response
      this.pokemon = data;
    });
  }
}
