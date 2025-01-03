const { writeFileSync, readFileSync } = require('fs');
const path = require('path');
const { makeBadge } = require('badge-maker');

const coverageDataPath = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');
const badgesDir = path.join(__dirname, 'badges');

const categories = {
  Entrypoints: ['/src/entrypoints/', '/src/entrypoints/web/', '/src/consumers/'],
  Core: ['/src/core/', '/src/core/domain/', '/src/core/providers/', '/src/core/usecases/'],
  Infrastructure: ['/src/infrastructure/', '/src/infrastructure/config-env/', '/src/infrastructure/integrations/', '/src/infrastructure/queue/', '/src/infrastructure/repositories/'],
  Shared: ['/src/shared/', '/src/shared/audit', '/src/shared/config']
};

/**
 * Loads the coverage data from a JSON file.
 * @returns {Object} The coverage data object.
 * @throws {Error} If there is an error reading or parsing the file.
 */
const loadCoverageData = () => {
  try {
    return JSON.parse(readFileSync(coverageDataPath, 'utf8'));
  } catch (error) {
    console.error('Error reading or parsing the coverage file:', error);
    process.exit(1);
  }
};

/**
 * Calculates the coverage metrics for a category of files based on the provided data.
 * @param {Object} files The coverage data object for each file.
 * @param {string[]} patterns An array of path patterns for files that belong to a category.
 * @returns {Object} The total metrics (lines, statements, functions, branches) with coverage percentages.
 */
const calculateCategoryMetrics = (files, patterns) => {
  let totalMetrics = {
    lines: { total: 0, covered: 0, skipped: 0, pct: 0 },
    statements: { total: 0, covered: 0, skipped: 0, pct: 0 },
    functions: { total: 0, covered: 0, skipped: 0, pct: 0 },
    branches: { total: 0, covered: 0, skipped: 0, pct: 0 }
  };

  for (const [filePath, data] of Object.entries(files)) {
    if (patterns.some((pattern) => filePath.includes(pattern))) {
      totalMetrics.lines.total += data.lines.total;
      totalMetrics.lines.covered += data.lines.covered;
      totalMetrics.lines.skipped += data.lines.skipped;

      totalMetrics.statements.total += data.statements.total;
      totalMetrics.statements.covered += data.statements.covered;
      totalMetrics.statements.skipped += data.statements.skipped;

      totalMetrics.functions.total += data.functions.total;
      totalMetrics.functions.covered += data.functions.covered;
      totalMetrics.functions.skipped += data.functions.skipped;

      totalMetrics.branches.total += data.branches.total;
      totalMetrics.branches.covered += data.branches.covered;
      totalMetrics.branches.skipped += data.branches.skipped;
    }
  }

  totalMetrics.lines.pct = (totalMetrics.lines.covered / totalMetrics.lines.total) * 100 || 0;
  totalMetrics.statements.pct = (totalMetrics.statements.covered / totalMetrics.statements.total) * 100 || 0;
  totalMetrics.functions.pct = (totalMetrics.functions.covered / totalMetrics.functions.total) * 100 || 0;
  totalMetrics.branches.pct = (totalMetrics.branches.covered / totalMetrics.branches.total) * 100 || 0;

  return totalMetrics;
};

/**
 * Generates coverage badges for the specified categories and saves the SVG files.
 * @param {Object} coverageData The coverage data object.
 * @throws {Error} If there is an error saving a badge file.
 */
const generateBadges = (coverageData) => {
  const { total, ...files } = coverageData;

  /**
   * Generates a badge for a specific category based on the coverage metrics.
   * @param {string} category The name of the category (e.g., 'Entrypoints', 'Core').
   * @param {string[]} patterns The file path patterns for the category files.
   * @param {string} outputPath The path where the badge SVG file will be saved.
   */
  const generateBadgeForCategory = (category, patterns, outputPath) => {
    const metrics = calculateCategoryMetrics(files, patterns);

    const format = {
      label: category,
      message: `${metrics.statements.pct.toFixed(2)}%`, // Using the statements coverage percentage
      color: metrics.statements.pct > 80 ? 'green' : metrics.statements.pct > 50 ? 'yellow' : 'red'
    };

    const badge = makeBadge(format);

    try {
      writeFileSync(outputPath, badge);
    } catch (error) {
      console.error(`Error saving the badge for category ${category}:`, error);
    }
  };

  // Generate badges for each category
  Object.entries(categories).forEach(([category, patterns]) => {
    const outputPath = path.join(badgesDir, `${category.toLowerCase()}.svg`);
    generateBadgeForCategory(category, patterns, outputPath);
  });
};

// Load the coverage data and generate badges
const coverageData = loadCoverageData();
generateBadges(coverageData);

console.log('Badges generated and saved to', badgesDir);