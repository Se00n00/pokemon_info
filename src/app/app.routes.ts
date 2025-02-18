import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { PokemonCardComponent } from './pokemon-card/pokemon-card.component';

export const routes: Routes = [
    {path:"",title:"pokemons",component:HomeComponent},
    {path:"pokemon/:url/:id/:string",component:PokemonCardComponent},
    {path:"**",title:"Oops! page not found", component:ErrorComponent}
];
