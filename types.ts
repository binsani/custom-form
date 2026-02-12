
export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  NUMBER = 'number',
  EMAIL = 'email',
  DATE = 'date',
  FILE = 'file',
  SIGNATURE = 'signature',
  SECTION = 'section',
  PAGE_BREAK = 'page_break',
  CALCULATION = 'calculation',
  QUIZ = 'quiz',
  POLL = 'poll',
  SURVEY = 'survey',
  PRODUCT = 'product'
}

export type ConditionOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'greater_than' 
  | 'less_than'
  | 'starts_with'
  | 'ends_with';

export interface Condition {
  fieldId: string;
  operator: ConditionOperator;
  value: string | number;
}

export interface ConditionalLogic {
  action: 'show' | 'hide';
  scope: 'all' | 'any';
  rules: Condition[];
}

export interface Choice {
  id: string;
  text: string;
  value: string;
  price?: number;
  isSelected?: boolean;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  choices?: Choice[];
  width: '1/4' | '1/2' | '3/4' | '1/1';
  conditionalLogic?: ConditionalLogic;
  defaultValue?: string;
  conditionalDefaultValue?: string;
  formula?: string; // For calculations
  adminLabel?: string;
  cssClass?: string;
  multipleFiles?: boolean;
}

export interface FormPage {
  id: string;
  title: string;
  fields: FormField[];
}

export interface PdfConfig {
  headerText?: string;
  footerText?: string;
  showLogo?: boolean;
  logoUrl?: string;
  includeSubmissionDate?: boolean;
  paperSize?: 'a4' | 'letter';
}

export interface FormConfig {
  id: string;
  title: string;
  description: string;
  pages: FormPage[];
  customCss?: string;
  submitButtonText: string;
  confirmMessage: string;
  pdfConfig?: PdfConfig;
}

export interface FormEntry {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
  ip: string;
  userAgent: string;
}
