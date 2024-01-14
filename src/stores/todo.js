import { defineStore } from "pinia";
import axios from "axios";

const BASE_URL = "https://65a38f06a54d8e805ed3b6a9.mockapi.io";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    list: [],
    selectedTodo: {},
    statuses: ["Pending", "Doing", "Done"],
  }),
  actions: {
    async loadTodos() {
      try {
        const response = await axios.get(`${BASE_URL}/todos`);
        response.data.forEach((todo) => {
          if (!this.statuses.includes(todo.status)) {
            todo.status = "Pending";
          }
        });
        this.list = response.data;
      } catch (error) {
        console.log("error", error);
      }
    },
    async loadTodo(id) {
      try {
        const response = await axios.get(`${BASE_URL}/todos/${id}`);
        this.selectedTodo = response.data;
      } catch (error) {
        console.log("error", error);
      }
    },
    async addTodo(todoText) {
      const bodyData = {
        name: todoText,
        status: "Pending",
      };
      try {
        const response = await axios.post(`${BASE_URL}/todos`, bodyData);
        console.log(response.data);
      } catch (error) {
        console.log("error", error);
      }
    },
    async editTodo(todoData, id) {
      try {
        const updateData = {
          name: todoData.name,
          status: todoData.status,
        };
        const response = await axios.put(`${BASE_URL}/todos/${id}`, updateData);
        console.log(response.data);
      } catch (error) {
        console.log("error", error);
      }
    },
    async removeTodo(id) {
      try {
        const response = await axios.delete(`${BASE_URL}/todos/${id}`);
        console.log(response.data);
      } catch (error) {
        console.log("error", error);
      }
    },
  },
});
