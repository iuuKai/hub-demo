---
outline: deep
---

# 使用 DigitalPlat One 注册免费域名

> 点击注册：https://dashboard.digitalplat.org/

一个账户只能注册一个免费域名。

## 注册账户

DigitalPlat One 平台支持谷歌账号、GitHub 授权注册，或者使用邮箱注册。

::: warning 提醒：
最好是 GitHub 授权注册，因为免费域名申请也需要 GitHub 授权认证。
:::

以下特殊表单项仅供参考：

- 用户名：需要留意，后面无法修改。
- 姓名：虽然提示填写真实姓名，但你也可以随便写，例如 "san zhang"（张三），全名需要空格隔开。
- 电话：选 "中国(+86)"，并填写你的真实手机号，用于接收验证码。
- 国家/地区：选 "中国"。
- 街道地址：随便写，例如 "beijing"。
- 城市：随便写，例如 "beijing"。
- 州/省：随便写，例如 "beijing"。
- 邮政编码：随便写，例如 "100000"。

![注册表单](/images/freedomain/register-digitalplat-free-domain/register.png)

填完后，等待 Cloudflare 验证通过，然后点击 “注册” 按钮，系统会向你的邮箱发送验证码，输入验证码完成注册。

![邮箱代码](/images/freedomain/register-digitalplat-free-domain/email.png)

![代码验证](/images/freedomain/register-digitalplat-free-domain/code.png)

## 创建免费域名

登录后，在侧边栏找到并访问 “域名/域名列表”，然后点击 “添加域名” 下拉按钮，选择第一个 “创建 DigitalPlat 域名”。

![添加域名](/images/freedomain/register-digitalplat-free-domain/add.png)

跳转到域名选择页面。

![后缀选择](/images/freedomain/register-digitalplat-free-domain/select.png)

选择你想要的域名后缀，例如 ".qd.je"，输入你的域名。

::: warning 提醒：
推荐选择 “.dpdns.org”、“.qzz.io”。

开放注册的只有 “.dpdns.org”、“.qzz.io”、“.qd.je” 后缀，但 “.qd.je” 无法添加到 Cloudflare。

删除重新注册有 7 天冷却期。
:::

![输入域名](/images/freedomain/register-digitalplat-free-domain/input.png)

点击 “检查可用性”，如果域名可用则会弹出提示框。

“委派模式” 选 “稍后配置”，先注册域名，不添加 DNS 委派。

接着点击 “注册” 按钮。

![检查可用性](/images/freedomain/register-digitalplat-free-domain/check.png)

如果还没使用 GitHub 授权认证，系统会提示需要授权认证。

![账户认证](/images/freedomain/register-digitalplat-free-domain/verify.png)

通过 GitHub 授权认证后，域名就注册成功了。

## 配置 DNS 委派

域名注册成功后将跳转至域名管理页面。

或者通过侧边栏找到并访问 “域名/域名列表”，点击对应域名条目打开页面。

![配置 DNS 委派](/images/freedomain/register-digitalplat-free-domain/config.png)

你可以选择使用 DigitalPlat 自带 DNS 来管理解析记录，也可以修改为 Cloudflare 的名称服务器，将域名 DNS 委派至 Cloudflare。

### DigitalPlat DNS

点击 “使用 DigitalPlat DNS” 按钮。

![DigitalPlat DNS 按钮](/images/freedomain/register-digitalplat-free-domain/dnsbtn.png)

启用后，域名 DNS 就会指向 DigitalPlat 自带 DNS 服务器。

![DigitalPlat DNS](/images/freedomain/register-digitalplat-free-domain/selfdns.png)

然后点击 “添加记录” 把 Vercel 项目提供的 DNS 解析记录添加即可完成域名绑定与 DNS 解析。
