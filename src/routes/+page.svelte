<script lang="ts">
  import { supabase } from '$lib/supabase';
  import type { User } from '$lib/supabase';

  let email = '';
  let password = '';
  let role: 'teacher' | 'student' = 'student';
  let error = '';

  async function signUp() {
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email,
            role
          }]);
      }
    } catch (e) {
      error = e.message;
    }
  }

  async function signIn() {
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
    } catch (e) {
      error = e.message;
    }
  }
</script>

<div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
  <h1 class="text-2xl font-bold mb-6">Welcome to Grading Tool</h1>

  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}

  <form on:submit|preventDefault>
    <div class="mb-4">
      <label for="email" class="block text-gray-700 mb-2">Email</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        class="w-full p-2 border rounded"
        placeholder="Enter your email"
        required
      />
    </div>

    <div class="mb-4">
      <label for="password" class="block text-gray-700 mb-2">Password</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        class="w-full p-2 border rounded"
        placeholder="Enter your password"
        required
      />
    </div>

    <div class="mb-4">
      <label for="role" class="block text-gray-700 mb-2">Role</label>
      <select
        id="role"
        bind:value={role}
        class="w-full p-2 border rounded"
        required
      >
        <option value="teacher">Teacher</option>
        <option value="student">Student</option>
      </select>
    </div>

    <div class="flex space-x-4">
      <button
        type="button"
        on:click={signUp}
        class="bg-blue-500 text-white px-4 py-2 rounded flex-1"
      >
        Sign Up
      </button>
      <button
        type="button"
        on:click={signIn}
        class="bg-green-500 text-white px-4 py-2 rounded flex-1"
      >
        Sign In
      </button>
    </div>
  </form>
</div>
