"use client";

import {
  ArrowRight,
  ArrowSquareOut,
  Buildings,
  CaretLeft,
  CaretRight,
  ChartLineUp,
  CheckCircle,
  Cpu,
  Database,
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
  scopeKind?: "organization" | "property";
  sourceKey?: "sustainability" | "annual";
  sourcePage?: number;
};

type Metric = {
  value: string;
  unit: string;
  label: string;
  scope: string;
  scopeKind: "organization" | "property";
  sourceKey: "sustainability" | "annual";
  sourcePage: number;
};

type RailCueProps = {
  activeIndex: number;
  count: number;
  label: string;
  previousLabel: string;
  nextLabel: string;
  onSelect: (index: number) => void;
};

const sourceDocuments = {
  sustainability: "https://www.hkhs.com/home/pdf/sustainability_report/2025/files/downloads/HKHS%20Sustainability%20Report_24-25.pdf",
  annual: "https://www.hkhs.com/home/pdf/ar2025/files/downloads/HKHS_Annual_Report_24-25.pdf",
} as const;

const media = {
  reuseHero: "/media/photos/kll-reuse-hero.jpg",
  reuseDetail: "/media/photos/kll-reuse-detail-1.jpg",
  reusePortrait: "/media/photos/kll-reuse-detail-2.jpg",
  garden: "/media/videos/community-garden.mp4",
  foodWasteKll: "/media/videos/food-waste-kll.mp4",
  foodWasteLtt: "/media/videos/food-waste-ltt.mp4",
  copaCommand: "/media/copa/copa-command-centre.webp",
  copaSpace: "/media/copa/copa-space.webp",
  copaWall: "/media/copa/copa-exhibition-wall.webp",
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
    ui: {
      swipe: "左右滑動查看更多",
      previous: "上一項",
      next: "下一項",
      source: "查看正式來源",
      reportPage: "PDF 第",
      pageSuffix: "頁",
      organization: "房協整體",
      property: "物業管理實踐",
      sustainabilityReport: "香港房屋協會 2024/25 可持續發展報告",
      annualReport: "香港房屋協會 2024/25 年度報告",
      previousStory: "上一個故事",
      nextStory: "下一個故事",
    },
    hero: {
      eyebrow: "香港房屋協會可持續發展",
      title: "創建宜居．永續共融",
      body: "我們在物業管理和社區日常中落實可持續發展，與居民共建更宜居、更低碳的未來。",
      cta: "探索我們的行動",
      secondary: "查看進展",
      caption: "屋邨居民參與物品再生及升級再造活動",
    },
    intro: {
      title: "在物業管理日常，把 ESG 承諾變成行動",
      body: "我們從居民需要、資源使用、設施表現和未來能力出發，把房協的長遠方向落實在屋邨管理和社區日常。",
    },
    pillarHeading: "三大支柱，共同支撐宜居未來",
    pillarPrompt: "選擇支柱",
    pillarSource: "三大支柱源自房協可持續發展策略。",
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
      title: "從建造到管理，把長遠價值帶進日常",
      body: "物業管理團隊承接房屋和資產全生命週期的成果，並在營運中持續改善。",
      items: [
        ["規劃與設計", "把全生命週期、居民需要和氣候韌性納入早期決策。"],
        ["建造", "推動低碳建造、物料效益和安全施工。"],
        ["管理營運", "以數據和科技持續改善能源、設施及服務表現。"],
        ["居民參與", "讓減廢、回收、園圃和共融活動成為屋邨日常。"],
        ["社區協作", "與居民、學校、伙伴及業界共同擴大正面影響。"],
      ],
    },
    copa: {
      title: "以 COPA 連結物業管理每一環",
      body: "我們透過物業及資產綜合平台整合系統、數據與專業能力，支援更清晰、及時和持續的管理決策。",
      steps: [
        ["連結", "在單一平台連接不同系統、感應器與物業資訊。", media.copaCommand, "COPA 指揮中心以大型屏幕整合物業及資產資訊"],
        ["統一", "以標準化共同數據環境整理跨系統資料，建立一致的管理基礎。", media.copaCommand, "COPA 屏幕顯示物業資訊及香港地圖"],
        ["洞察", "透過互動儀表板、大數據分析及 AI-ready 基礎掌握物業狀況。", media.copaWall, "COPA 展示空間內的數碼應用和互動屏幕"],
        ["行動", "把資訊轉化為日常營運能力，支援安全、維修、能源及服務持續改善。", media.copaSpace, "COPA 工作空間及以樹木為意象的室內設計"],
      ],
      features: "平台功能包括系統及感應器整合、共同數據環境、互動儀表板、安全數據管理，以及日後擴展能力。",
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
        sourceKey: "annual",
        sourcePage: 141,
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
        sourceKey: "annual",
        sourcePage: 141,
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
        title: "把數據轉化為物業管理行動",
        summary: "我們整合資訊、科技和專業知識，讓管理決策更清晰、更及時。",
        detail: "COPA 在單一平台連結物業和資產管理所需的系統、感應器、數據及流程，並以共同數據環境和互動儀表板支援日常工作。",
        impact: "管理團隊可更清晰掌握資產狀況，支援安全、維修、能源和服務表現的持續改善。",
        media: { type: "image", src: media.copaCommand, alt: "COPA 指揮中心整合物業及資產資訊" },
      },
    ] satisfies Story[],
    progress: {
      title: "以清楚範圍，呈現我們的進展",
      body: "每個數字都與年份、基準或適用物業範圍一同閱讀。",
      source: "資料來源：香港房屋協會 2024/25 可持續發展報告及年度報告。每項數據均附正式文件連結及頁碼。",
    },
    metrics: [
      { value: "31", unit: "%", label: "能源消耗減少", scope: "相對 2012/13 基準，按正式報告所列選定物業範圍", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "21.9", unit: "%", label: "範疇一及二碳排放按年下降", scope: "2024/25，涵蓋出租屋邨、管理物業、建築項目及主要辦公室", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "16,099", unit: "公噸", label: "回收物料", scope: "2024/25 年度，包括金屬、紙張、塑膠、玻璃、木材及紡織物", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "近 50", unit: "部", label: "智能廚餘回收設施", scope: "設於 20 個出租屋邨及 1 個代管物業", scopeKind: "property", sourceKey: "annual", sourcePage: 141 },
      { value: "25,100", unit: "小時", label: "社區服務", scope: "2024/25，由房協友里團隊及房協學院舊生會共同貢獻", scopeKind: "organization", sourceKey: "annual", sourcePage: 144 },
      { value: "38,660", unit: "小時", label: "員工培訓及專業發展", scope: "2024/25，適用於長期及固定任期員工", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
    ] satisfies Metric[],
    governance: {
      title: "以負責任管治，推動每一步",
      body: "清晰的管治、跨部門協作和負責任融資，讓可持續發展成為房屋和資產決策的一部分。",
      items: [
        ["方向與監督", "由總監會議及相關工作小組推動策略、監督表現和檢視重點。"],
        ["落實與協作", "營運團隊把承諾納入規劃、建造、管理和社區服務。"],
        ["透明與問責", "以正式報告、明確數據範圍和持續溝通交代進展。"],
      ],
    },
    videos: {
      title: "看見社區中的改變",
      body: "由居民親身示範，了解綠色生活如何在屋邨發生。",
      play: "播放影片",
      note: "可使用原生播放控制觀看影片。",
      items: [
        ["週末園圃種植樂", "居民共享種植經驗，讓綠色空間成為社區交流的一部分。", media.garden],
        ["觀龍樓智能廚餘回收", "居民示範日常回收流程。", media.foodWasteKll],
        ["廚餘回收設施示範", "從分類到回收，建立更便利的參與體驗。", media.foodWasteLtt],
      ],
    },
    footer: {
      statement: "可持續發展不是單一項目，而是我們建造、管理和服務社區的方式。",
      copyright: "香港房屋協會",
      note: "數據以所示報告期、披露範圍及正式來源為準。",
    },
  },
  "zh-cn": {
    htmlLang: "zh-CN",
    nav: { home: "首页", pillars: "三大支柱", stories: "屋邨行动", progress: "进展", videos: "视频", menu: "打开菜单", close: "关闭" },
    brand: { copa: "物业及资产综合平台", full: "Central Office for Property and Asset" },
    ui: {
      swipe: "左右滑动查看更多", previous: "上一项", next: "下一项", source: "查看正式来源", reportPage: "PDF 第", pageSuffix: "页",
      organization: "房协整体", property: "物业管理实践", sustainabilityReport: "香港房屋协会 2024/25 可持续发展报告", annualReport: "香港房屋协会 2024/25 年度报告",
      previousStory: "上一个故事", nextStory: "下一个故事",
    },
    hero: {
      eyebrow: "香港房屋协会可持续发展",
      title: "创建宜居．永续共融",
      body: "我们在物业管理和社区日常中落实可持续发展，与居民共建更宜居、更低碳的未来。",
      cta: "探索我们的行动",
      secondary: "查看进展",
      caption: "屋邨居民参与物品再生及升级再造活动",
    },
    intro: {
      title: "在物业管理日常，把 ESG 承诺变成行动",
      body: "我们从居民需要、资源使用、设施表现和未来能力出发，把房协的长远方向落实在屋邨管理和社区日常。",
    },
    pillarHeading: "三大支柱，共同支撑宜居未来",
    pillarPrompt: "选择支柱",
    pillarSource: "三大支柱源自房协可持续发展策略。",
    pillars: [
      { key: "homes", title: "可持续居所", english: "Sustainable Homes", description: "回应不同人生阶段和社会需要，营造安全、共融并具连系的居住环境。", action: "居所与社区" },
      { key: "carbon", title: "低碳转型", english: "Low-carbon Transformation", description: "把节能、减碳、循环资源和气候韧性融入发展、管理及营运。", action: "资源与环境" },
      { key: "future", title: "装备未来", english: "Future-fit Capabilities", description: "以人才、安全、数据和创新科技，提升物业及资产的长远表现。", action: "能力与创新" },
    ] satisfies Pillar[],
    journey: {
      title: "从建造到管理，把长远价值带进日常",
      body: "物业管理团队承接房屋和资产全生命周期的成果，并在营运中持续改善。",
      items: [
        ["规划与设计", "把全生命周期、居民需要和气候韧性纳入早期决策。"],
        ["建造", "推动低碳建造、物料效益和安全施工。"],
        ["管理营运", "以数据和科技持续改善能源、设施及服务表现。"],
        ["居民参与", "让减废、回收、园圃和共融活动成为屋邨日常。"],
        ["社区协作", "与居民、学校、伙伴及业界共同扩大正面影响。"],
      ],
    },
    copa: {
      title: "以 COPA 连结物业管理每一环",
      body: "我们透过物业及资产综合平台整合系统、数据与专业能力，支持更清晰、及时和持续的管理决策。",
      steps: [
        ["连结", "在单一平台连接不同系统、传感器与物业信息。", media.copaCommand, "COPA 指挥中心以大型屏幕整合物业及资产信息"],
        ["统一", "以标准化共同数据环境整理跨系统资料，建立一致的管理基础。", media.copaCommand, "COPA 屏幕显示物业信息及香港地图"],
        ["洞察", "透过互动仪表板、大数据分析及 AI-ready 基础掌握物业状况。", media.copaWall, "COPA 展示空间内的数字应用和互动屏幕"],
        ["行动", "把信息转化为日常营运能力，支持安全、维修、能源及服务持续改善。", media.copaSpace, "COPA 工作空间及以树木为意象的室内设计"],
      ],
      features: "平台功能包括系统及传感器整合、共同数据环境、互动仪表板、安全数据管理，以及日后扩展能力。",
    },
    storySection: { title: "屋邨中的可持续行动", body: "从一部厨余机、一块旧布，到一个更安全的管理流程，改变在社区中逐步发生。", all: "全部", read: "阅读故事", detailTitle: "我们的行动", impactTitle: "带来的改变" },
    stories: [] as Story[],
    progress: { title: "以清楚范围，呈现我们的进展", body: "每个数字都与年份、基准或适用物业范围一同阅读。", source: "资料来源：香港房屋协会 2024/25 可持续发展报告及年度报告。每项数据均附正式文件链接及页码。" },
    metrics: [
      { value: "31", unit: "%", label: "能源消耗减少", scope: "相对 2012/13 基准，按正式报告所列选定物业范围", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "21.9", unit: "%", label: "范围一及二碳排放按年下降", scope: "2024/25，涵盖出租屋邨、管理物业、建筑项目及主要办公室", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "16,099", unit: "公吨", label: "回收物料", scope: "2024/25 年度，包括金属、纸张、塑料、玻璃、木材及纺织物", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "近 50", unit: "部", label: "智能厨余回收设施", scope: "设于 20 个出租屋邨及 1 个代管物业", scopeKind: "property", sourceKey: "annual", sourcePage: 141 },
      { value: "25,100", unit: "小时", label: "社区服务", scope: "2024/25，由房协友里团队及房协学院旧生会共同贡献", scopeKind: "organization", sourceKey: "annual", sourcePage: 144 },
      { value: "38,660", unit: "小时", label: "员工培训及专业发展", scope: "2024/25，适用于长期及固定任期员工", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
    ] satisfies Metric[],
    governance: {
      title: "以负责任管治，推动每一步",
      body: "清晰的管治、跨部门协作和负责任融资，让可持续发展成为房屋和资产决策的一部分。",
      items: [
        ["方向与监督", "由总监会议及相关工作小组推动策略、监督表现和检视重点。"],
        ["落实与协作", "营运团队把承诺纳入规划、建造、管理和社区服务。"],
        ["透明与问责", "以正式报告、明确数据范围和持续沟通交代进展。"],
      ],
    },
    videos: {
      title: "看见社区中的改变",
      body: "由居民亲身示范，了解绿色生活如何在屋邨发生。",
      play: "播放视频",
      note: "可使用原生播放控制观看视频。",
      items: [
        ["周末园圃种植乐", "居民共享种植经验，让绿色空间成为社区交流的一部分。", media.garden],
        ["观龙楼智能厨余回收", "居民示范日常回收流程。", media.foodWasteKll],
        ["厨余回收设施示范", "从分类到回收，建立更便利的参与体验。", media.foodWasteLtt],
      ],
    },
    footer: { statement: "可持续发展不是单一项目，而是我们建造、管理和服务社区的方式。", copyright: "香港房屋协会", note: "数据以所示报告期、披露范围及正式来源为准。" },
  },
  en: {
    htmlLang: "en",
    nav: { home: "Home", pillars: "Our pillars", stories: "Estate action", progress: "Progress", videos: "Videos", menu: "Open menu", close: "Close" },
    brand: { copa: "Central Office for Property and Asset", full: "物業及資產綜合平台" },
    ui: {
      swipe: "Swipe to explore", previous: "Previous", next: "Next", source: "View official source", reportPage: "PDF page ", pageSuffix: "",
      organization: "HKHS-wide", property: "Property management practice", sustainabilityReport: "HKHS Sustainability Report 2024/25", annualReport: "HKHS Annual Report 2024/25",
      previousStory: "Previous story", nextStory: "Next story",
    },
    hero: {
      eyebrow: "HKHS sustainability",
      title: "Creating Homes for Sustainable Living",
      body: "We put sustainability into practice through property management and community life, building a liveable, low-carbon future with residents.",
      cta: "Explore our action",
      secondary: "View our progress",
      caption: "Estate residents taking part in reuse and upcycling activities",
    },
    intro: {
      title: "Turning ESG commitments into everyday management",
      body: "We bring HKHS's long-term direction into estate management through resident needs, resource use, asset performance and future-ready capabilities.",
    },
    pillarHeading: "Three pillars for a liveable future",
    pillarPrompt: "Choose a pillar",
    pillarSource: "The three pillars form part of HKHS's sustainability strategy.",
    pillars: [
      { key: "homes", title: "Sustainable Homes", english: "可持續居所", description: "We respond to changing life stages and community needs with safe, inclusive and connected living environments.", action: "Homes and community" },
      { key: "carbon", title: "Low-carbon Transformation", english: "低碳轉型", description: "We integrate energy efficiency, carbon reduction, circular resources and resilience into development and operations.", action: "Resources and environment" },
      { key: "future", title: "Future-fit Capabilities", english: "裝備未來", description: "We strengthen long-term asset performance through people, safety, data and innovation.", action: "Capabilities and innovation" },
    ] satisfies Pillar[],
    journey: {
      title: "Bringing long-term value into everyday management",
      body: "Property management carries lifecycle thinking into operations and continuous improvement.",
      items: [
        ["Plan and design", "Bring lifecycle thinking, resident needs and climate resilience into early decisions."],
        ["Build", "Advance lower-carbon construction, material efficiency and safe delivery."],
        ["Manage and operate", "Use data and technology to improve energy, facilities and services."],
        ["Engage residents", "Make waste reduction, recycling, gardens and inclusion part of estate life."],
        ["Work together", "Extend positive impact with residents, schools, partners and the industry."],
      ],
    },
    copa: {
      title: "Connecting every part of property management",
      body: "Through COPA, we bring systems, data and professional capabilities together to support clearer, timely and continuous management decisions.",
      steps: [
        ["Connect", "Bring systems, sensors and property information together on one platform.", media.copaCommand, "The COPA command centre integrates property and asset information on large displays"],
        ["Standardise", "Organise information in a standardised common data environment for a consistent management foundation.", media.copaCommand, "COPA displays property information alongside a map of Hong Kong"],
        ["Understand", "Use interactive dashboards, big-data analytics and an AI-ready foundation to understand asset conditions.", media.copaWall, "Digital applications and interactive displays in the COPA exhibition space"],
        ["Act", "Turn information into operational capability for safety, maintenance, energy and service improvement.", media.copaSpace, "COPA workspace with a tree-inspired interior feature"],
      ],
      features: "Platform capabilities include system and sensor integration, a common data environment, interactive dashboards, secure data management and future expansion.",
    },
    storySection: { title: "Sustainability in estate life", body: "From food waste facilities and old fabric to safer management, change grows through practical community action.", all: "All", read: "Read story", detailTitle: "Our action", impactTitle: "The change" },
    stories: [] as Story[],
    progress: { title: "Progress shown with clear scope", body: "Every number is read with its reporting year, baseline or applicable property scope.", source: "Sources: HKHS Sustainability Report 2024/25 and Annual Report 2024/25. Each figure includes an official document link and page reference." },
    metrics: [
      { value: "31", unit: "%", label: "reduction in energy consumption", scope: "Against the 2012/13 baseline, within the selected property scope stated in the report", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "21.9", unit: "%", label: "year-on-year fall in Scope 1 and 2 emissions", scope: "2024/25, covering rental estates, managed properties, construction projects and major offices", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "16,099", unit: "tonnes", label: "materials recycled", scope: "2024/25, including metals, paper, plastics, glass, timber and textiles", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "Nearly 50", unit: "units", label: "smart food waste recycling facilities", scope: "Across 20 rental estates and one managed property", scopeKind: "property", sourceKey: "annual", sourcePage: 141 },
      { value: "25,100", unit: "hours", label: "community service", scope: "Contributed in 2024/25 by the CES Team and HKHS Academy Alumni Club", scopeKind: "organization", sourceKey: "annual", sourcePage: 144 },
      { value: "38,660", unit: "hours", label: "staff training and professional development", scope: "2024/25, for permanent and contract staff", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
    ] satisfies Metric[],
    governance: {
      title: "Responsible governance behind every step",
      body: "Clear oversight, collaboration and responsible finance make sustainability part of housing and asset decisions.",
      items: [
        ["Direction and oversight", "The Directors' Meeting and relevant working groups guide strategy, monitor performance and review priorities."],
        ["Delivery and collaboration", "Operational teams bring commitments into planning, construction, management and community service."],
        ["Transparency and accountability", "Formal reporting, clear data scopes and ongoing communication show our progress."],
      ],
    },
    videos: {
      title: "See change taking place",
      body: "Residents show how greener living becomes part of everyday estate life.",
      play: "Play video",
      note: "Use the native playback controls to watch each video.",
      items: [
        ["A weekend in the community garden", "Residents share growing experience and turn green space into a place for connection.", media.garden],
        ["Smart food waste recycling at Kwun Lung Lau", "Residents demonstrate the everyday recycling process.", media.foodWasteKll],
        ["Using a food waste recycling facility", "A more convenient experience from separation to recycling.", media.foodWasteLtt],
      ],
    },
    footer: { statement: "Sustainability is not one project. It is how we build, manage and serve communities.", copyright: "Hong Kong Housing Society", note: "Figures should be read with the reporting period, disclosure scope and official source shown." },
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
    sourceKey: "annual",
    sourcePage: 141,
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
    sourceKey: "annual",
    sourcePage: 141,
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
    title: "Turning data into property management action",
    summary: "We bring information, technology and expertise together for clearer, timely decisions.",
    detail: "COPA connects the systems, sensors, data and workflows required for property and asset management on one platform, supported by a common data environment and interactive dashboards.",
    impact: "Teams gain a clearer view of asset conditions and support continuous improvement in safety, maintenance, energy and service performance.",
    media: { type: "image", src: media.copaCommand, alt: "The COPA command centre integrating property and asset information" },
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
    sourceKey: "annual",
    sourcePage: 141,
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
    sourceKey: "annual",
    sourcePage: 141,
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
    title: "把数据转化为物业管理行动",
    summary: "我们整合信息、科技和专业知识，让管理决策更清晰、更及时。",
    detail: "COPA 在单一平台连接物业和资产管理所需的系统、传感器、数据及流程，并以共同数据环境和互动仪表板支持日常工作。",
    impact: "管理团队可更清晰掌握资产状况，支持安全、维修、能源和服务表现的持续改善。",
    media: { type: "image", src: media.copaCommand, alt: "COPA 指挥中心整合物业及资产信息" },
  },
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "brand-mark brand-mark-compact" : "brand-mark"} data-brand-status="provisional">
      <img
        src="/brand/hkhs-horizontal.png"
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

function RailCue({ activeIndex, count, label, previousLabel, nextLabel, onSelect }: RailCueProps) {
  return (
    <div className="rail-cue" aria-label={label}>
      <span className="rail-cue-label">{label}</span>
      <div className="rail-controls">
        <button type="button" onClick={() => onSelect(Math.max(0, activeIndex - 1))} disabled={activeIndex === 0} aria-label={previousLabel}>
          <CaretLeft size={18} weight="bold" aria-hidden="true" />
        </button>
        <span className="rail-count" aria-live="polite">{activeIndex + 1} / {count}</span>
        <div className="rail-dots" aria-hidden="true">
          {Array.from({ length: count }, (_, index) => <span key={index} className={index === activeIndex ? "is-active" : ""} />)}
        </div>
        <button type="button" onClick={() => onSelect(Math.min(count - 1, activeIndex + 1))} disabled={activeIndex === count - 1} aria-label={nextLabel}>
          <CaretRight size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function useRailIndex(count: number) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || typeof IntersectionObserver === "undefined") return;
    const items = Array.from(rail.children);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveIndex(items.indexOf(visible.target));
      },
      { root: rail, threshold: [0.45, 0.7] },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [count]);

  const selectIndex = (index: number) => {
    const item = railRef.current?.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActiveIndex(index);
  };

  return { railRef, activeIndex, selectIndex };
}

