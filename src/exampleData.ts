import { TaskItem } from "./models/TaskItem";

export let tasks: TaskItem[] = [
  new TaskItem(1, "Buy Flowers"),
  new TaskItem(2, "Get Shoes"),
  new TaskItem(3, "task three"),
  new TaskItem(4, "task four", true)
];