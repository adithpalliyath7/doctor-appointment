const testBooking = async () => {
    try {
        // Register patient
        const email = `patient_${Date.now()}@example.com`;
        const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Patient',
                email: email,
                password: 'password123',
                role: 'patient'
            })
        });
        const regData = await regRes.json();
        console.log('Register Result:', regData);

        // Verify patient - we can't easily because OTP is emailed. Wait, in backend, isVerified: false but maybe we don't check for isVerified in login? 
        // Oh wait, bookAppointment might just need login. Let's force OTP verify.
        const verifyRes = await fetch('http://localhost:5000/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, otp: regData.debugOTP })
        });
        const loginData = await verifyRes.json();
        console.log('Verify Result:', loginData);

        if (!loginData.token) {
            console.log('No token');
            return;
        }

        const docRes = await fetch('http://localhost:5000/api/doctors');
        const docData = await docRes.json();
        const firstDoc = docData[0];
        console.log('First Doctor ID:', firstDoc._id);

        const bookRes = await fetch('http://localhost:5000/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}`
            },
            body: JSON.stringify({
                doctorId: firstDoc._id,
                date: '2023-12-01',
                time: '10:00 AM'
            })
        });
        const bookData = await bookRes.json();

        console.log('Book Result:', bookData);
        if (!bookRes.ok) {
            console.log('Failed Status:', bookRes.status);
        }
    } catch (e) {
        console.error(e);
    }
};

testBooking();
