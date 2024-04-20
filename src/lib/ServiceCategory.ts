export default class ServiceCategory {
  id: string;

  name: string;

  constructor(input: any) {
    this.id = input.id;
    this.name = input.name;
  }
}
