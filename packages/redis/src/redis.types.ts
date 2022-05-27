import { ReplyError } from 'redis';

export interface ExecError extends ReplyError {
  errors: [
    {
      command: string;
      args: string[];
      code: string;
      position: number;
    }
  ];
}

export type GetAndSetFn<T> = (composition: T | undefined) => T | undefined;
export type GetAndSetConditionFn<T> = (composition: T | undefined) => boolean;
export type GetAndSetFnType<T> = {
  hasConditionPassed: boolean;
  results: string[] | null;
  value: T | undefined;
};
export type GetAndSetFnReturnValue<T> = Promise<GetAndSetFnType<T>>;

export type PushDirection = 'right' | 'left';
