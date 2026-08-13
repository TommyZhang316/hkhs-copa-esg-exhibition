"use client";

import {
  ArrowRight,
  Buildings,
  ChartLineUp,
  CheckCircle,
  Cpu,
  Globe,
  HouseLine,
  Leaf,
  List,
  Play,
  Recycle,
  ShieldCheck,
  Sun,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

type Locale = "zh-hk" | "zh-cn" | "en";
type PillarKey = "homes" | "carbon" | "future";
type StoryMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; alt: string }
  | { type: "graphic"; variant: "solar" | "copa" | "community"; alt: string };

type Pillar = {
  key: PillarKey;
  title: string;
  english: string;
  description: string;
  action: string;
};

type Story = {
  slug: string;
  pillar: PillarKey;
  place: string;
  title: string;
  summary: string;
  detail: string;
  impact: string;
  media: StoryMedia;
};

type Metric = {
  value: string;
  unit: string;
  label: string;
  scope: string;
};

const media = {
  reuseHero: "/media/photos/kll-reuse-hero.jpg",
  reuseDetail: "/media/photos/kll-reuse-detail-1.jpg",
  reusePortrait: "/media/photos/kll-reuse-detail-2.jpg",
  garden: "/media/videos/community-garden.mp4",
  foodWasteKll: "/media/videos/food-waste-kll.mp4",
  foodWasteLtt: "/media/videos/food-waste-ltt.mp4",
};

