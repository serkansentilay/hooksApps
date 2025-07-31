module.exports = {
  root: true,
  extends: ['@react-native',
    "plugin:react-hooks/recommended-legacy"
  ],
  "plugins": [
 
    "react-hooks"
  ],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
};
