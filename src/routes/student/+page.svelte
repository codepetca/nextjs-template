<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import CodeEditor from '$lib/components/CodeEditor.svelte';
  import type { User } from '$lib/supabase';

  let user: User | null = null;
  let tests: any[] = [];
  let currentTest: any = null;
  let currentQuestionIndex = 0;
  let answers: Record<string, any> = {};
  let feedback: string | null = null;

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
      .select('*');
    tests = data || [];
  }

  function startTest(test: any) {
    currentTest = test;
    currentQuestionIndex = 0;
    answers = {};
    feedback = null;
  }

  async function submitAnswer() {
    const currentQuestion = currentTest.questions[currentQuestionIndex];
    
    if (currentTest.type === 'coding') {
      try {
        const response = await fetch('http://localhost:3001/grade', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: answers[currentQuestionIndex] || '',
            prompt: currentQuestion.prompt
          })
        });
        
        const result = await response.json();
        feedback = result.feedback;
      } catch (error) {
        console.error('Error grading code:', error);
        feedback = 'Error grading code. Please try again.';
      }
    } else {
      // For multiple choice, just store the answer
      answers[currentQuestionIndex] = answers[currentQuestionIndex] || '';
    }
  }

  function nextQuestion() {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      currentQuestionIndex++;
      feedback = null;
    }
  }

  function previousQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      feedback = null;
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Student Dashboard</h1>

  {#if !currentTest}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each tests as test}
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-xl font-semibold mb-2">{test.title}</h3>
          <p class="text-gray-600 mb-4">Type: {test.type}</p>
          <p class="text-gray-600 mb-4">Questions: {test.questions.length}</p>
          <button
            on:click={() => startTest(test)}
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Start Test
          </button>
        </div>
      {/each}
    </div>
  {:else}
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-semibold mb-4">{currentTest.title}</h2>
      
      <div class="mb-4">
        <h3 class="text-xl mb-2">Question {currentQuestionIndex + 1} of {currentTest.questions.length}</h3>
        <p class="text-gray-700 mb-4">{currentTest.questions[currentQuestionIndex].prompt}</p>

        {#if currentTest.type === 'coding'}
          <div class="h-96 mb-4">
            <CodeEditor
              bind:code={answers[currentQuestionIndex]}
              language="typescript"
            />
          </div>
        {:else}
          <div class="space-y-2">
            {#each currentTest.questions[currentQuestionIndex].options as option, i}
              <div class="flex items-center">
                <input
                  type="radio"
                  name="answer"
                  value={i}
                  bind:group={answers[currentQuestionIndex]}
                  class="mr-2"
                />
                <label>{option}</label>
              </div>
            {/each}
          </div>
        {/if}

        {#if feedback}
          <div class="mt-4 p-4 bg-gray-100 rounded">
            <h4 class="font-semibold mb-2">Feedback:</h4>
            <p>{feedback}</p>
          </div>
        {/if}

        <div class="flex justify-between mt-6">
          <button
            on:click={previousQuestion}
            disabled={currentQuestionIndex === 0}
            class="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            on:click={submitAnswer}
            class="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit Answer
          </button>
          <button
            on:click={nextQuestion}
            disabled={currentQuestionIndex === currentTest.questions.length - 1}
            class="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  {/if}
</div> 