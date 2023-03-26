import { render } from '@testing-library/react';

import App from '../renderer/App';

import '@testing-library/jest-dom';

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
