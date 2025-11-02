import { useForm as useReactHookForm, UseFormProps, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

interface UseFormOptions<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
  schema: ZodSchema<T>;
}

export function useForm<T extends FieldValues>({ schema, ...options }: UseFormOptions<T>) {
  return useReactHookForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    ...options
  });
}