import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column("text", {array: true, default: []})
    images:string[]

    @Column()
    price:number

    @Column()
    previousPrice:number

    @Column()
    rate:number

    @Column()
    createdAt:string
}
