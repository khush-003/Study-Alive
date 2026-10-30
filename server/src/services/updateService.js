import * as updateModel from '../models/updateModel.js';
import ApiError from '../utils/ApiError.js';

const validCategories = new Set(['exams', 'admissions', 'scholarships', 'events', 'reports']);
const categoryLabels = {
  exams: 'Exams',
  admissions: 'Admissions',
  scholarships: 'Scholarships',
  events: 'Events',
  reports: 'Industry Report',
};
const defaultPageSize = 10;
const maximumPageSize = 100;

// Return a validated, paginated list ordered by publication date, newest first.
export async function listUpdates({ category = '', page = 1, limit = defaultPageSize } = {}) {
  if (category && !validCategories.has(category)) {
    throw new ApiError(400, 'Unsupported update category.');
  }
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(maximumPageSize, limit);
  const { rows, total } = await updateModel.listUpdates({
    category,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
  });

  return {
    items: rows.map((update) => ({
      ...update,
      label: categoryLabels[update.category],
    })),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}

// Return one update with the display label expected by the frontend.
export async function getUpdate(id) {
  const update = await updateModel.findUpdateById(id);
  if (!update) throw new ApiError(404, 'Update was not found.');
  return { ...update, label: categoryLabels[update.category] };
}
