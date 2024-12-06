export class User{
    _id:string;
    name: string;
    email: string;
    username: string;
    password: string;
    mobile!: number;
    role: string;

    constructor(){
        this._id=''
        this.name=''
        this.email=''
        this.username=''
        this.password=''
        this.role=''
    }
}

export class SearchFilter{
    userName: string;
    userStatus: string;
    role: string;
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortOrder: string;

    constructor(){
        this.userName=''
        this.userStatus=''
        this.role=''
        this.pageNumber='1'
        this.pageSize='2'
        this.sortBy=''
        this.sortOrder='asc'
    }
}

 