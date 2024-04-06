
import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';
import User from './models/user.js';


export const protectedRout = (req: Request, res: Response) => {
  // Set CORS headers
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send('Not logged in');
    return "ERROR";
  }

  // Verify JWT token
  let username;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    username = (payload as JwtPayload).username;
  }
  catch (e) {
    res.status(401).send('Invalid token');
    return "ERROR";
  }

  // We are good!
  return username;
};

export async function loginRoute(req: Request, res: Response) {
  const credentials = req.body;
  try {
    await User.validate(credentials);
  }
  catch (e) {
    res.status(400).send('Invalid credentials');
    return;
  }

  let user;

  try {
    user = await axios.get(`https://final-project-users.onrender.com/api/user/${credentials.username}`);
    user = user.data;
  }catch (error) {
    if (error.response) {
      // If the error has a response, it means it's an error response from the server
      const { status, data } = error.response;
      res.status(status).send(data);
    } else {
      // If the error doesn't have a response, it's likely a network error or something similar
      res.status(500).send('Internal server error');
    }
    return;
  }
  if (!user || !await bcrypt.compare(credentials.password, user.password)) {
    res.status(401).send('Invalid credentials');
    return;
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '2d' });

  const secure = process.env.NODE_ENV === 'production';
  res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 2 * 24 * 60 * 60 * 1000 }); // Set the token cookie
  // res.cookie('token', token, { httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 }); // Set the token cookie
  res.status(200).send('Logged in');
}

export async function logoutRoute(req: Request, res: Response) {
  const secure = process.env.NODE_ENV === 'production';
  //res.clearCookie('token', {httpOnly: true, secure: secure, sameSite: 'strict', maxAge: 2 * 24 * 60 * 60 * 1000 }); // Clear the token cookie
  //res.clearCookie('token', {httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 }); // Clear the token cookie
  res.clearCookie('token');
  res.status(200).send('Logged out');
}

export async function signupRoute(req: Request, res: Response) {
  const user = new User(req.body);
  try {
    const error = await user.validate();
  }
  catch (e) {
    res.status(400).send('Invalid credentials');
    return;
  }

  let response;
  try {
    response = await axios.post('https://final-project-users.onrender.com/api/user', req.body);
  }catch (error) {
    if (error.response) {
      // If the error has a response, it means it's an error response from the server
      const { status, data } = error.response;
      res.status(status).send(data);
    } else {
      // If the error doesn't have a response, it's likely a network error or something similar
      res.status(500).send('Internal server error');
    }
    return;
  }

  // Access the response status
  const responseStatus = response.status;
  res.status(responseStatus).send('User created');
}

export async function usernameRoute(req: Request, res: Response) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://final-project-gateway.onrender.com , https://osama-sayah.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send('Not logged in');
    return;
  }

  let username;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    username = (payload as JwtPayload).username;
  }
  catch (e) {
    res.status(401).send('Invalid token');
    return;
  }

  res.status(200).send({username});
}

export async function updateUserPrivileges(req: Request, res: Response, url: string) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://final-project-gateway.onrender.com , https://osama-sayah.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  const username = protectedRout(req,res);
  if(username == "ERROR"){
    res.status(401).send('Invalid token');
    return;
  }

  const modifiedReqBody = {
    loggedUserName: username,
    ...req.body
  };

  const response = await axios.put(url, modifiedReqBody);
  res.status(response.status).send(response.data);
  return;

}

export async function makeReq(req: Request, res: Response, method: string, url: string) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://final-project-gateway.onrender.com , https://osama-sayah.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  const username = protectedRout(req,res);
  if(username == "ERROR"){
    res.status(401).send('Invalid token');
    return;
  }

  let response;
  try {
    switch (method) {
      case 'GET':
        response = await axios.get(url, {data: req.body, headers: {'Content-Type': 'application/json'}});
        res.status(response.status).send(response.data);
        return;
      case 'DELETE':
        response = await axios.delete(url, {data: req.body, headers: {'Content-Type': 'application/json'}});
        res.status(response.status).send(response.data);
        return;
      case 'PUT':
        response = await axios.put(url, req.body);
        res.status(response.status).send(response.data);
        return;
      case 'POST':
        response = await axios.post(url, req.body);
        res.status(response.status).send(response.data);
        return;
      default:
        throw new Error('Invalid HTTP method');
    }
  }catch (error) {
    if (error.response) {
      // If the error has a response, it means it's an error response from the server
      const { status, data } = error.response;
      res.status(status).send(data);
    } else {
      // If the error doesn't have a response, it's likely a network error or something similar
      res.status(500).send('Internal server error');
    }
    return;
  }
}
