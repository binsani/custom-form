
import React from 'react';
import { 
  Type, 
  AlignLeft, 
  ChevronDown, 
  CircleDot, 
  CheckSquare, 
  Hash, 
  Mail, 
  Calendar, 
  Upload, 
  PenTool, 
  Layout, 
  Scissors, 
  Calculator, 
  CheckCircle2, 
  BarChart2, 
  MessageSquare, 
  ShoppingCart,
  Layers
} from 'lucide-react';
import { FieldType } from './types';

export const FIELD_CATEGORIES = [
  {
    name: 'Standard Fields',
    fields: [
      { type: FieldType.TEXT, label: 'Single Line Text', icon: <Type size={18} /> },
      { type: FieldType.TEXTAREA, label: 'Paragraph Text', icon: <AlignLeft size={18} /> },
      { type: FieldType.SELECT, label: 'Drop Down', icon: <ChevronDown size={18} /> },
      { type: FieldType.RADIO, label: 'Radio Buttons', icon: <CircleDot size={18} /> },
      { type: FieldType.CHECKBOX, label: 'Checkboxes', icon: <CheckSquare size={18} /> },
      { type: FieldType.NUMBER, label: 'Number', icon: <Hash size={18} /> },
    ]
  },
  {
    name: 'Advanced Fields',
    fields: [
      { type: FieldType.EMAIL, label: 'Email', icon: <Mail size={18} /> },
      { type: FieldType.DATE, label: 'Date', icon: <Calendar size={18} /> },
      { type: FieldType.FILE, label: 'File Upload', icon: <Upload size={18} /> },
      { type: FieldType.SIGNATURE, label: 'Digital Signature', icon: <PenTool size={18} /> },
      { type: FieldType.SECTION, label: 'Section Break', icon: <Layout size={18} /> },
      { type: FieldType.PAGE_BREAK, label: 'Page Break', icon: <Scissors size={18} /> },
      { type: FieldType.CALCULATION, label: 'Calculation', icon: <Calculator size={18} /> },
    ]
  },
  {
    name: 'Specialized Fields',
    fields: [
      { type: FieldType.QUIZ, label: 'Quiz', icon: <CheckCircle2 size={18} /> },
      { type: FieldType.POLL, label: 'Poll', icon: <BarChart2 size={18} /> },
      { type: FieldType.SURVEY, label: 'Survey', icon: <MessageSquare size={18} /> },
      { type: FieldType.PRODUCT, label: 'Product', icon: <ShoppingCart size={18} /> },
      { type: FieldType.NESTED_FORM, label: 'Nested Form', icon: <Layers size={18} /> },
    ]
  }
];

export const WIDTH_OPTIONS = [
  { label: '25%', value: '1/4' },
  { label: '50%', value: '1/2' },
  { label: '75%', value: '3/4' },
  { label: '100%', value: '1/1' },
];
