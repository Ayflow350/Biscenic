// components/ui/form-field.tsx
"use client";

import React from "react";
import {
  Controller,
  Control,
  FieldValues,
  Path,
  ControllerRenderProps,
} from "react-hook-form";

type FormFieldProps<
  TFormValues extends FieldValues,
  TName extends Path<TFormValues>
> = {
  control: Control<TFormValues>;
  name: TName;
  render: (props: {
    field: ControllerRenderProps<TFormValues, TName>;
  }) => React.ReactNode;
};

export function FormField<
  TFormValues extends FieldValues,
  TName extends Path<TFormValues>
>({ control, name, render }: FormFieldProps<TFormValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <>{render({ field })}</>}
    />
  );
}
