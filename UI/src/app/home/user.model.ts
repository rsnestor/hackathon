export class User{
	name: string;
	username: string;
	
	constructor(obj?: any){
		this.name = obj && obj.name;
		this.username = obj && obj.username;
	}
}