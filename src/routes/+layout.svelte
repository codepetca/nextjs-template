<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import type { User } from '$lib/supabase';
  import '../app.css';

  let user: User | null = null;
  let loading = true;

  onMount(async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      user = data;
    }
    loading = false;

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        user = data;
      } else if (event === 'SIGNED_OUT') {
        user = null;
      }
    });
  });

  async function signOut() {
    await supabase.auth.signOut();
  }
</script>

<div class="min-h-screen bg-gray-100">
  <nav class="bg-white shadow">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold">Grading Tool</a>
        </div>
        <div class="flex items-center">
          {#if user}
            <span class="mr-4">Welcome, {user.email}</span>
            <button
              on:click={signOut}
              class="bg-red-500 text-white px-4 py-2 rounded"
            >
              Sign Out
            </button>
          {/if}
        </div>
      </div>
    </div>
  </nav>

  <main class="container mx-auto px-4 py-8">
    {#if loading}
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    {:else}
      <slot />
    {/if}
  </main>
</div> 