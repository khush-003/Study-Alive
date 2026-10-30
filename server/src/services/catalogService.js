import * as catalogModel from '../models/catalogModel.js';
import ApiError from '../utils/ApiError.js';

const validResourceTypes = new Set(['notes', 'videos', 'practice', 'books']);
const validUpdateCategories = new Set(['exams', 'admissions', 'scholarships', 'events', 'reports']);
const updateLabels = {
  exams: 'Exams',
  admissions: 'Admissions',
  scholarships: 'Scholarships',
  events: 'Events',
  reports: 'Industry Report',
};

// Keep list filters small and consistent before querying the catalog tables.
export function getCareers(search = '') {
  return catalogModel.listCareers(search.trim());
}

// Return a career or a clear not-found error for invalid identifiers.
export async function getCareer(id) {
  const career = await catalogModel.findCareer(id);
  if (!career) throw new ApiError(404, 'Career was not found.');
  return career;
}

// Reject unsupported resource types rather than silently returning an empty list.
export function getStudyMaterials({ subject = '', type = '' }) {
  if (type && !validResourceTypes.has(type)) {
    throw new ApiError(400, 'Unsupported study resource type.');
  }
  return catalogModel.listStudyMaterials({ subject: subject.trim(), type });
}

// Search peers across their public name and skill fields.
export function getPeers(search = '') {
  return catalogModel.listPeers(search.trim());
}

// List scheduled learning sessions from the catalog.
export function getSessions() {
  return catalogModel.listSessions();
}

// Accept the supported news categories from the Updates filters.
export async function getUpdates(category = '') {
  if (category && !validUpdateCategories.has(category)) {
    throw new ApiError(400, 'Unsupported update category.');
  }
  const updates = await catalogModel.listUpdates(category);
  return updates.map((update) => ({ ...update, label: updateLabels[update.category] }));
}
