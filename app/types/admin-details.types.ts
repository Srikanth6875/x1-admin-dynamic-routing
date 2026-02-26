import { UIComponentType } from "~/shared/admin.enums";
import type { FormFields } from "./form.types";


export type DetailTableAction = {
  label: string;
  variant?: "primary" | "secondary" | "danger";
  route_prefix: string;
  appType: string;
  runType: string;
  params?: Record<string, string>;
};

export interface DetailsSection {
  title?: string;
  columns: number;
  fields: {
    key: string;
    label: string;
    render?: string;
    highlight?: boolean;
  }[];
}

export interface DetailsTable {
  title: string;
  dataKey: string;
  columns: {
    key: string;
    label: string;
  }[];
  actions?: any[];
}

export type BuildDetailsParams =
  | {
    title: string;
    data: Record<string, any>;
    sections: DetailSection[];
    tables?: DetailTable[];
  }
  | {
    title: string;
    data: Record<string, any>;
    fields: DetailField[];
    tables?: DetailTable[];
  };

export type DetailField = {
  key: string;
  label: string;
  render?: "status" | "boolean" | "date" | "currency";
  highlight?: boolean;
};


export type DetailSection = {
  title?: string;
  columns?: 1 | 2 | 3 | 4;
  fields: DetailField[];
};
export type DetailTab = {
  id: string;
  label: string;
  type: "fields" | "table" | "html";
  content?: {
    fields?: DetailField[];
    tableKey?: string; // dataKey for table
    htmlKey?: string; // dataKey for HTML content
  };
};

export interface DetailsPayload {
  title: string;
  data: Record<string, any>;
  fields: DetailField[];
  tables?: DetailTable[];
  tabs?: DetailTab[]; 
};

export type BuildDetailsInput = {
  title: string;
  data: Record<string, any>;
  fields: FormFields;
  tables?: DetailTable[];
  tabs?: DetailTab[];
};

export type DetailTableColumn = {
  key: string;
  label: string;
};
/* ------------------ RENDER DESCRIPTOR ------------------ */

export type DetailsRenderDescriptor = {
  component_type: UIComponentType.DETAILS;
  payload: DetailsPayload;
};

export type TableAction = {
  label: string;
  variant?: "primary" | "secondary" | "danger";
  route_prefix: string;
  appType: string;
  runType: string;
  params?: Record<string, string>;
};

export type DetailTable = {
  title: string;
  dataKey: string;
  columns: DetailTableColumn[];
  actions?: TableAction[];
};