const content = {
  "zh-hk": {
    htmlLang: "zh-HK",
    nav: {
      home: "首頁",
      pillars: "三大支柱",
      stories: "屋邨行動",
      progress: "進展",
      videos: "影片",
      menu: "開啟選單",
      close: "關閉",
    },
    brand: {
      copa: "物業及資產綜合平台",
      full: "Central Office for Property and Asset",
    },
    hero: {
      eyebrow: "香港房屋協會可持續發展",
      title: "創建宜居．永續共融",
      body: "我們把可持續發展融入房屋、屋邨管理及社區日常，與居民共建更宜居、更低碳的未來。",
      cta: "探索我們的行動",
      secondary: "查看進展",
      caption: "屋邨居民參與物品再生及升級再造活動",
    },
    intro: {
      title: "可持續發展，從一個家延伸至整個社區",
      body: "房屋不只是建築。我們從居民需要、資源使用及未來能力出發，把長遠承諾落實在每個屋邨日常。",
    },
    pillarHeading: "三大支柱，共同支撐宜居未來",
    pillarPrompt: "選擇支柱",
    pillars: [
      {
        key: "homes",
        title: "可持續居所",
        english: "Sustainable Homes",
        description: "回應不同人生階段和社會需要，營造安全、共融並具連繫的居住環境。",
        action: "居所與社區",
      },
      {
        key: "carbon",
        title: "低碳轉型",
        english: "Low-carbon Transformation",
        description: "把節能、減碳、循環資源和氣候韌性融入發展、管理及營運。",
        action: "資源與環境",
      },
      {
        key: "future",
        title: "裝備未來",
        english: "Future-fit Capabilities",
        description: "以人才、安全、數據和創新科技，提升物業及資產的長遠表現。",
        action: "能力與創新",
      },
    ] satisfies Pillar[],
    journey: {
      title: "從建造到日常，每一步都計算長遠價值",
      body: "可持續發展貫穿房屋和資產的整個生命週期。",
      items: [
        ["規劃與設計", "把全生命週期、居民需要和氣候韌性納入早期決策。"],
        ["建造", "推動低碳建造、物料效益和安全施工。"],
        ["管理營運", "以數據和科技持續改善能源、設施及服務表現。"],
        ["居民參與", "讓減廢、回收、園圃和共融活動成為屋邨日常。"],
        ["社區協作", "與居民、學校、伙伴及業界共同擴大正面影響。"],
      ],
    },
    storySection: {
      title: "屋邨中的可持續行動",
      body: "從一部廚餘機、一塊舊布，到一個更安全的管理流程，改變在社區中逐步發生。",
      all: "全部",
      read: "閱讀故事",
      detailTitle: "我們的行動",
      impactTitle: "帶來的改變",
    },
    stories: [
      {
        slug: "kwun-lung-lau-upcycling",
        pillar: "carbon",
        place: "觀龍樓",
        title: "讓舊物展開第二段生命",
        summary: "居民把回收布料轉化成實用物品，讓循環經濟走進社區日常。",
        detail: "升級再造坊以舊衣和回收物料為創作材料，配合導師示範，讓居民親手完成可再次使用的生活物品。",
        impact: "活動把減廢知識轉化為可參與的生活體驗，同時促進鄰里交流和技能分享。",
        media: { type: "image", src: media.reuseHero, alt: "觀龍樓居民參與物品再生活動" },
      },
      {
        slug: "smart-food-waste",
        pillar: "carbon",
        place: "房協屋邨",
        title: "智能回收，讓廚餘有更好去向",
        summary: "智能廚餘回收設施讓分類更方便，也支援屋邨持續優化回收服務。",
        detail: "居民可在屋邨使用智能廚餘回收設施。系統配合日常管理，協助推廣源頭分類和建立持續參與的習慣。",
        impact: "近 50 部智能廚餘回收機已設於 20 個出租屋邨及 1 個管理物業。",
        media: { type: "video", src: media.foodWasteLtt, alt: "居民示範使用智能廚餘回收設施" },
      },
      {
        slug: "community-garden",
        pillar: "homes",
        place: "屋邨社區",
        title: "在園圃中連結人與社區",
        summary: "週末種植活動讓居民共享綠色空間，也讓環保知識在交流中生根。",
        detail: "社區園圃提供共同種植、學習和相遇的空間。居民在照料植物的過程中交流經驗，建立對屋邨環境的共同投入。",
        impact: "園圃把綠化、身心健康和社區連繫放在同一個可持續生活場景中。",
        media: { type: "video", src: media.garden, alt: "居民參與週末社區園圃種植" },
      },
      {
        slug: "renewable-energy",
        pillar: "carbon",
        place: "出租屋邨",
        title: "在屋邨採集潔淨能源",
        summary: "太陽能和風力設備把公共空間轉化為可再生能源的實踐場景。",
        detail: "房協在合適屋邨設置太陽能光伏系統，並在觀龍樓應用風力發電，將可再生能源融入物業營運。",
        impact: "截至 2024/25 年度，10 個出租屋邨設有太陽能光伏系統。",
        media: { type: "graphic", variant: "solar", alt: "屋邨可再生能源概念圖" },
      },
      {
        slug: "intergenerational-community",
        pillar: "homes",
        place: "跨代社區",
        title: "讓不同世代共享生活空間",
        summary: "共融設施和社區活動回應長者、家庭及不同居民的生活需要。",
        detail: "房協從空間、設施和活動三方面推動跨代交流，讓居民在日常生活中建立互助和連繫。",
        impact: "設計不只處理通行和使用需要，也重視尊重、參與和社區歸屬感。",
        media: { type: "graphic", variant: "community", alt: "跨代共融社區概念圖" },
      },
      {
        slug: "copa-smart-operations",
        pillar: "future",
        place: "COPA",
        title: "以數據支援物業及資產管理",
        summary: "整合資訊、科技和專業知識，讓管理決策更及時、更具前瞻性。",
        detail: "COPA 連結物業和資產管理所需的數據、流程及專業能力，支援安全、維修、能源和服務表現的持續改善。",
        impact: "管理團隊能更清晰掌握資產狀況，並把創新應用轉化為日常營運能力。",
        media: { type: "graphic", variant: "copa", alt: "COPA 數據支援物業管理概念圖" },
      },
    ] satisfies Story[],
    progress: {
      title: "以清楚範圍，呈現我們的進展",
      body: "每個數字都與年份、基準或適用物業範圍一同閱讀。",
      source: "資料來源：香港房屋協會 2024/25 可持續發展報告",
    },
    metrics: [
      { value: "31", unit: "%", label: "能源消耗減少", scope: "相對 2012/13 基準，按正式報告所列物業範圍" },
      { value: "21.9", unit: "%", label: "範疇一及二碳排放按年下降", scope: "2024/25，涵蓋出租屋邨、管理物業、建築項目及主要辦公室" },
      { value: "16,099", unit: "公噸", label: "回收物料", scope: "2024/25 年度" },
      { value: "近 50", unit: "部", label: "智能廚餘回收機", scope: "設於 20 個出租屋邨及 1 個管理物業" },
      { value: "25,100", unit: "小時", label: "義工及社區服務", scope: "2024/25 年度" },
      { value: "38,660", unit: "小時", label: "員工培訓", scope: "2024/25 年度" },
    ] satisfies Metric[],
    governance: {
      title: "以負責任管治，推動每一步",
      body: "清晰的管治、跨部門協作和負責任融資，讓可持續發展成為房屋和資產決策的一部分。",
      items: [
        ["方向與監督", "由董事會及相關工作小組推動策略、監督表現和檢視重點。"],
        ["落實與協作", "營運團隊把承諾納入規劃、建造、管理和社區服務。"],
        ["透明與問責", "以正式報告、明確數據範圍和持續溝通交代進展。"],
      ],
    },
    videos: {
      title: "看見社區中的改變",
      body: "由居民親身示範，了解綠色生活如何在屋邨發生。",
      play: "播放影片",
      note: "影片設有原生播放控制。正式版本將加入字幕及逐字稿。",
      items: [
        ["週末園圃種植樂", "居民共享種植經驗，讓綠色空間成為社區交流的一部分。", media.garden],
        ["觀龍樓智能廚餘回收", "居民示範日常回收流程。", media.foodWasteKll],
        ["廚餘回收設施示範", "從分類到回收，建立更便利的參與體驗。", media.foodWasteLtt],
      ],
    },
    footer: {
      statement: "可持續發展不是單一項目，而是我們建造、管理和服務社區的方式。",
      copyright: "香港房屋協會",
      note: "本網站為 COPA 展覽網站初稿。內容及素材須按正式審批結果更新。",
    },
  },
  "zh-cn": {
    htmlLang: "zh-CN",
    nav: { home: "首页", pillars: "三大支柱", stories: "屋邨行动", progress: "进展", videos: "视频", menu: "打开菜单", close: "关闭" },
    brand: { copa: "物业及资产综合平台", full: "Central Office for Property and Asset" },
    hero: {
      eyebrow: "香港房屋协会可持续发展",
      title: "创建宜居．永续共融",
      body: "我们把可持续发展融入房屋、屋邨管理及社区日常，与居民共建更宜居、更低碳的未来。",
      cta: "探索我们的行动",
      secondary: "查看进展",
      caption: "屋邨居民参与物品再生及升级再造活动",
    },
    intro: {
      title: "可持续发展，从一个家延伸至整个社区",
      body: "房屋不只是建筑。我们从居民需要、资源使用及未来能力出发，把长远承诺落实在每个屋邨日常。",
    },
    pillarHeading: "三大支柱，共同支撑宜居未来",
    pillarPrompt: "选择支柱",
    pillars: [
      { key: "homes", title: "可持续居所", english: "Sustainable Homes", description: "回应不同人生阶段和社会需要，营造安全、共融并具连系的居住环境。", action: "居所与社区" },
      { key: "carbon", title: "低碳转型", english: "Low-carbon Transformation", description: "把节能、减碳、循环资源和气候韧性融入发展、管理及营运。", action: "资源与环境" },
      { key: "future", title: "装备未来", english: "Future-fit Capabilities", description: "以人才、安全、数据和创新科技，提升物业及资产的长远表现。", action: "能力与创新" },
    ] satisfies Pillar[],
    journey: {
      title: "从建造到日常，每一步都计算长远价值",
      body: "可持续发展贯穿房屋和资产的整个生命周期。",
      items: [
        ["规划与设计", "把全生命周期、居民需要和气候韧性纳入早期决策。"],
        ["建造", "推动低碳建造、物料效益和安全施工。"],
        ["管理营运", "以数据和科技持续改善能源、设施及服务表现。"],
        ["居民参与", "让减废、回收、园圃和共融活动成为屋邨日常。"],
        ["社区协作", "与居民、学校、伙伴及业界共同扩大正面影响。"],
      ],
    },
    storySection: { title: "屋邨中的可持续行动", body: "从一部厨余机、一块旧布，到一个更安全的管理流程，改变在社区中逐步发生。", all: "全部", read: "阅读故事", detailTitle: "我们的行动", impactTitle: "带来的改变" },
    stories: [] as Story[],
    progress: { title: "以清楚范围，呈现我们的进展", body: "每个数字都与年份、基准或适用物业范围一同阅读。", source: "资料来源：香港房屋协会 2024/25 可持续发展报告" },
    metrics: [
      { value: "31", unit: "%", label: "能源消耗减少", scope: "相对 2012/13 基准，按正式报告所列物业范围" },
      { value: "21.9", unit: "%", label: "范围一及二碳排放按年下降", scope: "2024/25，涵盖出租屋邨、管理物业、建筑项目及主要办公室" },
      { value: "16,099", unit: "公吨", label: "回收物料", scope: "2024/25 年度" },
      { value: "近 50", unit: "部", label: "智能厨余回收机", scope: "设于 20 个出租屋邨及 1 个管理物业" },
      { value: "25,100", unit: "小时", label: "义工及社区服务", scope: "2024/25 年度" },
      { value: "38,660", unit: "小时", label: "员工培训", scope: "2024/25 年度" },
    ] satisfies Metric[],
    governance: {
      title: "以负责任管治，推动每一步",
      body: "清晰的管治、跨部门协作和负责任融资，让可持续发展成为房屋和资产决策的一部分。",
      items: [
        ["方向与监督", "由董事会及相关工作小组推动策略、监督表现和检视重点。"],
        ["落实与协作", "营运团队把承诺纳入规划、建造、管理和社区服务。"],
        ["透明与问责", "以正式报告、明确数据范围和持续沟通交代进展。"],
      ],
    },
    videos: {
      title: "看见社区中的改变",
      body: "由居民亲身示范，了解绿色生活如何在屋邨发生。",
      play: "播放视频",
      note: "视频设有原生播放控制。正式版本将加入字幕及逐字稿。",
      items: [
        ["周末园圃种植乐", "居民共享种植经验，让绿色空间成为社区交流的一部分。", media.garden],
        ["观龙楼智能厨余回收", "居民示范日常回收流程。", media.foodWasteKll],
        ["厨余回收设施示范", "从分类到回收，建立更便利的参与体验。", media.foodWasteLtt],
      ],
    },
    footer: { statement: "可持续发展不是单一项目，而是我们建造、管理和服务社区的方式。", copyright: "香港房屋协会", note: "本网站为 COPA 展览网站初稿。内容及素材须按正式审批结果更新。" },
  },
  en: {
    htmlLang: "en",
    nav: { home: "Home", pillars: "Our pillars", stories: "Estate action", progress: "Progress", videos: "Videos", menu: "Open menu", close: "Close" },
    brand: { copa: "Central Office for Property and Asset", full: "物業及資產綜合平台" },
    hero: {
      eyebrow: "HKHS sustainability",
      title: "Creating Homes for Sustainable Living",
      body: "We bring sustainability into housing, estate management and community life, building a liveable, low-carbon future with residents.",
      cta: "Explore our action",
      secondary: "View our progress",
      caption: "Estate residents taking part in reuse and upcycling activities",
    },
    intro: {
      title: "Sustainability grows from every home into the community",
      body: "Housing is more than buildings. We turn long-term commitments into everyday estate action through people, resources and future-ready capabilities.",
    },
    pillarHeading: "Three pillars for a liveable future",
    pillarPrompt: "Choose a pillar",
    pillars: [
      { key: "homes", title: "Sustainable Homes", english: "可持續居所", description: "We respond to changing life stages and community needs with safe, inclusive and connected living environments.", action: "Homes and community" },
      { key: "carbon", title: "Low-carbon Transformation", english: "低碳轉型", description: "We integrate energy efficiency, carbon reduction, circular resources and resilience into development and operations.", action: "Resources and environment" },
      { key: "future", title: "Future-fit Capabilities", english: "裝備未來", description: "We strengthen long-term asset performance through people, safety, data and innovation.", action: "Capabilities and innovation" },
    ] satisfies Pillar[],
    journey: {
      title: "Long-term value, from construction to everyday life",
      body: "Sustainability runs through the full housing and asset lifecycle.",
      items: [
        ["Plan and design", "Bring lifecycle thinking, resident needs and climate resilience into early decisions."],
        ["Build", "Advance lower-carbon construction, material efficiency and safe delivery."],
        ["Manage and operate", "Use data and technology to improve energy, facilities and services."],
        ["Engage residents", "Make waste reduction, recycling, gardens and inclusion part of estate life."],
        ["Work together", "Extend positive impact with residents, schools, partners and the industry."],
      ],
    },
    storySection: { title: "Sustainability in estate life", body: "From food waste facilities and old fabric to safer management, change grows through practical community action.", all: "All", read: "Read story", detailTitle: "Our action", impactTitle: "The change" },
    stories: [] as Story[],
    progress: { title: "Progress shown with clear scope", body: "Every number is read with its reporting year, baseline or applicable property scope.", source: "Source: HKHS Sustainability Report 2024/25" },
    metrics: [
      { value: "31", unit: "%", label: "reduction in energy consumption", scope: "Against the 2012/13 baseline, within the property scope stated in the report" },
      { value: "21.9", unit: "%", label: "year-on-year fall in Scope 1 and 2 emissions", scope: "2024/25, covering rental estates, managed properties, construction projects and major offices" },
      { value: "16,099", unit: "tonnes", label: "materials recycled", scope: "2024/25" },
      { value: "Nearly 50", unit: "units", label: "smart food waste recycling bins", scope: "Across 20 rental estates and one managed property" },
      { value: "25,100", unit: "hours", label: "volunteer and community service", scope: "2024/25" },
      { value: "38,660", unit: "hours", label: "staff training", scope: "2024/25" },
    ] satisfies Metric[],
    governance: {
      title: "Responsible governance behind every step",
      body: "Clear oversight, collaboration and responsible finance make sustainability part of housing and asset decisions.",
      items: [
        ["Direction and oversight", "The Supervisory Board and working groups guide strategy, monitor performance and review priorities."],
        ["Delivery and collaboration", "Operational teams bring commitments into planning, construction, management and community service."],
        ["Transparency and accountability", "Formal reporting, clear data scopes and ongoing communication show our progress."],
      ],
    },
    videos: {
      title: "See change taking place",
      body: "Residents show how greener living becomes part of everyday estate life.",
      play: "Play video",
      note: "Videos include native playback controls. Captions and transcripts will be added for the final version.",
      items: [
        ["A weekend in the community garden", "Residents share growing experience and turn green space into a place for connection.", media.garden],
        ["Smart food waste recycling at Kwun Lung Lau", "Residents demonstrate the everyday recycling process.", media.foodWasteKll],
        ["Using a food waste recycling facility", "A more convenient experience from separation to recycling.", media.foodWasteLtt],
      ],
    },
    footer: { statement: "Sustainability is not one project. It is how we build, manage and serve communities.", copyright: "Hong Kong Housing Society", note: "This is a draft COPA exhibition website. Content and media will be updated after formal approval." },
  },
} as const;

