<script setup>
import { ref, onMounted, computed } from "vue";
import { RouterLink } from "vue-router";

import { useTodoStore } from "@/stores/todo";

import Loading from "../components/Loading.vue";

const todoStore = useTodoStore();
const todoText = ref("");
const isLoading = ref(false);

const selectedStatus = ref("Pending");
const todoFilteredList = computed(() => {
  return todoStore.list.filter((todo) => todo.status === selectedStatus.value);
});

onMounted(async () => {
  isLoading.value = true;
  await todoStore.loadTodos();
  isLoading.value = false;
});

const changeSelectedStatus = (newStatus) => {
  selectedStatus.value = newStatus;
};

const addTodo = async (todoText) => {
  isLoading.value = true;
  try {
    await todoStore.addTodo(todoText);
    await todoStore.loadTodos();
  } catch (error) {
    console.log("error", error);
  }
  isLoading.value = false;
};

const updateStatus = async (todoId, todoStatus) => {
  isLoading.value = true;
  try {
    await todoStore.editTodo(
      {
        status: todoStatus,
      },
      todoId
    );
  } catch (error) {
    console.log("error", error);
  }
  isLoading.value = false;
};

const changeDoneStatus = async (event, todoId) => {
  try {
    if (event.target.checked) {
      await updateStatus(todoId, "Done");
      await todoStore.loadTodos();
    } else {
      await updateStatus(todoId, "Pending");
      await todoStore.loadTodos();
    }
  } catch (error) {
    console.log("error", error);
  }
};

const removeTodo = async (todoId) => {
  isLoading.value = true;
  try {
    await todoStore.removeTodo(todoId);
    await todoStore.loadTodos();
  } catch (error) {
    console.log("error", error);
  }
  isLoading.value = false;
};
</script>

<template>
  <div class="flex">
    <input
      class="input input-bordered input-info w-full"
      type="text"
      placeholder="Add your item"
      v-model="todoText"
    />
    <button
      class="btn ml-4"
      @click="addTodo(todoText)"
    >
      Add
    </button>
  </div>
  <div>
    <Loading v-if="isLoading" />
    <div>
      <div class="tabs tabs-boxed my-2">
        <a
          v-for="status in todoStore.statuses"
          :key="status"
          :class="status === selectedStatus ? 'tab tab-active' : 'tab'"
          @click="changeSelectedStatus(status)"
        >
          {{ status }}
        </a>
      </div>
      <div
        class="flex items-center justify-between my-2"
        v-for="todo in todoFilteredList"
        :key="todo.id"
      >
        <input
          type="checkbox"
          :checked="todo.status === 'Done'"
          class="checkbox"
          @change="changeDoneStatus($event, todo.id)"
        />
        <div :class="todo.status === 'Done' ? 'line-through' : ''">
          {{ todo.name }}
        </div>
        <div>
          <RouterLink :to="{ name: 'edit-view', params: { id: todo.id } }">
            <button class="btn btn-square btn-outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
              >
                <path
                  d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"
                />
              </svg>
            </button>
          </RouterLink>
          <button
            class="btn btn-square btn-outline ml-2"
            @click="removeTodo(todo.id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 448 512"
            >
              <path
                d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
svg {
  fill: white;
}
</style>
