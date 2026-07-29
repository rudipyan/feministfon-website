import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/plugins/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'Feminist Fon İnisiyatifi',
  projectId: 'REPLACE_WITH_PROJECT_ID',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