const englishStories: Story[] = [
  {
    slug: "kwun-lung-lau-upcycling",
    pillar: "carbon",
    place: "Kwun Lung Lau",
    title: "Giving old materials a second life",
    summary: "Residents turn recovered fabric into useful objects and bring circular thinking into community life.",
    detail: "The workshop uses old clothes and recovered materials for hands-on making. With guidance, residents create practical items that can be used again.",
    impact: "Waste reduction becomes a shared experience that also supports neighbourly connection and skill sharing.",
    media: { type: "image", src: media.reuseHero, alt: "Kwun Lung Lau residents taking part in a reuse activity" },
  },
  {
    slug: "smart-food-waste",
    pillar: "carbon",
    place: "HKHS estates",
    title: "A smarter route for food waste",
    summary: "Smart facilities make separation easier and help estates keep improving recycling services.",
    detail: "Residents can use smart food waste recycling facilities in their estates. The system supports daily management and encourages lasting separation habits.",
    impact: "Nearly 50 smart food waste recycling bins serve 20 rental estates and one managed property.",
    media: { type: "video", src: media.foodWasteLtt, alt: "Residents demonstrating a smart food waste recycling facility" },
  },
  {
    slug: "community-garden",
    pillar: "homes",
    place: "Estate community",
    title: "Growing connections in a shared garden",
    summary: "Weekend planting lets residents share green space and learn through conversation.",
    detail: "The community garden creates a place to grow, learn and meet. Residents exchange experience while building a shared commitment to their environment.",
    impact: "The garden connects greening, wellbeing and community relationships in one everyday setting.",
    media: { type: "video", src: media.garden, alt: "Residents planting together in a community garden" },
  },
  {
    slug: "renewable-energy",
    pillar: "carbon",
    place: "Rental estates",
    title: "Harvesting cleaner energy on estates",
    summary: "Solar and wind installations turn shared spaces into practical renewable energy sites.",
    detail: "HKHS installs solar photovoltaic systems at suitable estates and uses wind generation at Kwun Lung Lau, integrating renewables into operations.",
    impact: "By 2024/25, solar photovoltaic systems were installed at 10 rental estates.",
    media: { type: "graphic", variant: "solar", alt: "Conceptual view of renewable energy on an estate" },
  },
  {
    slug: "intergenerational-community",
    pillar: "homes",
    place: "Intergenerational community",
    title: "Shared spaces for every generation",
    summary: "Inclusive facilities and activities respond to older people, families and diverse residents.",
    detail: "HKHS promotes intergenerational connection through spaces, facilities and activities that encourage residents to meet and support one another.",
    impact: "Design addresses access and use while strengthening respect, participation and belonging.",
    media: { type: "graphic", variant: "community", alt: "Conceptual view of an intergenerational community" },
  },
  {
    slug: "copa-smart-operations",
    pillar: "future",
    place: "COPA",
    title: "Data-supported property and asset management",
    summary: "Connected information, technology and expertise support timely, forward-looking decisions.",
    detail: "COPA brings together data, processes and professional capabilities for safety, maintenance, energy and service improvement.",
    impact: "Teams gain a clearer view of asset conditions and turn innovation into everyday operational capability.",
    media: { type: "graphic", variant: "copa", alt: "Conceptual view of COPA supporting property management" },
  },
];

