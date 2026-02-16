import { UIComponentType } from "~/shared/admin.enums";
import { ClarityDataTable } from "~/client/components/core-components/clarity-data-table";
import { DynamicForm } from "./components/forms-components/dynamic_form/DynamicForm";
import { DeleteConfirm } from "./components/forms-components/dynamic_form/DeleteConfirm";
import { DynamicDetails } from "./components/details-components/DynamicDetails";

export const UiComponentMap = {
  [UIComponentType.TABLE]: ClarityDataTable,
  [UIComponentType.FORMS]: DynamicForm,
  [UIComponentType.DELETE]: DeleteConfirm,
  [UIComponentType.DETAILS]: DynamicDetails,


};
