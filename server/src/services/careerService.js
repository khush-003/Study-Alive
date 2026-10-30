import * as careerModel from '../models/careerModel.js';
import ApiError from '../utils/ApiError.js';

const MAX_LIMIT = 100;
const TRENDING_SLUGS = ['cs', 'medical', 'design', 'business'];

// List career profiles with bounded result counts and optional name/skills search.
export function getCareers({ query = '', limit = 50 } = {}) {
  return careerModel.listCareers({ query: query.trim(), limit: Math.min(limit, MAX_LIMIT) });
}

// Find one complete profile or return a not-found response.
export async function getCareer(slug) {
  const career = await careerModel.findCareerBySlug(slug);
  if (!career) throw new ApiError(404, 'Career was not found.');
  return career;
}

// Load both comparison profiles together and identify either missing slug clearly.
export async function compareCareers(slugA, slugB) {
  const [careerA, careerB] = await Promise.all([
    careerModel.findCareerBySlug(slugA),
    careerModel.findCareerBySlug(slugB),
  ]);
  if (!careerA || !careerB) throw new ApiError(404, 'One or both careers were not found.');
  return { careerA, careerB };
}

// Preserve the Home page's curated trending order and return full career objects.
export function getTrendingCareers() {
  return careerModel.listTrendingCareers(TRENDING_SLUGS);
}

// Save a career for the authenticated student and return its complete profile.
export async function saveCareer(userId, slug) {
  const career = await careerModel.findCareerBySlug(slug);
  if (!career) throw new ApiError(404, 'Career was not found.');
  const careerId = await careerModel.findCareerDatabaseId(slug);
  await careerModel.insertSavedCareer(userId, careerId);
  return career;
}

// Remove a career from the student's saved list after confirming it exists.
export async function unsaveCareer(userId, slug) {
  const careerId = await careerModel.findCareerDatabaseId(slug);
  if (careerId === null) throw new ApiError(404, 'Career was not found.');
  await careerModel.deleteSavedCareer(userId, careerId);
}

// Return all complete career profiles saved by the authenticated student.
export function getSavedCareers(userId) {
  return careerModel.listSavedCareers(userId);
}