const simplifiedStories: Story[] = [
  {
    slug: "kwun-lung-lau-upcycling",
    pillar: "carbon",
    place: "观龙楼",
    title: "让旧物展开第二段生命",
    summary: "居民把回收布料转化成实用物品，让循环经济走进社区日常。",
    detail: "升级再造坊以旧衣和回收物料为创作材料，配合导师示范，让居民亲手完成可再次使用的生活物品。",
    impact: "活动把减废知识转化为可参与的生活体验，同时促进邻里交流和技能分享。",
    media: { type: "image", src: media.reuseHero, alt: "观龙楼居民参与物品再生活动" },
  },
  {
    slug: "smart-food-waste",
    pillar: "carbon",
    place: "房协屋邨",
    title: "智能回收，让厨余有更好去向",
    summary: "智能厨余回收设施让分类更方便，也支持屋邨持续优化回收服务。",
    detail: "居民可在屋邨使用智能厨余回收设施。系统配合日常管理，协助推广源头分类和建立持续参与的习惯。",
    impact: "近 50 部智能厨余回收机已设于 20 个出租屋邨及 1 个管理物业。",
    media: { type: "video", src: media.foodWasteLtt, alt: "居民示范使用智能厨余回收设施" },
  },
  {
    slug: "community-garden",
    pillar: "homes",
    place: "屋邨社区",
    title: "在园圃中连结人与社区",
    summary: "周末种植活动让居民共享绿色空间，也让环保知识在交流中生根。",
    detail: "社区园圃提供共同种植、学习和相遇的空间。居民在照料植物的过程中交流经验，建立对屋邨环境的共同投入。",
    impact: "园圃把绿化、身心健康和社区连系放在同一个可持续生活场景中。",
    media: { type: "video", src: media.garden, alt: "居民参与周末社区园圃种植" },
  },
  {
    slug: "renewable-energy",
    pillar: "carbon",
    place: "出租屋邨",
    title: "在屋邨采集洁净能源",
    summary: "太阳能和风力设备把公共空间转化为可再生能源的实践场景。",
    detail: "房协在合适屋邨设置太阳能光伏系统，并在观龙楼应用风力发电，将可再生能源融入物业营运。",
    impact: "截至 2024/25 年度，10 个出租屋邨设有太阳能光伏系统。",
    media: { type: "graphic", variant: "solar", alt: "屋邨可再生能源概念图" },
  },
  {
    slug: "intergenerational-community",
    pillar: "homes",
    place: "跨代社区",
    title: "让不同世代共享生活空间",
    summary: "共融设施和社区活动回应长者、家庭及不同居民的生活需要。",
    detail: "房协从空间、设施和活动三方面推动跨代交流，让居民在日常生活中建立互助和连系。",
    impact: "设计不只处理通行和使用需要，也重视尊重、参与和社区归属感。",
    media: { type: "graphic", variant: "community", alt: "跨代共融社区概念图" },
  },
  {
    slug: "copa-smart-operations",
    pillar: "future",
    place: "COPA",
    title: "以数据支持物业及资产管理",
    summary: "整合信息、科技和专业知识，让管理决策更及时、更具前瞻性。",
    detail: "COPA 连结物业和资产管理所需的数据、流程及专业能力，支持安全、维修、能源和服务表现的持续改善。",
    impact: "管理团队能更清晰掌握资产状况，并把创新应用转化为日常营运能力。",
    media: { type: "graphic", variant: "copa", alt: "COPA 数据支持物业管理概念图" },
  },
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "brand-mark brand-mark-compact" : "brand-mark"} data-brand-status="provisional">
      <img
        src="/brand/hkhs-horizontal.jpg"
        alt="Hong Kong Housing Society 香港房屋協會"
        width="2212"
        height="729"
      />
    </span>
  );
}