export function SiteExperience({ locale }: { locale: Locale }) {
  const reduceMotion = useReducedMotion();
  const c = content[locale];
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePillar, setActivePillar] = useState<PillarKey>("homes");
  const [storyFilter, setStoryFilter] = useState<"all" | PillarKey>("all");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [activeVideo, setActiveVideo] = useState(0);
  const [activeCopaStep, setActiveCopaStep] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogInnerRef = useRef<HTMLDivElement>(null);
  const pillarRailRef = useRef<HTMLDivElement>(null);
  const videoRailRef = useRef<HTMLDivElement>(null);
  const {
    railRef: journeyRailRef,
    activeIndex: journeyActiveIndex,
    selectIndex: selectJourneyIndex,
  } = useRailIndex(c.journey.items.length);

  const stories = useMemo(() => {
    if (locale === "en") return englishStories;
    if (locale === "zh-cn") return simplifiedStories;
    return [...content["zh-hk"].stories];
  }, [locale]);

  const filteredStories = storyFilter === "all" ? stories : stories.filter((story) => story.pillar === storyFilter);
  const selectedPillar = c.pillars.find((pillar) => pillar.key === activePillar) ?? c.pillars[0];
  const activePillarIndex = c.pillars.findIndex((pillar) => pillar.key === activePillar);
  const activeCopa = c.copa.steps[activeCopaStep];
  const dialogOpen = Boolean(selectedStory);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialogOpen) {
      if (dialog.open) dialog.close();
      return;
    }

    const scrollPosition = window.scrollY;
    const previousBodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    if (!dialog.open) dialog.showModal();
    if (dialogInnerRef.current) dialogInnerRef.current.scrollTop = 0;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.width = previousBodyStyles.width;
      document.body.style.overflow = previousBodyStyles.overflow;
      window.scrollTo(0, scrollPosition);
    };
  }, [dialogOpen]);

  const selectPillar = (index: number) => {
    const pillar = c.pillars[index];
    if (!pillar) return;
    setActivePillar(pillar.key);
    (pillarRailRef.current?.children[index] as HTMLElement | undefined)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  const selectVideo = (index: number) => {
    setActiveVideo(index);
    (videoRailRef.current?.children[index] as HTMLElement | undefined)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  const selectStoryByOffset = (offset: number) => {
    if (!selectedStory) return;
    const currentIndex = stories.findIndex((story) => story.slug === selectedStory.slug);
    const nextIndex = (currentIndex + offset + stories.length) % stories.length;
    setSelectedStory(stories[nextIndex]);
    if (dialogInnerRef.current) dialogInnerRef.current.scrollTop = 0;
  };

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
            <div className="pillar-tabs" role="tablist" aria-label={c.pillarPrompt} ref={pillarRailRef}>
              {c.pillars.map((pillar) => (
                <button
                  key={pillar.key}
                  type="button"
                  role="tab"
                  aria-selected={activePillar === pillar.key}
                  onClick={() => selectPillar(c.pillars.findIndex((item) => item.key === pillar.key))}
                >
                  <span>{pillar.title}</span>
                  <small>{pillar.english}</small>
                </button>
              ))}
            </div>
            <RailCue
              activeIndex={activePillarIndex}
              count={c.pillars.length}
              label={c.ui.swipe}
              previousLabel={c.ui.previous}
              nextLabel={c.ui.next}
              onSelect={selectPillar}
            />
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
          <a className="section-source-link" href={`${sourceDocuments.sustainability}#page=23`} target="_blank" rel="noreferrer">
            {c.pillarSource}<span>{c.ui.source}</span><ArrowSquareOut size={16} aria-hidden="true" />
          </a>
        </section>

        <motion.section className="journey-section" {...reveal}>
          <div className="journey-lead">
            <h2>{c.journey.title}</h2>
            <p>{c.journey.body}</p>
          </div>
          <div className="journey-track" ref={journeyRailRef}>
            {c.journey.items.map(([title, description], index) => (
              <article key={title} style={{ "--item-index": index } as React.CSSProperties}>
                <span aria-hidden="true">{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <RailCue
            activeIndex={journeyActiveIndex}
            count={c.journey.items.length}
            label={c.ui.swipe}
            previousLabel={c.ui.previous}
            nextLabel={c.ui.next}
            onSelect={selectJourneyIndex}
          />
        </motion.section>

        <section className="copa-section" id="copa">
          <div className="copa-heading">
            <div className="copa-heading-mark" aria-hidden="true"><Database size={34} weight="thin" /></div>
            <h2>{c.copa.title}</h2>
            <p>{c.copa.body}</p>
          </div>
          <div className="copa-experience">
            <AnimatePresence mode="wait">
              <motion.figure
                key={activeCopaStep}
                className="copa-visual"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32 }}
              >
                <img src={activeCopa[2]} alt={activeCopa[3]} width="2048" height="1152" loading="lazy" />
              </motion.figure>
            </AnimatePresence>
            <div className="copa-step-list" role="tablist" aria-label={c.copa.title}>
              {c.copa.steps.map(([title, description], index) => (
                <button
                  key={title}
                  type="button"
                  role="tab"
                  aria-selected={activeCopaStep === index}
                  onClick={() => setActiveCopaStep(index)}
                >
                  <strong>{title}</strong>
                  <span>{description}</span>
                </button>
              ))}
            </div>
          </div>
          <p className="copa-feature-note">{c.copa.features}</p>
        </section>

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
                    <div className="story-meta"><p className="story-place">{story.place}</p><span>{c.ui.property}</span></div>
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
                <span className={`scope-label scope-${metric.scopeKind}`}>{metric.scopeKind === "property" ? c.ui.property : c.ui.organization}</span>
                <div className="metric-value"><strong>{metric.value}</strong><span>{metric.unit}</span></div>
                <h3>{metric.label}</h3>
                <p>{metric.scope}</p>
                <a className="metric-source" href={`${sourceDocuments[metric.sourceKey]}#page=${metric.sourcePage}`} target="_blank" rel="noreferrer">
                  <span>{c.ui.source}</span>
                  <small>{metric.sourceKey === "annual" ? c.ui.annualReport : c.ui.sustainabilityReport}<br />{c.ui.reportPage}{metric.sourcePage}{c.ui.pageSuffix}</small>
                  <ArrowSquareOut size={16} aria-hidden="true" />
                </a>
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
            <a className="section-source-link governance-source" href={`${sourceDocuments.sustainability}#page=12`} target="_blank" rel="noreferrer">
              <span>{c.ui.source}</span><ArrowSquareOut size={16} aria-hidden="true" />
            </a>
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
              {/* Captions will be connected when the approved transcripts are provided. */}
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video key={c.videos.items[activeVideo][2]} controls playsInline preload="metadata" aria-label={c.videos.items[activeVideo][0]}>
                <source src={c.videos.items[activeVideo][2]} type="video/mp4" />
              </video>
              <p>{c.videos.note}</p>
            </div>
            <div className="video-selector" ref={videoRailRef}>
              {c.videos.items.map(([title, description], index) => (
                <button key={title} type="button" className={activeVideo === index ? "is-active" : ""} onClick={() => selectVideo(index)}>
                  <span className="play-icon"><Play size={18} weight="fill" aria-hidden="true" /></span>
                  <span><strong>{title}</strong><small>{description}</small></span>
                </button>
              ))}
            </div>
            <RailCue
              activeIndex={activeVideo}
              count={c.videos.items.length}
              label={c.ui.swipe}
              previousLabel={c.ui.previous}
              nextLabel={c.ui.next}
              onSelect={selectVideo}
            />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <img src="/brand/hkhs-vertical.png" alt="Hong Kong Housing Society 香港房屋協會" width="1658" height="1260" data-brand-status="provisional" />
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
          <>
            <button className="dialog-close" type="button" onClick={() => setSelectedStory(null)} aria-label={c.nav.close}>
              <X size={23} aria-hidden="true" />
            </button>
            <div className="dialog-inner" ref={dialogInnerRef}>
            <div className="dialog-media"><StoryVisual media={selectedStory.media} /></div>
            <div className="dialog-copy">
              <div className="story-meta"><p className="story-place">{selectedStory.place}</p><span>{c.ui.property}</span></div>
              <h2>{selectedStory.title}</h2>
              <h3>{c.storySection.detailTitle}</h3>
              <p>{selectedStory.detail}</p>
              <h3>{c.storySection.impactTitle}</h3>
              <p>{selectedStory.impact}</p>
              {selectedStory.sourceKey && selectedStory.sourcePage && (
                <a className="dialog-source" href={`${sourceDocuments[selectedStory.sourceKey]}#page=${selectedStory.sourcePage}`} target="_blank" rel="noreferrer">
                  <span>{c.ui.source}</span>
                  <small>{selectedStory.sourceKey === "annual" ? c.ui.annualReport : c.ui.sustainabilityReport}<br />{c.ui.reportPage}{selectedStory.sourcePage}{c.ui.pageSuffix}</small>
                  <ArrowSquareOut size={17} aria-hidden="true" />
                </a>
              )}
              <div className="dialog-story-nav">
                <button type="button" onClick={() => selectStoryByOffset(-1)}><CaretLeft size={18} aria-hidden="true" />{c.ui.previousStory}</button>
                <button type="button" onClick={() => selectStoryByOffset(1)}>{c.ui.nextStory}<CaretRight size={18} aria-hidden="true" /></button>
              </div>
            </div>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
