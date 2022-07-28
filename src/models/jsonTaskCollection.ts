import { TaskItem } from "./TaskItem.js";
import { TaskCollection } from "./taskCollection.js";
import { JSONFile, Low } from "lowdb";

type schemaType = {
  tasks: {
    id: number;
    task: string;
    complete: boolean;
  }[];
};

export class JsonTaskCollection extends TaskCollection {
  private database: Low<schemaType>;

  constructor(public username: string, taskItems: TaskItem[] = []) {
    super(username, []);
    const adapter = new JSONFile<schemaType>("Tasks.json");
    this.database = new Low(adapter);
    this.database.read();

    if (this.database.data) {
      let dbItems = this.database.data.tasks;
      dbItems.forEach((item) =>
        this.taskMap.set(
          item.id,
          new TaskItem(item.id, item.task, item.complete)
        )
      );
    } else {
      this.database.data = { tasks: taskItems };
      this.database.write();
      taskItems.forEach((item) => this.taskMap.set(item.id, item));
    }
  }

  addTask(task: string): number {
    let result = super.addTask(task);
    this.storeTasks();
    return result;
  }

  markComplete(id: number, complete: boolean): void {
    super.markComplete(id, complete);
    this.storeTasks();
  }

  removeComplete(): void {
    super.removeComplete();
    this.storeTasks();
  }

  private storeTasks() {
    this.database.data = { tasks: [...this.taskMap.values()] };
    this.database.write();
  }
}
