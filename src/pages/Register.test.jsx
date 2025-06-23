import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Register from './Register';
import { useTheme } from '../contexts/ThemeContext';

// Mock the theme context
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: vi.fn()
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    label: ({ children, ...props }) => <label {...props}>{children}</label>,
    input: ({ children, ...props }) => <input {...props}>{children}</input>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>
  }
}));

// Mock fetch globally
global.fetch = vi.fn();

// Wrapper component to provide router context
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('Register Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock theme context default values
    useTheme.mockReturnValue({
      darkMode: false,
      toggleDarkMode: vi.fn()
    });
  });

  // Test 1: Component renders correctly with all form fields
  test('renders register form with all required fields', () => {
    render(
      <TestWrapper>
        <Register />
      </TestWrapper>
    );

    // Check if all form elements are present
    expect(screen.getByText('Create your SoloFlow Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Company Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
  });

  // Test 2: Password validation works correctly
  test('password validation shows correct indicators', async () => {
    render(
      <TestWrapper>
        <Register />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText('Password');
    
    // Focus on password field to trigger validation display
    fireEvent.focus(passwordInput);
    
    // Test with weak password
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    
    await waitFor(() => {
      expect(screen.getByText('✘ At least 8 characters')).toBeInTheDocument();
      expect(screen.getByText('✘ At least one uppercase letter')).toBeInTheDocument();
      expect(screen.getByText('✘ At least one number')).toBeInTheDocument();
      expect(screen.getByText('✘ At least one special character')).toBeInTheDocument();
    });

    // Test with strong password
    fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } });
    
    await waitFor(() => {
      expect(screen.getByText('✔ At least 8 characters')).toBeInTheDocument();
      expect(screen.getByText('✔ At least one uppercase letter')).toBeInTheDocument();
      expect(screen.getByText('✔ At least one lowercase letter')).toBeInTheDocument();
      expect(screen.getByText('✔ At least one number')).toBeInTheDocument();
      expect(screen.getByText('✔ At least one special character')).toBeInTheDocument();
    });
  });

  // Test 3: Password visibility toggle works
  test('password visibility toggle works correctly', () => {
    render(
      <TestWrapper>
        <Register />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByAltText('Toggle Password');

    // Initially password should be hidden
    expect(passwordInput.type).toBe('password');

    // Click toggle button to show password
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');

    // Click again to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  // Test 4: Successful form submission
  test('successful registration redirects to login page', async () => {
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      status: 201,
      json: async () => ({ message: 'Registration successful' })
    });

    render(
      <TestWrapper>
        <Register />
      </TestWrapper>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'StrongPass123!' }
    });
    fireEvent.change(screen.getByLabelText('Company Name'), {
      target: { value: 'Test Company' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    // Wait for API call and navigation
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          user_name: 'John Doe',
          user_email: 'john@example.com',
          user_password: 'StrongPass123!',
          user_company: 'Test Company'
        })
      });
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  // Test 5: Dark mode toggle functionality
  test('dark mode toggle changes theme', () => {
    const mockToggleDarkMode = vi.fn();
    
    // Mock dark mode as true
    useTheme.mockReturnValue({
      darkMode: true,
      toggleDarkMode: mockToggleDarkMode
    });

    render(
      <TestWrapper>
        <Register />
      </TestWrapper>
    );

    const toggleButton = screen.getByLabelText('Toggle dark mode');
    
    // Click the dark mode toggle
    fireEvent.click(toggleButton);
    
    // Verify the toggle function was called
    expect(mockToggleDarkMode).toHaveBeenCalledTimes(1);
  });
});