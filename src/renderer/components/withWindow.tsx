import { ComponentType, FC } from 'react';

export function withWindow<P extends { initialData: any }>(
  Component: ComponentType<P>
) {
  const NamedComponent: FC<Omit<P, 'initialData'>> = (props) => {
    // @ts-ignore
    return <Component {...props} initialData={window.initialData} />;
  };

  return NamedComponent;
}
