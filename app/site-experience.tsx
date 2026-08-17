"use client";

import {
  ArrowRight,
  ArrowSquareOut,
  Buildings,
  CaretLeft,
  CaretRight,
  ChartLineUp,
  Cpu,
  HouseLine,
  Leaf,
  List,
  Play,
  Recycle,
  Sun,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import estateActionRecords from "../content/estate-actions.json";
import videoRecords from "../content/videos.json";

type Locale = "zh-hk" | "zh-cn" | "en";
type PillarKey = "homes" | "carbon" | "future";
type ActionKey = "environment" | "social" | "governance";
type StoryMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; alt: string }
  | { type: "graphic"; variant: "solar" | "community"; alt: string }
  | { type: "empty"; alt: string };

type Pillar = {
  key: PillarKey;
  title: string;
  english: string;
  description: string;
  action: string;
};

type Story = {
  contentId: string;
  slug: string;
  pillar: PillarKey;
  action: ActionKey;
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

type EstateActionRecord = {
  id: string;
  slug: string;
  pillar: PillarKey;
  action: ActionKey;
  image: string | null;
  sourceKey: "sustainability" | "annual" | null;
  sourcePage: number | null;
  locales: Record<Locale, {
    place: string;
    title: string;
    summary: string;
    detail: string;
    impact: string;
    alt: string;
  }>;
};

type VideoRecord = {
  id: string;
  src: string;
  poster: string;
  mime: "video/mp4" | "video/quicktime";
  locales: Record<Locale, { title: string; description: string }>;
};

type VideoItem = {
  id: string;
  title: string;
  description: string;
  src: string;
  poster: string;
  mime: "video/mp4" | "video/quicktime";
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

const siteBasePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? "";
const publicPath = (path: string) => `${siteBasePath}${path}`;

const media = {
  reuseHero: publicPath("/media/photos/kll-reuse-hero.jpg"),
  reuseDetail: publicPath("/media/photos/kll-reuse-detail-1.jpg"),
  reusePortrait: publicPath("/media/photos/kll-reuse-detail-2.jpg"),
  foodWaste: publicPath("/media/feedback2/estate-food-waste.webp"),
  clothesRecycling: publicPath("/media/feedback2/estate-clothes-recycling.webp"),
  smartRecycling: publicPath("/media/feedback2/estate-smart-recycling.webp"),
  recyclingStation: publicPath("/media/feedback2/estate-recycling-station.webp"),
  solarMosquito: publicPath("/media/feedback2/estate-solar-mosquito.webp"),
  solarMosquitoNight: publicPath("/media/feedback2/estate-solar-mosquito-night.webp"),
  communityArt: publicPath("/media/feedback2/estate-community-art.webp"),
  evCharging: publicPath("/media/feedback2/estate-ev-charging.webp"),
  inclusivePlay: publicPath("/media/feedback2/estate-inclusive-play.webp"),
  hsLiving: publicPath("/media/feedback4/hs-living.webp"),
  renewableWind: publicPath("/media/feedback4/renewable-wind.webp"),
  smartMosquito: publicPath("/media/feedback4/smart-mosquito.webp"),
  smartFoodWaste: publicPath("/media/feedback4/smart-food-waste.webp"),
};

const buildEstateStories = (locale: Locale): Story[] =>
  (estateActionRecords as EstateActionRecord[]).map((record) => {
    const copy = record.locales[locale];
    return {
      contentId: record.id,
      slug: record.slug,
      pillar: record.pillar,
      action: record.action,
      place: copy.place,
      title: copy.title,
      summary: copy.summary,
      detail: copy.detail,
      impact: copy.impact,
      media: record.image
        ? { type: "image", src: publicPath(record.image), alt: copy.alt }
        : { type: "empty", alt: "" },
      sourceKey: record.sourceKey ?? undefined,
      sourcePage: record.sourcePage ?? undefined,
    };
  });

const buildVideoItems = (locale: Locale): VideoItem[] =>
  (videoRecords as VideoRecord[]).map((record) => ({
    id: record.id,
    title: record.locales[locale].title,
    description: record.locales[locale].description,
    src: publicPath(record.src),
    poster: publicPath(record.poster),
    mime: record.mime,
  }));

const content = {
  "zh-hk": {
    htmlLang: "zh-HK",
    nav: {
      home: "首頁",
      stories: "屋邨行動",
      progress: "進展",
      videos: "影片",
      pillars: "三大支柱",
      menu: "開啟選單",
      close: "關閉",
    },
    brand: {
      division: "香港房屋協會 物業管理部門",
      full: "Hong Kong Housing Society Property Management Division",
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
      journeyProgress: "頁面進度",
    },
    hero: {
      eyebrow: "香港房屋協會-物業管理部門 可持續發展",
      title: "創建宜居．永續共融",
      body: "我們在物業管理和社區日常中落實可持續發展，與居民共建更宜居、更低碳的未來。",
      cta: "探索屋邨行動",
      secondary: "觀看屋邨 ESG 實踐視頻",
      imageAlt: "屋邨內的共融遊樂及休憩空間",
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
    storySection: {
      title: "物業管理，讓可持續發展在屋邨發生",
      body: "從環境、社會及管治三個範疇，探索物業管理團隊在屋邨的實際工作。",
      all: "全部",
      read: "閱讀故事",
      detailTitle: "我們的行動",
      impactTitle: "帶來的改變",
      actionPrompt: "選擇屋邨行動主題",
      actions: { environment: "環境", social: "社會", governance: "管治" },
    },
    stories: [] as Story[],
    /* Legacy inline records kept temporarily for comparison. Live estate actions
       are loaded from content/estate-actions.json. Remove this block after the
       first content-studio review cycle.
    stories: [
      {
        slug: "smart-recycling-hub",
        pillar: "carbon",
        action: "environment",
        place: "20 個出租屋邨",
        title: "智能回收，讓分類走進日常",
        summary: "廚餘、舊衣和多類可回收物各有清楚去向，讓屋邨分類更便利。",
        detail: "物業管理團隊按屋邨環境整合智能廚餘機、衣物回收箱，以及金屬、塑膠、紙張和玻璃分類設施，並以清楚標示和日常管理支援居民參與。",
        impact: "近 50 部智能廚餘回收機已設於 20 個出租屋邨，並與其他分類設施共同支援資源循環。",
        media: { type: "image", src: media.smartFoodWaste, alt: "出租屋邨設置的智能廚餘回收設施" },
        sourceKey: "annual",
        sourcePage: 141,
      },
      {
        slug: "renewable-energy",
        pillar: "carbon",
        action: "environment",
        place: "出租屋邨",
        title: "在屋邨採集潔淨能源",
        summary: "太陽能和風力設備把公共空間轉化為可再生能源的實踐場景。",
        detail: "房協在合適屋邨設置太陽能光伏系統，並在觀龍樓應用風力發電，將可再生能源融入物業營運。",
        impact: "截至 2024/25 年度，10 個出租屋邨設有太陽能光伏系統。",
        media: { type: "image", src: media.renewableWind, alt: "觀龍樓的風力發電設備" },
        sourceKey: "annual",
        sourcePage: 141,
      },
      {
        slug: "intergenerational-community",
        pillar: "homes",
        action: "community",
        place: "跨代社區",
        title: "讓不同世代共享生活空間",
        summary: "共融設施和社區活動回應長者、家庭及不同居民的生活需要。",
        detail: "房協從空間、設施和活動三方面推動跨代交流，讓居民在日常生活中建立互助和連繫。",
        impact: "設計不只處理通行和使用需要，也重視尊重、參與和社區歸屬感。",
        media: { type: "image", src: media.inclusivePlay, alt: "屋邨內色彩清晰的長幼共融遊樂空間" },
      },
      {
        slug: "community-art",
        pillar: "homes",
        action: "community",
        place: "屋邨公共空間",
        title: "把社區故事帶進日常空間",
        summary: "以街坊創作和地方特色豐富公共空間，讓屋邨環境更具歸屬感。",
        detail: "物業管理不只照顧設施運作，也透過合適的社區藝術和展示，把地方記憶融入居民每天經過的空間。",
        impact: "公共空間兼具使用功能和社區特色，支持居民建立對居住環境的認同。",
        media: { type: "image", src: media.communityArt, alt: "屋邨公共空間展示以漁光竹映為題的街坊創作" },
      },
      {
        slug: "ev-charging",
        pillar: "carbon",
        action: "environment",
        place: "屋邨停車場",
        title: "為低碳出行準備充電設施",
        summary: "在合適停車位置配置充電設備，配合交通電動化的長遠需要。",
        detail: "物業管理團隊按場地條件和使用需要規劃充電設施，並把設備安全、維護和日常運作納入管理。",
        impact: "逐步完善屋邨低碳出行配套，也為未來資產管理建立實務經驗。",
        media: { type: "image", src: media.evCharging, alt: "屋邨停車位置旁的電動車充電設備" },
      },
      {
        slug: "geoai-mosquito-control",
        pillar: "future",
        action: "innovation",
        place: "觀龍樓等屋邨",
        title: "以智能監測支援精準防蚊",
        summary: "智能滅蚊燈和氣象資料協助團隊掌握環境變化，提早部署防蚊工作。",
        detail: "物業管理團隊與科研機構合作，在觀龍樓等屋邨安裝智能滅蚊燈及氣象站，透過數據辨識蚊種及預測短期蚊患趨勢。",
        impact: "環境管理由定期處理走向更具針對性的部署，提升屋邨防蚊工作的效率。",
        media: { type: "image", src: media.smartMosquito, alt: "屋邨園景內的智能滅蚊及環境監測設備" },
      },
      {
        slug: "hs-living-service",
        pillar: "future",
        action: "service",
        place: "屋邨數碼服務",
        title: "一站式資訊，連繫屋邨生活",
        summary: "居民可透過手機應用程式查閱屋邨資訊、接收通知及報名參與活動。",
        detail: "HS Living 及房協屋邨資訊手機應用程式把常用屋邨資訊和服務帶到流動裝置，讓居民更便捷地了解日常安排及社區活動。",
        impact: "資訊傳達更及時，亦減少紙本通告的需要，支持居民參與和綠色生活。",
        media: { type: "image", src: media.hsLiving, alt: "HS Living 手機應用程式畫面" },
      },
    ] satisfies Story[],
    */
    progress: {
      title: "以量化成果，呈現我們的進展。",
      body: "",
      source: "資料來源：香港房屋協會 2024/25 可持續發展報告及年度報告。",
    },
    metrics: [
      { value: "31", unit: "%", label: "能源消耗減少", scope: "相對 2012/13 基準，按正式報告所列選定物業範圍", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "21.9", unit: "%", label: "範疇一及二碳排放按年下降", scope: "2024/25，涵蓋出租屋邨、管理物業、建築項目及主要辦公室", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "16,099", unit: "公噸", label: "回收物料", scope: "2024/25 年度，包括金屬、紙張、塑膠、玻璃、木材及紡織物", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "近 50", unit: "部", label: "智能廚餘回收設施", scope: "設於 20 個出租屋邨", scopeKind: "property", sourceKey: "annual", sourcePage: 141 },
      { value: "25,100", unit: "小時", label: "社區服務", scope: "2024/25，由房協友里團隊及房協學院舊生會共同貢獻", scopeKind: "organization", sourceKey: "annual", sourcePage: 144 },
      { value: "38,660", unit: "小時", label: "員工培訓及專業發展", scope: "2024/25，適用於長期及固定任期員工", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
    ] satisfies Metric[],
    videos: {
      title: "看見社區中的改變",
      body: "透過屋邨片段，了解綠色生活、共融社區和智慧管理如何在日常發生。",
      play: "播放影片",
      note: "可使用原生播放控制觀看影片。",
      items: [] as [string, string, string][],
    },
    footer: {
      statement: "可持續發展不是單一項目，而是我們建造、管理和服務社區的方式。",
      copyright: "香港房屋協會 物業管理部門",
    },
  },
  "zh-cn": {
    htmlLang: "zh-CN",
    nav: { home: "首页", stories: "屋邨行动", progress: "进展", videos: "视频", pillars: "三大支柱", menu: "打开菜单", close: "关闭" },
    brand: { division: "香港房屋协会 物业管理部门", full: "Hong Kong Housing Society Property Management Division" },
    ui: {
      swipe: "左右滑动查看更多", previous: "上一项", next: "下一项", source: "查看正式来源", reportPage: "PDF 第", pageSuffix: "页",
      organization: "房协整体", property: "物业管理实践", sustainabilityReport: "香港房屋协会 2024/25 可持续发展报告", annualReport: "香港房屋协会 2024/25 年度报告",
      previousStory: "上一个故事", nextStory: "下一个故事", journeyProgress: "页面进度",
    },
    hero: {
      eyebrow: "香港房屋协会-物业管理部门 可持续发展",
      title: "创建宜居．永续共融",
      body: "我们在物业管理和社区日常中落实可持续发展，与居民共建更宜居、更低碳的未来。",
      cta: "探索屋邨行动",
      secondary: "观看屋邨 ESG 实践视频",
      imageAlt: "屋邨内的共融游乐及休憩空间",
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
    storySection: {
      title: "物业管理，让可持续发展在屋邨发生",
      body: "从环境、社会及管治三个范畴，探索物业管理团队在屋邨的实际工作。",
      all: "全部", read: "阅读故事", detailTitle: "我们的行动", impactTitle: "带来的改变", actionPrompt: "选择屋邨行动主题",
      actions: { environment: "环境", social: "社会", governance: "管治" },
    },
    stories: [] as Story[],
    progress: { title: "以量化成果，呈现我们的进展。", body: "", source: "资料来源：香港房屋协会 2024/25 可持续发展报告及年度报告。" },
    metrics: [
      { value: "31", unit: "%", label: "能源消耗减少", scope: "相对 2012/13 基准，按正式报告所列选定物业范围", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "21.9", unit: "%", label: "范围一及二碳排放按年下降", scope: "2024/25，涵盖出租屋邨、管理物业、建筑项目及主要办公室", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "16,099", unit: "公吨", label: "回收物料", scope: "2024/25 年度，包括金属、纸张、塑料、玻璃、木材及纺织物", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "近 50", unit: "部", label: "智能厨余回收设施", scope: "设于 20 个出租屋邨", scopeKind: "property", sourceKey: "annual", sourcePage: 141 },
      { value: "25,100", unit: "小时", label: "社区服务", scope: "2024/25，由房协友里团队及房协学院旧生会共同贡献", scopeKind: "organization", sourceKey: "annual", sourcePage: 144 },
      { value: "38,660", unit: "小时", label: "员工培训及专业发展", scope: "2024/25，适用于长期及固定任期员工", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
    ] satisfies Metric[],
    videos: {
      title: "看见社区中的改变",
      body: "透过屋邨片段，了解绿色生活、共融社区和智慧管理如何在日常发生。",
      play: "播放视频",
      note: "可使用原生播放控制观看视频。",
      items: [] as [string, string, string][],
    },
    footer: { statement: "可持续发展不是单一项目，而是我们建造、管理和服务社区的方式。", copyright: "香港房屋协会 物业管理部门" },
  },
  en: {
    htmlLang: "en",
    nav: { home: "Home", stories: "Estate action", progress: "Progress", videos: "Videos", pillars: "Our pillars", menu: "Open menu", close: "Close" },
    brand: { division: "香港房屋協會 物業管理部門", full: "Hong Kong Housing Society Property Management Division" },
    ui: {
      swipe: "Swipe to explore", previous: "Previous", next: "Next", source: "View official source", reportPage: "PDF page ", pageSuffix: "",
      organization: "HKHS-wide", property: "Property management practice", sustainabilityReport: "HKHS Sustainability Report 2024/25", annualReport: "HKHS Annual Report 2024/25",
      previousStory: "Previous story", nextStory: "Next story", journeyProgress: "Page progress",
    },
    hero: {
      eyebrow: "HKHS Property Management Division Sustainability",
      title: "Creating Homes for Sustainable Living",
      body: "We put sustainability into practice through property management and community life, building a liveable, low-carbon future with residents.",
      cta: "Explore estate action",
      secondary: "Watch estate ESG practices in action",
      imageAlt: "An inclusive play and resting space on an estate",
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
    storySection: {
      title: "Property management makes sustainability tangible",
      body: "Explore how property management puts environmental, social and governance principles into practice across our estates.",
      all: "All", read: "Read story", detailTitle: "Our action", impactTitle: "The change", actionPrompt: "Choose an estate action theme",
      actions: { environment: "Environment", social: "Social", governance: "Governance" },
    },
    stories: [] as Story[],
    progress: { title: "Presenting our progress through measurable results.", body: "", source: "Sources: HKHS Sustainability Report 2024/25 and Annual Report 2024/25." },
    metrics: [
      { value: "31", unit: "%", label: "reduction in energy consumption", scope: "Against the 2012/13 baseline, within the selected property scope stated in the report", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "21.9", unit: "%", label: "year-on-year fall in Scope 1 and 2 emissions", scope: "2024/25, covering rental estates, managed properties, construction projects and major offices", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "16,099", unit: "tonnes", label: "materials recycled", scope: "2024/25, including metals, paper, plastics, glass, timber and textiles", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
      { value: "Nearly 50", unit: "units", label: "smart food waste recycling facilities", scope: "Across 20 rental estates", scopeKind: "property", sourceKey: "annual", sourcePage: 141 },
      { value: "25,100", unit: "hours", label: "community service", scope: "Contributed in 2024/25 by the CES Team and HKHS Academy Alumni Club", scopeKind: "organization", sourceKey: "annual", sourcePage: 144 },
      { value: "38,660", unit: "hours", label: "staff training and professional development", scope: "2024/25, for permanent and contract staff", scopeKind: "organization", sourceKey: "sustainability", sourcePage: 9 },
    ] satisfies Metric[],
    videos: {
      title: "See change taking place",
      body: "Estate stories show how greener living, inclusive communities and smarter management become part of everyday life.",
      play: "Play video",
      note: "Use the native playback controls to watch each video.",
      items: [] as [string, string, string][],
    },
    footer: { statement: "Sustainability is not one project. It is how we build, manage and serve communities.", copyright: "Hong Kong Housing Society Property Management Division" },
  },
} as const;

/* Legacy inline translations kept temporarily for comparison. Live estate
   actions are loaded from content/estate-actions.json.
const englishStories: Story[] = [
  {
    slug: "smart-recycling-hub",
    pillar: "carbon",
    action: "environment",
    place: "20 rental estates",
    title: "Smart recycling for everyday sorting",
    summary: "Food waste, used clothing and common recyclables each have a clearer route across estate life.",
    detail: "Property management teams bring together smart food waste bins, clothes collection and facilities for metal, plastic, paper and glass, supported by clear signs and daily management.",
    impact: "Nearly 50 smart food waste recycling bins serve 20 rental estates alongside other recycling facilities.",
    media: { type: "image", src: media.smartFoodWaste, alt: "A smart food waste recycling facility at a rental estate" },
    sourceKey: "annual",
    sourcePage: 141,
  },
  {
    slug: "renewable-energy",
    pillar: "carbon",
    action: "environment",
    place: "Rental estates",
    title: "Harvesting cleaner energy on estates",
    summary: "Solar and wind installations turn shared spaces into practical renewable energy sites.",
    detail: "HKHS installs solar photovoltaic systems at suitable estates and uses wind generation at Kwun Lung Lau, integrating renewables into operations.",
    impact: "By 2024/25, solar photovoltaic systems were installed at 10 rental estates.",
    media: { type: "image", src: media.renewableWind, alt: "Wind generation equipment at Kwun Lung Lau" },
    sourceKey: "annual",
    sourcePage: 141,
  },
  {
    slug: "intergenerational-community",
    pillar: "homes",
    action: "community",
    place: "Intergenerational community",
    title: "Shared spaces for every generation",
    summary: "Inclusive facilities and activities respond to older people, families and diverse residents.",
    detail: "HKHS promotes intergenerational connection through spaces, facilities and activities that encourage residents to meet and support one another.",
    impact: "Design addresses access and use while strengthening respect, participation and belonging.",
    media: { type: "image", src: media.inclusivePlay, alt: "A colourful inclusive play space on an estate" },
  },
  {
    slug: "community-art",
    pillar: "homes",
    action: "community",
    place: "Estate shared space",
    title: "Bringing community stories into shared space",
    summary: "Resident creativity and local character can enrich everyday estate environments.",
    detail: "Property management supports functional shared spaces while suitable community art and displays bring local memories into residents' daily routes.",
    impact: "Shared areas can serve practical needs and express a stronger sense of place and belonging.",
    media: { type: "image", src: media.communityArt, alt: "Community artwork displayed in an estate shared space" },
  },
  {
    slug: "ev-charging",
    pillar: "carbon",
    action: "environment",
    place: "Estate car park",
    title: "Preparing charging facilities for lower-carbon travel",
    summary: "Charging equipment at suitable parking spaces supports the longer-term transition to electric mobility.",
    detail: "Property management teams plan charging around site conditions and user needs, while including safety, maintenance and operation in daily management.",
    impact: "The facilities strengthen lower-carbon transport readiness and build practical asset management experience.",
    media: { type: "image", src: media.evCharging, alt: "Electric vehicle charging equipment beside an estate parking space" },
  },
  {
    slug: "geoai-mosquito-control",
    pillar: "future",
    action: "innovation",
    place: "Kwun Lung Lau and other estates",
    title: "Using smart monitoring for targeted mosquito control",
    summary: "Smart mosquito traps and weather data help teams track environmental change and plan earlier action.",
    detail: "Property management teams work with research partners to install smart mosquito traps and weather stations, using data to identify species and forecast short-term mosquito activity.",
    impact: "Estate hygiene work becomes more targeted and responsive to local conditions.",
    media: { type: "image", src: media.smartMosquito, alt: "Smart mosquito-control and environmental monitoring equipment in an estate landscape" },
  },
  {
    slug: "hs-living-service",
    pillar: "future",
    action: "service",
    place: "Estate digital services",
    title: "One place for everyday estate information",
    summary: "Residents can view estate information, receive notices and register for activities on their phones.",
    detail: "The HS Living and estate information apps bring frequently used information and services to mobile devices, helping residents keep up with everyday arrangements and community activities.",
    impact: "Information reaches residents sooner, with less reliance on paper notices and more convenient participation.",
    media: { type: "image", src: media.hsLiving, alt: "HS Living mobile application screens" },
  },
];

const simplifiedStories: Story[] = [
  {
    slug: "smart-recycling-hub",
    pillar: "carbon",
    action: "environment",
    place: "20 个出租屋邨",
    title: "智能回收，让分类走进日常",
    summary: "厨余、旧衣和多类可回收物各有清楚去向，让屋邨分类更便利。",
    detail: "物业管理团队按屋邨环境整合智能厨余机、衣物回收箱，以及金属、塑料、纸张和玻璃分类设施，并以清楚标示和日常管理支持居民参与。",
    impact: "近 50 部智能厨余回收机已设于 20 个出租屋邨，并与其他分类设施共同支持资源循环。",
    media: { type: "image", src: media.smartFoodWaste, alt: "出租屋邨设置的智能厨余回收设施" },
    sourceKey: "annual",
    sourcePage: 141,
  },
  {
    slug: "renewable-energy",
    pillar: "carbon",
    action: "environment",
    place: "出租屋邨",
    title: "在屋邨采集洁净能源",
    summary: "太阳能和风力设备把公共空间转化为可再生能源的实践场景。",
    detail: "房协在合适屋邨设置太阳能光伏系统，并在观龙楼应用风力发电，将可再生能源融入物业营运。",
    impact: "截至 2024/25 年度，10 个出租屋邨设有太阳能光伏系统。",
    media: { type: "image", src: media.renewableWind, alt: "观龙楼的风力发电设备" },
    sourceKey: "annual",
    sourcePage: 141,
  },
  {
    slug: "intergenerational-community",
    pillar: "homes",
    action: "community",
    place: "跨代社区",
    title: "让不同世代共享生活空间",
    summary: "共融设施和社区活动回应长者、家庭及不同居民的生活需要。",
    detail: "房协从空间、设施和活动三方面推动跨代交流，让居民在日常生活中建立互助和连系。",
    impact: "设计不只处理通行和使用需要，也重视尊重、参与和社区归属感。",
    media: { type: "image", src: media.inclusivePlay, alt: "屋邨内色彩清晰的长幼共融游乐空间" },
  },
  {
    slug: "community-art",
    pillar: "homes",
    action: "community",
    place: "屋邨公共空间",
    title: "把社区故事带进日常空间",
    summary: "以街坊创作和地方特色丰富公共空间，让屋邨环境更具归属感。",
    detail: "物业管理不只照顾设施运作，也透过合适的社区艺术和展示，把地方记忆融入居民每天经过的空间。",
    impact: "公共空间兼具使用功能和社区特色，支持居民建立对居住环境的认同。",
    media: { type: "image", src: media.communityArt, alt: "屋邨公共空间展示以渔光竹映为题的街坊创作" },
  },
  {
    slug: "ev-charging",
    pillar: "carbon",
    action: "environment",
    place: "屋邨停车场",
    title: "为低碳出行准备充电设施",
    summary: "在合适停车位置配置充电设备，配合交通电动化的长远需要。",
    detail: "物业管理团队按场地条件和使用需要规划充电设施，并把设备安全、维护和日常运作纳入管理。",
    impact: "逐步完善屋邨低碳出行配套，也为未来资产管理建立实务经验。",
    media: { type: "image", src: media.evCharging, alt: "屋邨停车位置旁的电动车充电设备" },
  },
  {
    slug: "geoai-mosquito-control",
    pillar: "future",
    action: "innovation",
    place: "观龙楼等屋邨",
    title: "以智能监测支持精准防蚊",
    summary: "智能灭蚊灯和气象数据协助团队掌握环境变化，提早部署防蚊工作。",
    detail: "物业管理团队与科研机构合作，在观龙楼等屋邨安装智能灭蚊灯及气象站，透过数据辨识蚊种及预测短期蚊患趋势。",
    impact: "环境管理由定期处理走向更具针对性的部署，提升屋邨防蚊工作的效率。",
    media: { type: "image", src: media.smartMosquito, alt: "屋邨园景内的智能灭蚊及环境监测设备" },
  },
  {
    slug: "hs-living-service",
    pillar: "future",
    action: "service",
    place: "屋邨数码服务",
    title: "一站式信息，连系屋邨生活",
    summary: "居民可透过手机应用程序查阅屋邨信息、接收通知及报名参与活动。",
    detail: "HS Living 及房协屋邨信息手机应用程序把常用屋邨信息和服务带到移动设备，让居民更便捷地了解日常安排及社区活动。",
    impact: "信息传达更及时，也减少纸本通告的需要，支持居民参与和绿色生活。",
    media: { type: "image", src: media.hsLiving, alt: "HS Living 手机应用程序画面" },
  },
];
*/

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "brand-mark brand-mark-compact" : "brand-mark"} data-brand-status="provisional">
      <img
        src={publicPath("/brand/hkhs-horizontal.png")}
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

  if (visual.type === "empty") {
    return <div className="story-empty-media" aria-hidden="true" />;
  }

  const Icon = visual.variant === "solar" ? Sun : UsersThree;
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

const sectionIds = ["home", "stories", "videos", "progress", "pillars"] as const;

function useSectionProgress() {
  const [activeSection, setActiveSection] = useState<(typeof sectionIds)[number]>("home");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const elements = sectionIds.map((id) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id as (typeof sectionIds)[number]);
      },
      { rootMargin: "-32% 0px -56% 0px", threshold: [0, 0.15, 0.4] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return activeSection;
}

export function SiteExperience({ locale }: { locale: Locale }) {
  const reduceMotion = useReducedMotion();
  const c = content[locale];
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePillar, setActivePillar] = useState<PillarKey>("homes");
  const [storyFilter, setStoryFilter] = useState<"all" | ActionKey>("all");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [activeVideo, setActiveVideo] = useState(0);
  const activeSection = useSectionProgress();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogInnerRef = useRef<HTMLDivElement>(null);
  const pillarRailRef = useRef<HTMLDivElement>(null);
  const videoRailRef = useRef<HTMLDivElement>(null);
  const stories = useMemo(() => {
    return buildEstateStories(locale);
  }, [locale]);
  const videoItems = useMemo(() => buildVideoItems(locale), [locale]);

  const filteredStories = storyFilter === "all" ? stories : stories.filter((story) => story.action === storyFilter);
  const selectedPillar = c.pillars.find((pillar) => pillar.key === activePillar) ?? c.pillars[0];
  const activePillarIndex = c.pillars.findIndex((pillar) => pillar.key === activePillar);
  const sectionLinks = [
    ["home", c.nav.home],
    ["stories", c.nav.stories],
    ["videos", c.nav.videos],
    ["progress", c.nav.progress],
    ["pillars", c.nav.pillars],
  ] as const;
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
        <a href={publicPath(locale === "zh-hk" ? "/" : `/${locale}`)} className="brand-link" aria-label={c.nav.home}>
          <BrandMark compact />
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#stories">{c.nav.stories}</a>
          <a href="#videos">{c.nav.videos}</a>
          <a href="#progress">{c.nav.progress}</a>
          <a href="#pillars">{c.nav.pillars}</a>
        </nav>

        <div className="header-actions">
          <div className="language-switcher" aria-label="Language">
            {languageLinks.map(([key, label]) => (
              <a key={key} href={publicPath(key === "zh-hk" ? "/zh-hk" : `/${key}`)} aria-current={locale === key ? "page" : undefined}>
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
                ["#stories", c.nav.stories],
                ["#videos", c.nav.videos],
                ["#progress", c.nav.progress],
                ["#pillars", c.nav.pillars],
              ].map(([href, label]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowRight size={22} aria-hidden="true" /></a>
              ))}
            </nav>
            <div className="language-switcher mobile-language-switcher" aria-label="Language">
              {languageLinks.map(([key, label]) => (
                <a key={key} href={publicPath(key === "zh-hk" ? "/zh-hk" : `/${key}`)} aria-current={locale === key ? "page" : undefined}>
                  {label}
                </a>
              ))}
            </div>
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
              <a className="text-link" href="#videos">{c.hero.secondary}</a>
            </div>
          </motion.div>

          <motion.figure
            className="hero-visual"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-image-wrap">
              <img src={media.inclusivePlay} alt={c.hero.imageAlt} width="1600" height="900" fetchPriority="high" />
            </div>
          </motion.figure>
        </section>

        <motion.section className="intro-section" {...reveal}>
          <div className="intro-mark" aria-hidden="true"><Leaf size={38} weight="thin" /></div>
          <h2>{c.intro.title}</h2>
          <p>{c.intro.body}</p>
        </motion.section>

        <section className="stories-section" id="stories">
          <div className="section-heading">
            <h2>{c.storySection.title}</h2>
            <p>{c.storySection.body}</p>
          </div>
          <div className="story-filters" role="group" aria-label={c.storySection.actionPrompt}>
            <button type="button" className={storyFilter === "all" ? "is-active" : ""} onClick={() => setStoryFilter("all")}>{c.storySection.all}</button>
            {(Object.entries(c.storySection.actions) as [ActionKey, string][]).map(([key, label]) => (
              <button key={key} type="button" className={storyFilter === key ? "is-active" : ""} onClick={() => setStoryFilter(key)}>{label}</button>
            ))}
          </div>
          <motion.div className="stories-grid" layout>
            <AnimatePresence mode="popLayout">
              {filteredStories.map((story, index) => (
                <motion.article
                  layout
                  key={story.slug}
                  data-content-id={story.contentId}
                  className={`story-card story-card-${index % 6} story-${story.slug}`}
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

        <section className="videos-section" id="videos">
          <div className="section-heading">
            <h2>{c.videos.title}</h2>
            <p>{c.videos.body}</p>
          </div>
          <div className="video-layout">
            <div className="video-player">
              {/* Captions will be connected when the approved transcripts are provided. */}
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video key={videoItems[activeVideo].src} controls playsInline preload="metadata" poster={videoItems[activeVideo].poster} aria-label={videoItems[activeVideo].title}>
                <source src={videoItems[activeVideo].src} type={videoItems[activeVideo].mime} />
              </video>
              <p>{c.videos.note}</p>
            </div>
            <div className="video-selector" ref={videoRailRef}>
              {videoItems.map(({ id, title, description, poster }, index) => (
                <button key={id} type="button" data-content-id={id} className={activeVideo === index ? "is-active" : ""} onClick={() => selectVideo(index)}>
                  <span className="video-thumb"><img src={poster} alt="" /><span className="play-icon"><Play size={16} weight="fill" aria-hidden="true" /></span></span>
                  <span><strong>{title}</strong><small>{description}</small></span>
                </button>
              ))}
            </div>
            <RailCue
              activeIndex={activeVideo}
              count={videoItems.length}
              label={c.ui.swipe}
              previousLabel={c.ui.previous}
              nextLabel={c.ui.next}
              onSelect={selectVideo}
            />
          </div>
        </section>

        <section className="progress-section" id="progress">
          <motion.div className="progress-heading" {...reveal}>
            <ChartLineUp size={42} weight="thin" aria-hidden="true" />
            <h2>{c.progress.title}</h2>
            {c.progress.body ? <p>{c.progress.body}</p> : null}
          </motion.div>
          <div className="metrics-grid">
            {c.metrics.map((metric, index) => (
              <motion.article key={metric.label} className={`metric metric-${index}`} {...reveal}>
                <span className={`scope-label scope-${metric.scopeKind}`}>{metric.scopeKind === "property" ? c.ui.property : c.ui.organization}</span>
                <div className="metric-value"><strong>{metric.value}</strong><span>{metric.unit}</span></div>
                <h3>{metric.label}</h3>
                <p>{metric.scope}</p>
              </motion.article>
            ))}
          </div>
          <details className="source-note">
            <summary>{c.ui.source}<ArrowSquareOut size={16} aria-hidden="true" /></summary>
            <p>{c.progress.source}</p>
            <div>
              <a href={sourceDocuments.sustainability} target="_blank" rel="noreferrer">{c.ui.sustainabilityReport}</a>
              <a href={sourceDocuments.annual} target="_blank" rel="noreferrer">{c.ui.annualReport}</a>
            </div>
          </details>
        </section>

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

      </main>

      <aside className="page-progress" aria-label={c.ui.journeyProgress}>
        <span className="page-progress-label">{sectionLinks.find(([id]) => id === activeSection)?.[1]}</span>
        <div className="page-progress-track">
          <span className="page-progress-fill" aria-hidden="true" />
          <nav aria-label={c.ui.journeyProgress}>
            {sectionLinks.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={activeSection === id ? "is-active" : ""} aria-label={label} aria-current={activeSection === id ? "location" : undefined}>
                <span aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <footer className="site-footer">
        <div className="footer-brand">
          <img src={publicPath("/brand/hkhs-vertical.png")} alt="Hong Kong Housing Society 香港房屋協會" width="1658" height="1260" data-brand-status="provisional" />
        </div>
        <div className="footer-statement">
          <p>{c.footer.statement}</p>
          <span>{c.brand.full}</span>
          <strong>{c.brand.division}</strong>
        </div>
        <div className="footer-meta">
          <p>© {new Date().getFullYear()} {c.footer.copyright}</p>
        </div>
      </footer>

      <nav className="bottom-nav" aria-label="Mobile primary navigation">
        <a href="#stories"><Buildings size={21} aria-hidden="true" /><span>{c.nav.stories}</span></a>
        <a href="#videos"><Play size={21} aria-hidden="true" /><span>{c.nav.videos}</span></a>
        <a href="#progress"><ChartLineUp size={21} aria-hidden="true" /><span>{c.nav.progress}</span></a>
        <a href="#pillars"><Leaf size={21} aria-hidden="true" /><span>{c.nav.pillars}</span></a>
      </nav>

      <dialog
        ref={dialogRef}
        className={`story-dialog ${selectedStory ? `story-${selectedStory.slug}` : ""}`}
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
