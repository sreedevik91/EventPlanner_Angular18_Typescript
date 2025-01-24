export class Chat {
    _id: string;
    userId: string;
    roomId: string;
    chats: IChat;
    constructor() {
        this._id = ''
        this.userId = ''
        this.roomId=''
        this.chats = {message:'',date:new Date(),sender:'',receiver:''}
    }
}

export interface IChat {
    sender:string;
    receiver?:string;
    message: string;
    date: Date;
}

export class ChatSearchFilter{
    userName: string;
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortOrder: string;

    constructor(){
        this.userName=''
        this.pageNumber='1'
        this.pageSize='2'
        this.sortBy=''
        this.sortOrder='asc'
    }
}