// TinymcePreviewEditor Vue Components
// Support for both Vue 2 and Vue 3

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./vue2.prod.js')
} else {
  module.exports = require('./vue2.js')
}
