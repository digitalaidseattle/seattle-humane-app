import { createClient } from '@supabase/supabase-js';

async function run() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const { data, error } = await supabase.functions.invoke('hello-world', {
    body: { name: 'Functions' },
  });
  return { data, error };
}

xdescribe('edge functions', () => {
  it('can be called', async () => {
    const res = await run();
    expect(res.data).not.toBeFalsy();
  });
});
