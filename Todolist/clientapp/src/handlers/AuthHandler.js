export const loginUser = async (credentials) => {
    try {
        console.log('Login credentials:', credentials);
        const response = await fetch('http://localhost:5121/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || 'Innlogging mislyktes');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);

        return data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error; 
    }
};



export const registerUser = async (credentials) => {
    try {
        const response = await fetch('http://localhost:5121/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: credentials.username,
                email: credentials.email,
                password: credentials.password
            })
        });

        const responseData = await response.text();

        if (!response.ok) {
            throw new Error(responseData);
        }

        return JSON.parse(responseData);
    } catch (error) {
        console.error('Registreringsfeil:', error);
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token'); // Fjern token ved utlogging
};