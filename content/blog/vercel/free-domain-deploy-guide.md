---
outline: deep
---

# Vercel + 免费域名：部署指南

大家都知道，Vercel 可以用来部署自己的网站，但 Vercel 提供的域名目前在国内直连访问不稳地，经常访问失败，必须通过 VPN 才能访问。而如果希望他人无 VPN 也能访问的话，就需要在 Vercel 项目后台里绑定域名。

## 付费域名 vs 免费域名

付费域名，支持国内ICP备案，并且购买后拥有所有权，在有效期内，平台无法单方面进行回收或者其他操作。

免费域名，通常都是子域名，只有使用权且国内几乎无法备案，平台随时可以回收、关停、删除。申请最大期限一般是 1 年，如果需要再续期，只能按照平台所允许提前续期的时间进行处理，逾期未续期则会被平台回收。

我的项目基本上都是些小工具站、练习和 demo，并没有什么流量和用户，而且基本上都是挂着自己用的或者作为演示，所以使用免费的域名已经足够了。

虽然现在网上能找到很多提供免费域名注册的平台，但是并不是所有免费域名都能在 Vercel 上绑定。

早些年，我在 [Freenom](https://www.freenom.com/) 注册过一些免费域名，但是 Freenom 目前已经停止了免费域名的注册与续期，并且以前的域名也被回收了无法使用。而后，我又找到了两个平台，分别是 [Netlify](https://www.netlify.com/) 和 [DigitalPlat One](https://dashboard.digitalplat.org/)（原 register.us.kg）。

当前项目所使用的域名，就是在 [DigitalPlat One](https://dashboard.digitalplat.org/) 注册的免费域名。本篇文章将介绍如何注册 DigitalPlat One 域名，并在 Vercel 上绑定。

> 注意
>
> - Freenom：注册免费域名不限数量，理论上你可以注册很多个域名为多个 Vercel 项目进行绑定，但如果是不同时期注册，那么后面续期起来会比较麻烦，不做备忘录的话容易遗漏某个域名的续期时间，不过现在已经无法注册了。
> - DigitalPlat、Netlify：一个帐号只能注册一个免费域名，如果你希望在多个 Vercel 项目上使用，最好是用 Monorepo（单仓库） 模式，并且与 vercel.json 的 rewrites 代理配合使用。
