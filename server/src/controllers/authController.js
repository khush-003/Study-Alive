import * as authService from '../services/authService.js';
import { sendCreated, sendSuccess } from '../utils/responses.js';

// Handle registration and return a bearer token plus the public profile.
export async function register(request, response) {
  const session = await authService.registerStudent(request.body);
  return sendCreated(response, session, 'Your account has been created.');
}

// Handle sign-in without returning any password data.
export async function login(request, response) {
  const session = await authService.loginStudent(request.body);
  return sendSuccess(response, session, 'You are signed in.');
}

// Sign in to one of the fixed, non-production demo profiles.
export async function demoLogin(request, response) {
  const session = await authService.loginDemoStudent(request.body.profile);
  return sendSuccess(response, session, `Signed in as ${session.user.name}.`);
}

// Return the authenticated student's latest profile.
export async function getMe(request, response) {
  const user = await authService.getStudentProfile(request.user.id);
  return sendSuccess(response, user, 'Profile loaded.');
}

// Save profile changes for the authenticated account.
export async function updateMe(request, response) {
  const user = await authService.updateStudentProfile(request.user.id, request.body);
  return sendSuccess(response, user, 'Profile updated.');
}
