const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/ambulance', require('./routes/ambulanceRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));


// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a specific request room
    socket.on('join_request', (requestId) => {
        socket.join(requestId);
        console.log(`Socket joined room: ${requestId}`);
    });

    // Update driver location
    socket.on('update_location', (data) => {
        const { requestId, lat, lng } = data;
        // Broadcast to people in the same room (patient)
        io.to(requestId).emit('location_update', { lat, lng });
    });

    // Patient shares their live location
    socket.on('share_patient_location', (data) => {
        const { requestId, coords } = data;
        io.to(requestId).emit('patient_location_update', coords);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
