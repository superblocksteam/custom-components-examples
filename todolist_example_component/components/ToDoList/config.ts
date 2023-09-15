import { type ComponentConfig } from "@superblocksteam/custom-components";

export default {
  // DO NOT CHANGE THE ID ONCE THE COMPONENT HAS BEEN REGISTERED!
  id: "f0e14b6b-655e-4163-923f-d8fa60bf7e57",
  name: "ToDoList",
  displayName: "To-Do List (Example)",
  componentPath: "components/ToDoList/component.tsx",
  properties: [{
    path: "tasks",
    dataType: "any",
    propertiesPanelDisplay: {"label":"Default Tasks","placeholder":"{ taskId: { taskName: 'Task Name', taskStatus: 'complete' | 'todo' } }","controlType":"js-expr"},
    isExternallyReadable: true,
    isExternallySettable: true
    },],
  events: [{
    label: "On Task Added",
    path: "onTaskAdded"
    },
    {
    label: "On Task Status Changed",
    path: "onTaskStatusChanged"
    },],
  gridDimensions: {
    initialColumns: 50,
    initialRows: 30,
  },
} satisfies ComponentConfig;
