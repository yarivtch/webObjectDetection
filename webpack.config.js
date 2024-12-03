module.exports = {
  // ... קונפיגורציה קיימת
  devtool: 'eval-source-map',
  ignoreWarnings: [
    {
      module: /@tensorflow-models\/coco-ssd/,
    }
  ]
}; 