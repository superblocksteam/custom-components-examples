import { type ComponentConfig } from "@superblocksteam/custom-components";

export default {
  // DO NOT CHANGE THE ID ONCE THE COMPONENT HAS BEEN REGISTERED!
  id: "8813cdb5-99bd-4f10-84fc-05488e155868",
  name: "DocumentScanner",
  displayName: "Document Scanner",
  componentPath: "components/DocumentScanner/component.tsx",
  properties: [
    {
      path: "image",
      dataType: "any",
      isExternallyReadable: true,
      isExternallySettable: true,
    },
    {
      path: "rainConfettiOnCapture",
      dataType: "boolean",
      isExternallyReadable: true,
      isExternallySettable: false,
      propertiesPanelDisplay: {
        controlType: "switch",
        label: "Rain Confetti",
      },
    },
  ],
  events: [
    {
      label: "On Image Capture",
      path: "onImageCapture",
    },
  ],
  gridDimensions: {
    initialColumns: 50,
    initialRows: 30,
  },
} satisfies ComponentConfig;
