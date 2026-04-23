```shell
开发一个tinymce插件，提供预览功能，预览功能要求必须支持手机预览，也可以提供pc预览等，支持vue
更改为npm可以安装的版本，增加claude.md文件

nvm use v22.15.0
claude
/init
CLAUDE.md改写为中文
将tinymce插件更改为npm可以安装的版本
Module not found: Error: Can't resolve 'tinymce-plugin-multipreview'

npm install -g @qwen-code/qwen-code@latest
qwen
/auth
qwen --resume cef5cb56-f5b5-48d8-9f72-b61f0c15ac53

npm adduser
npm login
npm publish

npm i tinymce-plugin-multipreview

npm install
npm run build
npm publish

# 登录 npm 网站，进入令牌管理
# 访问：https://www.npmjs.com/settings/你的用户名/tokens

# 或使用 CLI（需要 npm v10+）
npm token create --type automation --read-only false

# 一次性使用（仅本次终端会话有效）
npm config set //registry.npmjs.org/:_authToken=你的令牌字符串

# 或永久保存到项目（推荐）
echo "//registry.npmjs.org/:_authToken=你的令牌字符串" >> .npmrc

npm publish --dry-run  # 先试运行
npm publish            # 实际发布
```