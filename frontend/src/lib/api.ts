const API_URL = 'http://localhost:5000/api';

export interface LoginCredentials {
    email?: string;
    username?: string;
    password: string;
}

export interface AdminLoginCredentials {
    username: string;
    password: string;
}

export interface UserLoginCredentials {
    email: string;
    password: string;
}

export interface BookingData {
    guestName: string;
    email: string;
    phoneNumber: string;
    checkIn: Date;
    checkOut: Date;
    roomType: string;
    numberOfGuests: number;
    totalAmount: number;
    specialRequests?: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
}

export interface User {
    _id: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

class ApiService {
    private token: string | null = null;

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem('token');
        }
        return this.token;
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    private async fetchApi(endpoint: string, options: RequestInit = {}) {
        const token = this.getToken();
        console.log('API Call:', { endpoint, method: options.method || 'GET', hasToken: !!token });
        
        if (token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            };
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('API Error:', { endpoint, status: response.status, error });
                throw new Error(error.message || 'Something went wrong');
            }

            const data = await response.json();
            console.log('API Response:', { endpoint, status: response.status, dataLength: Array.isArray(data) ? data.length : 'object' });
            return data;
        } catch (error) {
            console.error('API Exception:', { endpoint, error });
            throw error;
        }
    }

    // Auth APIs
    async adminLogin(credentials: AdminLoginCredentials): Promise<AuthResponse> {
        const response = await this.fetchApi('/admin/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        this.setToken(response.token);
        return response;
    }

    async userLogin(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await this.fetchApi('/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        this.setToken(response.token);
        return response;
    }

    async userRegister(data: RegisterData): Promise<AuthResponse> {
        const response = await this.fetchApi('/users/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        this.setToken(response.token);
        return response;
    }

    async logout() {
        this.clearToken();
    }

    // Booking APIs
    async createBooking(bookingData: BookingData) {
        return this.fetchApi('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData),
        });
    }

    async getAllBookings() {
        return this.fetchApi('/bookings');
    }

    async getBooking(id: string) {
        return this.fetchApi(`/bookings/${id}`);
    }

    async updateBookingStatus(id: string, status: string) {
        return this.fetchApi(`/bookings/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    async cancelBooking(id: string) {
        return this.fetchApi(`/bookings/${id}/cancel`, {
            method: 'POST',
        });
    }

    async checkAvailability(checkIn: Date, checkOut: Date, roomType: string) {
        const params = new URLSearchParams({
            checkIn: checkIn.toISOString(),
            checkOut: checkOut.toISOString(),
            roomType,
        });
        return this.fetchApi(`/bookings/check-availability?${params}`);
    }

    // User APIs
    async createUser(userData: Partial<User>) {
        return this.fetchApi('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async getUsers() {
        return this.fetchApi('/users');
    }

    async getUser(id: string) {
        return this.fetchApi(`/users/${id}`);
    }

    async updateUser(id: string, userData: Partial<User>) {
        return this.fetchApi(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async deleteUser(id: string) {
        return this.fetchApi(`/users/${id}`, {
            method: 'DELETE',
        });
    }
}

export const api = new ApiService();
