import { ComponentType, FC } from 'react';

export function withWindow<P>(
  Component: ComponentType<P & { initialData: any }>
) {
  const NamedComponent: FC<P> = (props) => {
    return <Component {...props} initialData={window.initialData} />;
  };

  return NamedComponent;
}
