export const safeJSONParse = (jsonString): Record<string, any> => {
  try {
    return JSON.parse(jsonString);
  } catch (_) {
    return jsonString;
  }
};

export const getNumberQuery = (query: string) => {
  const matches = [...query.matchAll(/(>=|<=|>|<)?(\d+)/g)];
  const numberQuery: Record<string, any> = {};
  for (const [, operator, value] of matches) {
    const n = +value;
    if (!operator) numberQuery.$eq = n;
    else if (operator === '>') numberQuery.$gt = n;
    else if (operator === '>=') numberQuery.$gte = n;
    else if (operator === '<') numberQuery.$lt = n;
    else if (operator === '<=') numberQuery.$lte = n;
  }
  return numberQuery;
};
