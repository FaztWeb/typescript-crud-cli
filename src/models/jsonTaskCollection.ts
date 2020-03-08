import { TaskItem } from "./TaskItem";
import { TaskCollection } from "./taskCollection";
import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

type schemaType = {
  tasks: {
    id: number;
    task: string;
    complete: boolean;
  }[];
};

export class JsonTaskCollection extends TaskCollection {
  private database: lowdb.LowdbSync<schemaType>;

  constructor(public username: string, taskItems: TaskItem[] = []) {
    super(username, []);
    this.database = lowdb(new FileSync("Tasks.json"));
    if (this.database.has("tasks").value()) {
      let dbItems = this.database.get("tasks").value();
      dbItems.forEach(item =>
        this.taskMap.set(
          item.id,
          new TaskItem(item.id, item.task, item.complete)
        )
      );
    } else {
      this.database.set("tasks", taskItems).write();
      taskItems.forEach(item => this.taskMap.set(item.id, item));
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

  removeComplete():void {
    super.removeComplete();
    this.storeTasks();
  }

  private storeTasks() {
    this.database.set("tasks", [...this.taskMap.values()]).write();
  }
}
