import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import IconAndNumber from '../icon&number/Icon&Number';

describe('IconAndNumber component', () => {
    test('renders correctly with a number', () => {
        render(<IconAndNumber src="/test-icon.svg" number={5} />);

        const icon = screen.getByAltText('icono');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('src', '/test-icon.svg');

        const number = screen.getByText('5');
        expect(number).toBeInTheDocument();
    });

    test('renders correctly with a string', () => {
        render(<IconAndNumber src="/test-icon.svg" number="Many" />);

        const icon = screen.getByAltText('icono');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('src', '/test-icon.svg');

        const text = screen.getByText('Many');
        expect(text).toBeInTheDocument();
    });
});
