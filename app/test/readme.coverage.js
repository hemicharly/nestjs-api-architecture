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

const generateBadges = (coverageData) => {
  const { total, ...files } = coverageData;

  const generateBadgeForCategory = (category, patterns, outputPath) => {
    const metrics = calculateCategoryMetrics(files, patterns);
    const format = {
      label: category,
      message: `${metrics.statements.pct.toFixed(2)}%`,
      color: metrics.statements.pct > 80 ? 'green' : metrics.statements.pct > 50 ? 'yellow' : 'red'
    };
    const badge = makeBadge(format);
    writeFileSync(outputPath, badge);
  };

  generateBadgeForCategory('Entrypoints', categories.Entrypoints, path.join(badgesDir, 'entrypoints.svg'));
  generateBadgeForCategory('Core', categories.Core, path.join(badgesDir, 'core.svg'));
  generateBadgeForCategory('Infrastructure', categories.Infrastructure, path.join(badgesDir, 'infrastructure.svg'));
  generateBadgeForCategory('Shared', categories.Shared, path.join(badgesDir, 'shared.svg'));
};


const coverageData = JSON.parse(readFileSync(coverageDataPath, 'utf8'));

generateBadges(coverageData);

console.log('Badges generated and saved to', badgesDir);