function StoryVisual({ media: visual, compact = false }: { media: StoryMedia; compact?: boolean }) {
  if (visual.type === "image") {
    return <img src={visual.src} alt={visual.alt} width="1800" height="1352" loading="lazy" />;
  }

  if (visual.type === "video") {
    return (
      <video muted playsInline preload="metadata" aria-label={visual.alt} tabIndex={-1}>
        <source src={visual.src} type="video/mp4" />
      </video>
    );
  }

  const Icon = visual.variant === "solar" ? Sun : visual.variant === "community" ? UsersThree : Cpu;
  return (
    <div className={`story-graphic story-graphic-${visual.variant} ${compact ? "is-compact" : ""}`} role="img" aria-label={visual.alt}>
      <Icon size={compact ? 54 : 88} weight="thin" aria-hidden="true" />
      <span className="graphic-orbit" aria-hidden="true" />
      <span className="graphic-plane" aria-hidden="true" />
    </div>
  );
}

export function SiteExperience({ locale }: { locale: Locale }) {
  const reduceMotion = useReducedMotion();
  const c = content[locale];
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePillar, setActivePillar] = useState<PillarKey>("homes");
  const [storyFilter, setStoryFilter] = useState<"all" | PillarKey>("all");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [activeVideo, setActiveVideo] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const stories = useMemo(() => {
    if (locale === "en") return englishStories;
    if (locale === "zh-cn") return simplifiedStories;
    return [...content["zh-hk"].stories];
  }, [locale]);

  const filteredStories = storyFilter === "all" ? stories : stories.filter((story) => story.pillar === storyFilter);
  const selectedPillar = c.pillars.find((pillar) => pillar.key === activePillar) ?? c.pillars[0];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedStory && !dialog.open) dialog.showModal();
    if (!selectedStory && dialog.open) dialog.close();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [selectedStory]);

  const languageLinks = [
    ["zh-hk", "繁"],
    ["en", "EN"],
    ["zh-cn", "简"],
  ] as const;

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 26 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.18 },
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div className="site-shell" lang={c.htmlLang}>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="topbar">
        <a href={locale === "zh-hk" ? "/" : `/${locale}`} className="brand-link" aria-label={c.nav.home}>
          <BrandMark compact />
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#pillars">{c.nav.pillars}</a>
          <a href="#stories">{c.nav.stories}</a>
          <a href="#progress">{c.nav.progress}</a>
          <a href="#videos">{c.nav.videos}</a>
        </nav>

        <div className="header-actions">
          <div className="language-switcher" aria-label="Language">
            {languageLinks.map(([key, label]) => (
              <a key={key} href={key === "zh-hk" ? "/zh-hk" : `/${key}`} aria-current={locale === key ? "page" : undefined}>
                {label}
              </a>
            ))}
          </div>
          <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label={c.nav.menu}>
            <List size={24} weight="regular" aria-hidden="true" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <button type="button" onClick={() => setMenuOpen(false)} aria-label={c.nav.close}>
              <X size={25} aria-hidden="true" />
            </button>
            <BrandMark />
            <nav aria-label="Mobile navigation">
              {[
                ["#pillars", c.nav.pillars],
                ["#stories", c.nav.stories],
                ["#progress", c.nav.progress],
                ["#videos", c.nav.videos],
              ].map(([href, label]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowRight size={22} aria-hidden="true" /></a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content">
        <section className="hero" id="home">
          <motion.div
            className="hero-copy"
            initial={reduceMotion ? false : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="eyebrow">{c.hero.eyebrow}</p>
            <h1>{c.hero.title}</h1>
            <p className="hero-body">{c.hero.body}</p>
            <div className="hero-actions">
              <a className="primary-button" href="#stories">{c.hero.cta}<ArrowRight size={18} aria-hidden="true" /></a>
              <a className="text-link" href="#progress">{c.hero.secondary}</a>
            </div>
          </motion.div>

          <motion.figure
            className="hero-visual"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-image-wrap">
              <img src={media.reuseHero} alt={c.hero.caption} width="1800" height="1352" fetchPriority="high" />
            </div>
            <figcaption>{c.hero.caption}</figcaption>
          </motion.figure>

          <div className="copa-stamp" aria-label={`${c.brand.full}, ${c.brand.copa}`}>
            <span>COPA</span>
            <strong>{c.brand.copa}</strong>
          </div>
        </section>

        <motion.section className="intro-section" {...reveal}>
          <div className="intro-mark" aria-hidden="true"><Leaf size={38} weight="thin" /></div>
          <h2>{c.intro.title}</h2>
          <p>{c.intro.body}</p>
        </motion.section>

        <section className="pillars-section" id="pillars">
          <div className="section-heading">
            <h2>{c.pillarHeading}</h2>
          </div>
          <div className="pillars-layout">
            <div className="pillar-tabs" role="tablist" aria-label={c.pillarPrompt}>
              {c.pillars.map((pillar) => (
                <button
                  key={pillar.key}
                  type="button"
                  role="tab"
                  aria-selected={activePillar === pillar.key}
                  onClick={() => setActivePillar(pillar.key)}
                >
                  <span>{pillar.title}</span>
                  <small>{pillar.english}</small>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.article
                key={selectedPillar.key}
                className={`pillar-panel pillar-${selectedPillar.key}`}
                initial={reduceMotion ? false : { opacity: 0, x: 22 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.35 }}
              >
                <div className="pillar-symbol" aria-hidden="true">
                  {selectedPillar.key === "homes" ? <HouseLine size={84} weight="thin" /> : selectedPillar.key === "carbon" ? <Recycle size={84} weight="thin" /> : <Cpu size={84} weight="thin" />}
                </div>
                <p>{selectedPillar.action}</p>
                <h3>{selectedPillar.title}</h3>
                <span>{selectedPillar.english}</span>
                <p className="pillar-description">{selectedPillar.description}</p>
              </motion.article>
            </AnimatePresence>
          </div>
        </section>

        <motion.section className="journey-section" {...reveal}>
          <div className="journey-lead">
            <h2>{c.journey.title}</h2>
            <p>{c.journey.body}</p>
          </div>
          <div className="journey-track">
            {c.journey.items.map(([title, description], index) => (
              <article key={title} style={{ "--item-index": index } as React.CSSProperties}>
                <span aria-hidden="true">{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </motion.section>

        <section className="stories-section" id="stories">
          <div className="section-heading">
            <h2>{c.storySection.title}</h2>
            <p>{c.storySection.body}</p>
          </div>
          <div className="story-filters" role="group" aria-label={c.pillarPrompt}>
            <button type="button" className={storyFilter === "all" ? "is-active" : ""} onClick={() => setStoryFilter("all")}>{c.storySection.all}</button>
            {c.pillars.map((pillar) => (
              <button key={pillar.key} type="button" className={storyFilter === pillar.key ? "is-active" : ""} onClick={() => setStoryFilter(pillar.key)}>{pillar.title}</button>
            ))}
          </div>
          <motion.div className="stories-grid" layout>
            <AnimatePresence mode="popLayout">
              {filteredStories.map((story, index) => (
                <motion.article
                  layout
                  key={story.slug}
                  className={`story-card story-card-${index % 6}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="story-media"><StoryVisual media={story.media} compact /></div>
                  <div className="story-copy">
                    <p className="story-place">{story.place}</p>
                    <h3>{story.title}</h3>
                    <p>{story.summary}</p>
                    <button type="button" onClick={() => setSelectedStory(story)}>{c.storySection.read}<ArrowRight size={17} aria-hidden="true" /></button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <section className="progress-section" id="progress">
          <motion.div className="progress-heading" {...reveal}>
            <ChartLineUp size={42} weight="thin" aria-hidden="true" />
            <h2>{c.progress.title}</h2>
            <p>{c.progress.body}</p>
          </motion.div>
          <div className="metrics-grid">
            {c.metrics.map((metric, index) => (
              <motion.article key={metric.label} className={`metric metric-${index}`} {...reveal}>
                <div className="metric-value"><strong>{metric.value}</strong><span>{metric.unit}</span></div>
                <h3>{metric.label}</h3>
                <p>{metric.scope}</p>
              </motion.article>
            ))}
          </div>
          <p className="source-note">{c.progress.source}</p>
        </section>

        <motion.section className="governance-section" {...reveal}>
          <div className="governance-copy">
            <ShieldCheck size={48} weight="thin" aria-hidden="true" />
            <h2>{c.governance.title}</h2>
            <p>{c.governance.body}</p>
          </div>
          <div className="governance-points">
            {c.governance.items.map(([title, description]) => (
              <article key={title}>
                <CheckCircle size={24} weight="regular" aria-hidden="true" />
                <div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </motion.section>

        <section className="videos-section" id="videos">
          <div className="section-heading">
            <h2>{c.videos.title}</h2>
            <p>{c.videos.body}</p>
          </div>
          <div className="video-layout">
            <div className="video-player">
              <video key={c.videos.items[activeVideo][2]} controls playsInline preload="metadata" aria-label={c.videos.items[activeVideo][0]}>
                <source src={c.videos.items[activeVideo][2]} type="video/mp4" />
              </video>
              <p>{c.videos.note}</p>
            </div>
            <div className="video-selector">
              {c.videos.items.map(([title, description], index) => (
                <button key={title} type="button" className={activeVideo === index ? "is-active" : ""} onClick={() => setActiveVideo(index)}>
                  <span className="play-icon"><Play size={18} weight="fill" aria-hidden="true" /></span>
                  <span><strong>{title}</strong><small>{description}</small></span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <img src="/brand/hkhs-vertical.jpg" alt="Hong Kong Housing Society 香港房屋協會" width="1658" height="1260" data-brand-status="provisional" />
        </div>
        <div className="footer-statement">
          <p>{c.footer.statement}</p>
          <span>{c.brand.full}</span>
          <strong>{c.brand.copa}</strong>
        </div>
        <div className="footer-meta">
          <p>© {new Date().getFullYear()} {c.footer.copyright}</p>
          <p>{c.footer.note}</p>
        </div>
      </footer>

      <nav className="bottom-nav" aria-label="Mobile primary navigation">
        <a href="#home"><HouseLine size={21} aria-hidden="true" /><span>{c.nav.home}</span></a>
        <a href="#pillars"><Leaf size={21} aria-hidden="true" /><span>{c.nav.pillars}</span></a>
        <a href="#stories"><Buildings size={21} aria-hidden="true" /><span>{c.nav.stories}</span></a>
        <a href="#videos"><Play size={21} aria-hidden="true" /><span>{c.nav.videos}</span></a>
      </nav>

      <dialog
        ref={dialogRef}
        className="story-dialog"
        onCancel={() => setSelectedStory(null)}
        onClose={() => setSelectedStory(null)}
      >
        {selectedStory && (
          <div className="dialog-inner">
            <button className="dialog-close" type="button" onClick={() => setSelectedStory(null)} aria-label={c.nav.close}>
              <X size={23} aria-hidden="true" />
            </button>
            <div className="dialog-media"><StoryVisual media={selectedStory.media} /></div>
            <div className="dialog-copy">
              <p className="story-place">{selectedStory.place}</p>
              <h2>{selectedStory.title}</h2>
              <h3>{c.storySection.detailTitle}</h3>
              <p>{selectedStory.detail}</p>
              <h3>{c.storySection.impactTitle}</h3>
              <p>{selectedStory.impact}</p>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
