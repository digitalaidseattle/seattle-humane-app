import { AppConstantTypes } from '@lib';
import { AppConstantSchema, TeamMemberSchema } from '@types';
import { Database } from 'supabase/database.types';
import supabaseClient from 'utils/supabaseClient';
import { v4 } from 'uuid';

const categories: AppConstantSchema[] = [];
const sources: AppConstantSchema[] = [];
const species: AppConstantSchema[] = [];
const teamMembers: TeamMemberSchema[] = [];
export const testData = {
  categories, sources, species, teamMembers,
};
export async function setupPrerequisiteTestData() {
  // Create categories
  await Promise.all(['Phone', 'In-person', 'Email'].map(async (label) => {
    const { data: category } = await supabaseClient
      .from('app_constants')
      .insert({
        type: AppConstantTypes.ServiceCategory,
        label,
        value: label,
      }).select().maybeSingle();
    categories.push(category);
  }));

  // Create sources
  await Promise.all(['Phone', 'Walk-in', 'Email'].map(async (label) => {
    const { data: source } = await supabaseClient.from('app_constants')
      .insert({
        type: AppConstantTypes.ServiceSource,
        label,
        value: label,
      }).select().maybeSingle();
    sources.push(source);
  }));

  // Create species
  await Promise.all(['Dog', 'Cat', 'Bird'].map(async (label) => {
    const { data } = await supabaseClient.from('app_constants')
      .insert({
        type: AppConstantTypes.Species,
        label,
        value: label,
      }).select().maybeSingle();
    species.push(data);
  }));

  // Create test team member
  const { data: teamMember } = await supabaseClient.from('team_members').insert({
    first_name: 'John',
  }).select().maybeSingle();
  teamMembers.push(teamMember);
}

export async function clearPrerequisiteTestData() {
  // Order of deletion is important
  const tables: (keyof Database['public']['Tables'])[] = ['service_requests', 'pets', 'clients', 'team_members', 'app_constants'];
  // eslint-disable-next-line no-restricted-syntax
  for (const table of tables) {
    // eslint-disable-next-line no-await-in-loop
    const { error } = await supabaseClient.from(table).delete().neq('id', v4());
    if (error) throw new Error(error.message);
  }
}
