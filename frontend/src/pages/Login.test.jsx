import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';
import * as toast from '../services/toast';

// Mock the services
vi.mock('../services/api', () => ({
  authAPI: {
    login: vi.fn(),
  },
  storeUserData: vi.fn(),
}));

vi.mock('../services/toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Helper to render component with necessary providers
const renderLogin = (contextValue = {}) => {
  const defaultContextValue = {
    user: null,
    loggedIn: false,
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
    ...contextValue,
  };

  return render(
    <BrowserRouter>
      <AuthContext.Provider value={defaultContextValue}>
        <Login />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // Test 1: Component renders correctly
  it('should render the login form with email and password inputs', () => {
    renderLogin();

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText('Track your academic progress')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  // Test 2: Show/Hide password toggle works
  it('should toggle password visibility when Show/Hide button is clicked', async () => {
    renderLogin();

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const toggleButton = screen.getByRole('button', { name: /show/i });

    // Initially password should be hidden
    expect(passwordInput.type).toBe('password');

    // Click to show password
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(passwordInput.type).toBe('text');
      expect(screen.getByRole('button', { name: /hide/i })).toBeInTheDocument();
    });

    // Click to hide password again
    const hideButton = screen.getByRole('button', { name: /hide/i });
    fireEvent.click(hideButton);
    await waitFor(() => {
      expect(passwordInput.type).toBe('password');
    });
  });

  // Test 3: Form submission with valid credentials
  it('should successfully login with valid credentials', async () => {
    const mockLogin = vi.fn();
    const mockUserData = {
      id: '123',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      role: 'user',
    };

    api.authAPI.login.mockResolvedValue({
      success: true,
      data: {
        token: 'fake-token',
        user: mockUserData,
      },
    });

    renderLogin({ login: mockLogin });

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Fill in the form
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for the login to be called
    await waitFor(() => {
      expect(api.authAPI.login).toHaveBeenCalledWith('john@example.com', 'password123');
    });

    // Verify storeUserData was called
    await waitFor(() => {
      expect(api.storeUserData).toHaveBeenCalledWith('fake-token', mockUserData);
    });

    // Verify context login was called
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('fake-token', mockUserData);
    });

    // Verify success toast was shown
    await waitFor(() => {
      expect(toast.toast.success).toHaveBeenCalledWith('Login successful!');
    });
  });

  // Test 4: Form submission with invalid credentials
  it('should display error message with invalid credentials', async () => {
    api.authAPI.login.mockResolvedValue({
      success: false,
      error: 'Invalid email or password',
    });

    renderLogin();

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Fill in the form with wrong credentials
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });

    // Verify error toast was shown
    await waitFor(() => {
      expect(toast.toast.error).toHaveBeenCalledWith('Invalid email or password');
    });
  });

  // Test 5: Loading state during submission
  it('should show loading state while submitting the form', async () => {
    api.authAPI.login.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        success: true,
        data: { token: 'fake-token', user: {} },
      }), 100))
    );

    renderLogin();

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Fill in the form
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Initially button should not be disabled
    expect(submitButton.disabled).toBe(false);

    // Submit the form
    fireEvent.click(submitButton);

    // Button should immediately show loading state
    expect(submitButton.disabled).toBe(true);
    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
  });

  // Test 6: Email and password inputs are required
  it('should have required attributes on email and password inputs', () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    expect(emailInput.required).toBe(true);
    expect(passwordInput.required).toBe(true);
  });

  // Test 7: Navigation link to Sign Up page
  it('should have a link to the Sign Up page', () => {
    renderLogin();

    const signUpLink = screen.getByRole('button', { name: /sign up/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveClass('auth-link');
  });

  // Test 8: Form should clear error when user starts typing
  it('should clear error message when user types in the form', async () => {
    api.authAPI.login.mockResolvedValue({
      success: false,
      error: 'Invalid credentials',
    });

    renderLogin();

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Submit with invalid credentials
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    // User types in password field and error should clear
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });

    await waitFor(() => {
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });

  // Test 9: Prevent form submission with empty fields
  it('should not allow form submission with empty fields', () => {
    renderLogin();

    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Email and password inputs should have required attribute
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    // Browser should prevent submission
    fireEvent.click(submitButton);

    // API should not be called
    expect(api.authAPI.login).not.toHaveBeenCalled();
  });

  // Test 10: Handle network error during login
  it('should handle network errors gracefully', async () => {
    api.authAPI.login.mockResolvedValue({
      success: false,
      error: 'Connection error. Please try again later.',
    });

    renderLogin();

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Connection error. Please try again later.')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(toast.toast.error).toHaveBeenCalledWith('Connection error. Please try again later.');
    });
  });

  // Test 11: Input values update correctly
  it('should update input values when user types', () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('testpass123');
  });

  // Test 12: Form elements have correct structure
  it('should have correct form structure with proper labels', () => {
    renderLogin();

    const emailLabel = screen.getByText('Email');
    const passwordLabel = screen.getByText('Password');

    expect(emailLabel).toBeInTheDocument();
    expect(passwordLabel).toBeInTheDocument();
    expect(emailLabel.classList.contains('form-label')).toBe(true);
    expect(passwordLabel.classList.contains('form-label')).toBe(true);
  });
});
