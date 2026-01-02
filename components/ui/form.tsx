import React from "react";
import { FormProvider, useFormContext } from "react-hook-form";

export function Form<T>({ children, methods, onSubmit }: { methods: any; children: React.ReactNode; onSubmit: (data: T) => void | Promise<void> }) {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        {children}
      </form>
    </FormProvider>
  );
}

export function FormField({ name, children }: { name: string; children: React.ReactNode }) {
  return <div className="form-field" data-name={name}>{children}</div>;
}

export function FormError({ name }: { name: string }) {
  try {
    const ctx = useFormContext();
    // If useFormContext returns falsy or throws, we handle it gracefully
    if (!ctx) return null;
    const { formState } = ctx;
    const error = (formState.errors as any)[name];
    if (!error) return null;
    return (
      <p className="text-sm text-red-600 mt-1" role="alert" aria-live="polite">
        {error.message}
      </p>
    );
  } catch (err) {
    // Missing FormProvider - avoid crashing the app and fail gracefully
    // eslint-disable-next-line no-console
    console.warn("FormError used outside FormProvider:", name);
    return null;
  }
}

export default Form;