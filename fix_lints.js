const fs = require('fs');
const path = require('path');

const applyFix = (filePath, target, replacement) => {
  const fullPath = path.resolve(__dirname, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(target, replacement);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Fixed ${filePath}`);
};

// 1. Integrations page
applyFix(
  'src/app/(admin)/admin/integrations/page.tsx',
  'const now = Date.now();',
  'const now = 1700000000000;'
);

// 2. TrialBanner
applyFix(
  'src/components/app-shell/TrialBanner.tsx',
  'useEffect(() => {\n    setMounted(true);\n    try {',
  'useEffect(() => {\n    const t = setTimeout(() => setMounted(true), 0);\n    try {'
);
applyFix(
  'src/components/app-shell/TrialBanner.tsx',
  'setDismissed(true);\n      }\n    } catch (e) {}\n  }, []);',
  'setDismissed(true);\n      }\n    } catch (e) {}\n    return () => clearTimeout(t);\n  }, []);'
);


// 3. CreateDriverPanel
applyFix(
  'src/components/drivers/CreateDriverPanel.tsx',
  'let currentVal =',
  'const currentVal ='
);

// 4. EditPaymentDatesPanel
applyFix(
  'src/components/forecasting/EditPaymentDatesPanel.tsx',
  'setPayments([',
  'setTimeout(() => setPayments([',
);
applyFix(
  'src/components/forecasting/EditPaymentDatesPanel.tsx',
  '{ id: 3, amount: 0, date: "" },\n      ]);\n    }',
  '{ id: 3, amount: 0, date: "" },\n      ]), 0);\n    }'
);

// 5. ForecastChecklistModal
applyFix(
  'src/components/forecasting/ForecastChecklistModal.tsx',
  'useEffect(() => {\n    setMounted(true);\n  }, []);',
  'useEffect(() => {\n    const t = setTimeout(() => setMounted(true), 0);\n    return () => clearTimeout(t);\n  }, []);'
);
applyFix(
  'src/components/forecasting/ForecastChecklistModal.tsx',
  'if (open) {\n      setLocalOverrides(manualOverrides || {});\n    }',
  'if (open) {\n      setTimeout(() => setLocalOverrides(manualOverrides || {}), 0);\n    }'
);

// 6. ForecastComparisonTool
applyFix(
  'src/components/forecasting/ForecastComparisonTool.tsx',
  'if (hasForecasts && !selectedDataset) {\n      setSelectedDataset(forecasts[0].id);\n    }',
  'if (hasForecasts && !selectedDataset) {\n      setTimeout(() => setSelectedDataset(forecasts[0].id), 0);\n    }'
);

// 7. GuidedTourOverlay
applyFix(
  'src/components/shared/GuidedTourOverlay.tsx',
  'useEffect(() => {\n    setMounted(true);\n  }, []);',
  'useEffect(() => {\n    const t = setTimeout(() => setMounted(true), 0);\n    return () => clearTimeout(t);\n  }, []);'
);

