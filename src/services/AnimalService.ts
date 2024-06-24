import supabaseClient from 'utils/supabaseClient';
import { AnimalType } from '@types';

class AnimalService {
  contextPath: string;

  static async get<T extends keyof AnimalType>(
    key: T,
    value: AnimalType[T],
  ): Promise<AnimalType> {
    const { data, error } = await supabaseClient
      .from('pets')
      .select('*')
      .eq(key, value)
      .maybeSingle();

    if (error) {
      console.log(`ERROR IN GET PET BY ${key}:`, error);
      // Disabled because error is already an Error object
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw error;
    }

    if (!data) throw new Error(`No pet found with the provided ${key}`);

    return data;
  }
}

export default AnimalService;
