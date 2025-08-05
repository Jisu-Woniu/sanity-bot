# 飞书 × 明日方舟理智小助手

一款基于飞书自定义机器人的明日方舟理智小助手，可以在指定时间提醒群友使用理智药水。

支持任何群组（包括外部群组使用）。

## 使用方法

1. 将本程序部署至 [Cloudflare Workers](https://workers.cloudflare.com)。

   [![部署到 Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Jisu-Woniu/sanity-bot)

   > 您也可以使用其他云服务部署，但是可能需要根据平台文档修改相关代码。

2. 在飞书群中创建自定义机器人。

   - 进入群设置，选择“群机器人”
   - 点击“添加机器人”，选择“自定义机器人”
   - 设置头像、名称、描述等信息
   - 记录生成的 Webhook 地址
   - 安全设置中选择“自定义关键词”，输入机器人消息关键词（如“理智”）
   - （暂不支持）勾选“签名校验”，并记录签名密钥

3. 在 Cloudflare Workers 中配置环境变量。

   - 进入 Workers 仪表盘，选择您的 Worker
   - 选择“设置 > 变量和机密 > 添加”，类型选择“密钥”
   - 需要配置的密钥如下：
     - `WEBHOOK_URL`：飞书自定义机器人的 Webhook 地址
     - `SECRET`：（可选）如果启用了签名校验，设置为飞书机器人的签名密钥

   > 你可将环境变量保存在 `.dev.vars` 文件中，格式为 `KEY=VALUE`，以便本地调试

4. 根据需要修改 Cloudflare Workers 中的配置。主要包括：

   - 触发事件 > Cron 触发器：设置定时任务的执行频率，注意表达式是 UTC 时间，默认为每周六、周日的 12:30，即北京时间每周六、周日的 20:30
   - 变量和机密 > 添加：设置消息模板 ID 和版本（可选），默认模板文件可在 [template.json](./template.json) 中找到

## 后续开发计划

- [x] 支持发送卡片消息
- [x] 自定义消息模板（作为广义的定时消息机器人）
  - [ ] 支持自定义模板变量（要不您还是 fork 一份自己改吧）
- [ ] 修复签名算法问题
