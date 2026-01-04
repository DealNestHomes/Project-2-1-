import type { Plugin } from 'vite';

export function h3v2ResolverPlugin(): Plugin {
  return {
    name: 'h3-v2-resolver',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source === 'h3-v2') {
        // Resolve h3-v2 to our vendored version
        return this.resolve('./src/vendor/h3-v2', importer, { skipSelf: true });
      }
      return null;
    },
  };
}
