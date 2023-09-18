export interface Task {
  taskName: string;
  taskStatus: "todo" | "complete";
}

export const validateTasks = (tasks: any) => {
  return {
    validatedTasks: tasks as Record<string, Task>,
    hasError:
      typeof tasks !== "object" ||
      Array.isArray(tasks) ||
      Object.values(tasks).some((task: any) => {
        return (
          typeof task !== "object" ||
          Array.isArray(task) ||
          !("taskName" in task) ||
          !("taskStatus" in task) ||
          typeof task.taskName !== "string" ||
          typeof task.taskStatus !== "string" ||
          !["todo", "complete"].includes(task.taskStatus)
        );
      }),
  };
};

export const ErrorComponent: React.FC = () => {
  return (
    <div className="sb-example-root">
      <h3>Invalid Tasks List!</h3>
      <p>Tasks should be of the format:</p>
      <pre>
        {`{
  "<task-id>": {
    taskName: "<task-name>",
    taskStatus: "todo" | "complete",
  },
...}`}
      </pre>
    </div>
  );
};
