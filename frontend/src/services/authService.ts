const TOKEN_KEY = "token";

/**
 * Save JWT token after successful login.
 */
export function saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Get the currently stored JWT token.
 */
export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Check whether the user is authenticated.
 */
export function isAuthenticated(): boolean {
    return getToken() !== null;
}

/**
 * Remove JWT token and log the user out.
 */
export function logout(): void {
    localStorage.removeItem(TOKEN_KEY);
}

/**
 * Get Authorization header for API requests.
 */
export function getAuthHeader(): Record<string, string> {

    const token = getToken();

    if (!token) {
        return {};
    }

    return {
        Authorization: `Bearer ${token}`
    };
}