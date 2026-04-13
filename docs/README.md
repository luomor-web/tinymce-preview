```shell
开发一个tinymce插件，提供预览功能，预览功能要求必须支持手机预览，也可以提供pc预览等，支持vue
更改为npm可以安装的版本，增加claude.md文件

nvm use v22.15.0
claude
/init
CLAUDE.md改写为中文
将tinymce插件更改为npm可以安装的版本

npm adduser
npm login
npm publish

# 一次性使用（仅本次终端会话有效）
npm config set //registry.npmjs.org/:_authToken=你的令牌字符串

# 或永久保存到项目（推荐）
echo "//registry.npmjs.org/:_authToken=你的令牌字符串" >> .npmrc

npm i tinymce-plugin-multipreview
```