---
outline: deep
createDate: 2026-10-20
lastUpdated: 2026-10-30
---

# DigitalPlat 免费域名避坑

## 可选域名后缀

DigitalPlat 虽然提供了五个可选域名后缀，但开放注册的只有 “.dpdns.org”、“.qzz.io”、“.qd.je”。

![后缀选择](/images/freedomain/register-digitalplat-free-domain/select.png)

## 委派 Cloudflare 解析 DNS

如需将 DNS 委派给 Cloudflare，请勿选择 “.qd.je”，因为 Cloudflare 无法添加 “.qd.je” 后缀的域名。

而 “.dpdns.org”、“.qzz.io” 则可以正常添加到 Cloudflare。

### ❌ 勿选择 “.qd.je”

无法通过校验。

![校验失败](/images/pitfalls/digitalplat-domains-select/noapproved.png)

### ✅ “.dpdns.org”、“.qzz.io”

添加成功后，会出现在 Cloudflare 的域名列表中。接着就能添加 Vercel 项目的 DNS 记录了。

![校验成功](/images/pitfalls/digitalplat-domains-select/approved.png)

## 域名删除的冷却期

如果希望更改域名，则只能删除域名后重新注册，但域名的删除需要等待 7 天冷却期后，才开放注册。

删除期间，无法进行任何域名操作，包括取消删除。

![删除域名](/images/pitfalls/digitalplat-domains-select/delete.png)
