<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import type { User } from '$lib/supabase';

  let user: User | null = null;
  let tests: any[] = [];
  let newTest = {
    title: '',
    type: 'multiple_choice',
    questions: [] as any[]
  };

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
    loadTests();
  });

  async function loadTests() {
    const { data } = await supabase
      .from('tests')
      .select('*')
      .eq('teacher_id', user?.id);
    tests = data || [];
  }

  function addQuestion() {
    newTest.questions.push({
      prompt: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
  }

  async function createTest() {
    const { data, error } = await supabase
      .from('tests')
      .insert([{
        ...newTest,
        teacher_id: user?.id
      }])
      .select();

    if (!error) {
      tests = [...tests, ...data];
      newTest = {
        title: '',
        type: 'multiple_choice',
        questions: []
      };
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Teacher Dashboard</h1>

  <div class="mb-8">
    <h2 class="text-2xl font-semibold mb-4">Create New Test</h2>
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Test Title</label>
        <input
          type="text"
          bind:value={newTest.title}
          class="w-full p-2 border rounded"
          placeholder="Enter test title"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Test Type</label>
        <select bind:value={newTest.type} class="w-full p-2 border rounded">
          <option value="multiple_choice">Multiple Choice</option>
          <option value="coding">Coding</option>
        </select>
      </div>

      {#each newTest.questions as question, i}
        <div class="mb-4 p-4 border rounded">
          <div class="mb-2">
            <label class="block text-gray-700 mb-2">Question {i + 1}</label>
            <input
              type="text"
              bind:value={question.prompt}
              class="w-full p-2 border rounded"
              placeholder="Enter question prompt"
            />
          </div>

          {#if newTest.type === 'multiple_choice'}
            {#each question.options as option, j}
              <div class="mb-2">
                <input
                  type="text"
                  bind:value={question.options[j]}
                  class="w-full p-2 border rounded"
                  placeholder={`Option ${j + 1}`}
                />
              </div>
            {/each}
            <div class="mt-2">
              <label class="block text-gray-700 mb-2">Correct Answer</label>
              <select bind:value={question.correctAnswer} class="w-full p-2 border rounded">
                {#each question.options as _, j}
                  <option value={j}>Option {j + 1}</option>
                {/each}
              </select>
            </div>
          {/if}
        </div>
      {/each}

      <button
        on:click={addQuestion}
        class="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Add Question
      </button>
      <button
        on:click={createTest}
        class="bg-green-500 text-white px-4 py-2 rounded"
      >
        Create Test
      </button>
    </div>
  </div>

  <div>
    <h2 class="text-2xl font-semibold mb-4">Your Tests</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each tests as test}
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-xl font-semibold mb-2">{test.title}</h3>
          <p class="text-gray-600 mb-4">Type: {test.type}</p>
          <p class="text-gray-600">Questions: {test.questions.length}</p>
        </div>
      {/each}
    </div>
  </div>
</div> 