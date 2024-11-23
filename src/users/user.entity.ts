import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column("text", {array: true, default: []})
    cart: string[]
}