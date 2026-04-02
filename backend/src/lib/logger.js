function formatMeta(meta) {
  if (!meta) return '';
  try {
    return ` ${JSON.stringify(meta)}`;
  } catch {
    return '';
  }
}

function log(level, message, meta) {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${level}] ${message}`;
  if (level === 'ERROR') {
    console.error(`${base}${formatMeta(meta)}`);
    return;
  }
  if (level === 'WARN') {
    console.warn(`${base}${formatMeta(meta)}`);
    return;
  }
  console.log(`${base}${formatMeta(meta)}`);
}

export const logger = {
  info(message, meta) {
    log('INFO', message, meta);
  },
  warn(message, meta) {
    log('WARN', message, meta);
  },
  error(message, meta) {
    log('ERROR', message, meta);
  }
};
