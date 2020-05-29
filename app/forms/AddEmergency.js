import t from "tcomb-form-native";
import inputTemplate from "./templates/Input";
import textareaTemplate from "./templates/Textarea";

export const AddEmergencyStruct = t.struct({
  name: t.String,
  // city: t.String,
  // address: t.String,
  description: t.String
});

export const AddEmergencyOptions = {
  fields: {
    name: {
      template: inputTemplate,
      config: {
        placeholder: "Nombre de la emergencia",
        iconType: "materialicons",
        iconName: "warning"
      }
    },
    description: {
      template: textareaTemplate,
      config: {
        placeholder: "Descripción de la emergencia"
      }
    }
  }
};
