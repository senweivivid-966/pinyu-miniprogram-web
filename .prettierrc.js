module.exports = {
  // 基础格式化配置
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'none',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  
  // 小程序特定配置
  overrides: [
    {
      files: '*.wxml',
      options: {
        parser: 'html',
        printWidth: 120,
        htmlWhitespaceSensitivity: 'ignore'
      }
    },
    {
      files: '*.wxss',
      options: {
        parser: 'css',
        printWidth: 100
      }
    },
    {
      files: '*.wxs',
      options: {
        parser: 'babel',
        semi: false,
        singleQuote: true
      }
    },
    {
      files: ['*.js', '*.json'],
      options: {
        parser: 'babel',
        semi: false,
        singleQuote: true
      }
    }
  ]
};