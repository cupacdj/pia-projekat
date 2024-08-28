import User from "./user";

export default class Company {
    name: string = "";
    address: string = "";
    decorators: string[] = [];
    contact: string = "";
    services: {name: string, price: number}[] = [];
    vacationPeriod: { from: Date | null, to: Date | null } = { from: null, to: null }
}
