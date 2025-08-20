type Logger = (level: "info" | "debug" | "error", ...content: any[]) => void;

const logger: Logger = (level, content) => {
  console[level](content);
};

export const log = import.meta.env.PROD ? () => {} : logger;
