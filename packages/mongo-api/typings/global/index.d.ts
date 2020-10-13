
declare namespace Express {
    export interface User {
        createdOn: Date;
        email: string;
        group: number;
        modifiedOn: Date;
        name: string;
        password: string;
        role: number;
        userId: string;
        _id: string;
    }
}