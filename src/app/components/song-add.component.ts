import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SongService } from '../services/song.service';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';


@Component({
	selector: 'song-add',
	templateUrl: '../views/song-add.html',
	providers:[UserService,SongService]
})

export class SongAddComponent implements OnInit{
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public song: Song;
	public alertMessage;



	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _songService: SongService
		){

		this.titulo = 'Crear Nueva Cancion';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song(1,'','','','');

	}

	ngOnInit(){
		console.log('song-add.Component.ts cargado');


	}

	onSubmit(){
		
		this._route.params.forEach((params: Params)=>{
			let album_id = params['album'];
			this.song.album = album_id;
			console.log(this.song);

			this._songService.addSong(this.token,this.song)
					.subscribe(
						response => {
				
							if(!response.song){
								alert('Error en el servidor');
								this.alertMessage = 'Error en el servidor';

							}else{
								this.alertMessage = 'La canción se ha guardado correctamente!';
								this.song = response.song;
								this._router.navigate(['/editar-tema', response.song._id]);
							}
						},
						error => {
							var errorMessage = <any>error;
				 			if(errorMessage != null){
				 				var body = JSON.parse(error._body);
				 				this.alertMessage = body.message;
				 				console.log(error);
				 			}
						}

					);
			
		});
		
	}
}