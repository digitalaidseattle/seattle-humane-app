/* eslint-disable @typescript-eslint/naming-convention */
import {
  Animal, AppConstant, Client,
} from '@types';
import supabaseClient from 'utils/supabaseClient';
import { AppConstants } from 'src/constants';

export class AnimalService {
  contextPath: string;

  static async createSpecies(speciesInput: Pick<AppConstant, 'type' | 'label' | 'value'>) {
    const { type, label, value } = speciesInput;
    const { data: species, error } = await supabaseClient
      .from('app_constants')
      .insert({ type, label, value })
      .select()
      .maybeSingle();
    if (error) throw new Error(`Animal species creation failed: ${error.message}`);
    return species;
  }

  static async findSpecies(value: AppConstant['value']) {
    const { data: species, error } = await supabaseClient
      .from('app_constants')
      .select('*')
      .eq('species', AppConstants.Species)
      .eq('value', value)
      .maybeSingle();

    if (error) throw new Error(`Animal species retrieval failed: ${error.message}`);
    return species;
  }

  static async findAnimal(animalInput: Animal, client_id: Client['id']) {
    const { name, species_id } = animalInput;
    const { data: animal, error: animalError } = await supabaseClient
      .from('pets')
      .select('*')
      .eq('name', name)
      .eq('species', species_id)
      .eq('client_id', client_id)
      .maybeSingle();

    if (animalError) throw new Error(`Animal retrieval failed: ${animalError.message}`);
    return animal;
  }

  static async createAnimal(animalInput: Omit<Animal, 'id' | 'client_id'>, client_id: Client['id']) {
    const { name, species_id } = animalInput;
    const { data: newAnimal, error } = await supabaseClient
      .from('pets')
      .insert({
        name,
        species_id,
        client_id,
      })
      .select()
      .maybeSingle();

    if (error) throw new Error(`Animal creation failed: ${error.message}`);
    return newAnimal;
  }
}

const animalService = new AnimalService();
export {
  animalService,
};
