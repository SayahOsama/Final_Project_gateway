
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import {
    loginRoute,
    logoutRoute,
    makeReq,
    signupRoute,
    usernameRoute,
} from './routes.js';

import {
    LOGIN_PATH,
    LOGOUT_PATH,
    SIGNUP_PATH,
    USERNAME_PATH,
} from './const.js';

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ['localhost:5173', 'http://localhost:5173','https://osama-sayah.github.io', '*'], // Allow access from any origin
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}));

//post
app.post(LOGIN_PATH, loginRoute);
app.post(LOGOUT_PATH, logoutRoute);
app.post(SIGNUP_PATH, signupRoute);
app.post('/api/user/orders/:Id', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "POST",`https://final-project-users.onrender.com${url}`);
});
app.post('/api/event/comments/:eventId', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "POST",`https://final-project-events.onrender.com${url}`);
});
app.post('/api/event', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "POST",`https://final-project-events.onrender.com${url}`);
});
app.post('/api/event/date', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "POST",`https://final-project-events.onrender.com${url}`);
});
app.post('/_functions/pay', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "POST",`https://www.cs-wsp.net${url}`);
});
app.post('/_functions/refund', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "POST",`https://www.cs-wsp.net${url}`);

//get
app.get(USERNAME_PATH, usernameRoute);
app.get('/api/user/orders/:Id', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "GET",`https://final-project-users.onrender.com${url}`);
});
app.get('/api/user/:userIdOrName', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "GET",`https://final-project-users.onrender.com${url}`);
});
app.get('/api/event/tickets/price/:eventId', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "GET",`https://final-project-events.onrender.com${url}`);
});
app.get('/api/event/tickets/amount/:eventId', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "GET",`https://final-project-events.onrender.com${url}`);
});
app.get('/api/event/comments/amount/:eventId', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "GET",`https://final-project-events.onrender.com${url}`);
});
app.get('/api/event/comments/:eventId', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "GET",`https://final-project-events.onrender.com${url}`);
});
app.get('/api/event/available', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "GET",`https://final-project-events.onrender.com${url}`);
});
app.get('/api/event/:eventId', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "GET",`https://final-project-events.onrender.com${url}`);
});
app.get('/api/event', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "GET",`https://final-project-events.onrender.com${url}`);
});

//delete
app.delete('/api/user/orders/:Id', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "DELETE",`https://final-project-users.onrender.com${url}`);
});

//put
app.put('/api/event/tickets/:eventId', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "PUT",`https://final-project-events.onrender.com${url}`);
});
app.put('/api/event/:eventId', (req, res) => {
    const url = req.originalUrl;
    makeReq(req, res, "PUT",`https://final-project-events.onrender.com${url}`);
});





app.listen(port, () => {
    console.log(`Server running! port ${port}`);
});
