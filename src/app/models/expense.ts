import { category } from './category';

export class Expense {
    public itemName: string;
    public amount: Number;
    public category: category;
    public deleted: boolean;
    public date: Date;
    public createdAt: Date;
    public updatedAt: Date;
}