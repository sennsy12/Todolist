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
        throw error; // Kaster feilen videre slik at den kan håndteres i `LoginPage`
    }
};



export const registerUser = async (credentials) => {
    try {
        const response = await fetch('http://localhost:5121/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) throw new Error('Registrering mislyktes');

        return await response.json();
    } catch (error) {
        console.error('Error registering user:', error);
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token'); // Fjern token ved utlogging
};