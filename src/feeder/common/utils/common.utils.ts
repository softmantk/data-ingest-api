export const getSystemUsage = (startTime: Date) => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  const FRACTIONS = 2;
  return JSON.stringify({
    runningTime: `${Math.round((new Date().getTime() - startTime.getTime()) / 1000)} sec`,
    memory: {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(FRACTIONS)} MB`,
      heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(FRACTIONS)} MB`,
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(FRACTIONS)} MB`,
      // external: `${(memoryUsage.external / 1024 / 1024).toFixed(FRACTIONS)}`,
    },
    // cpu: {
    //   user: `${(cpuUsage.user / 1000).toFixed(FRACTIONS)} ms`,
    //   system: `${(cpuUsage.system / 1000).toFixed(FRACTIONS)} ms`,
    // },
  });
};
