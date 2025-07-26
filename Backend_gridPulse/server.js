import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
//import attendantRoutes from './routes/attendantroutes.js';
import session from 'express-session';
import powerDataRoutes from './routes/powerdataroutes.js';
import authRoutes from './routes/attendantroutes.js';

//import managerRoutes from './routes/manageroutes.js';
import dotenv from 'dotenv';
import substationRoutes from "./routes/substationroutes.js";



dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));

app.use(express.json());
app.use(express.static('public'));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  }
}));




//app.use('/attendant', attendantRoutes);
app.use('/power', powerDataRoutes);
app.use('/attendant', authRoutes); // ✅ this is what makes /api/auth/signup work
app.use("/substations", substationRoutes);//is se bs hum ek cheez kr re ke substation route bana diye, jise hum is route pe ja ke jese ek substation lyi data niklate the power ka, ab bs use substation id bhej denge taki us substation ka data aje specific

//app.use('/manager', managerRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
