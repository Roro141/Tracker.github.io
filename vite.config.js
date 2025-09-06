// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // For a user/organization site repo named <username>.github.io, base can stay '/'.
  // If this were a project page, you'd set: base: '/<repo-name>/'
})
