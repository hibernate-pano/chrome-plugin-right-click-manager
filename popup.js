import { createClient } from "@supabase/supabase-js";
import {
  DEFAULT_SEARCH_ENGINES,
  SEARCH_ENGINE_ORDER,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  WECHAT_APP_ID,
  WECHAT_REDIRECT_URI,
} from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 微信登录状态检查
let wxLoginCheckTimer = null;

// 初始化界面
async function initializeUI() {
  const user = await getCurrentUser();
  if (user) {
    showUserSection(user);
    await syncUserConfig();
  } else {
    showLoginSection();
  }
  initializeSearchEngines();
  setupAddEngineForm();
  setupLoginTabs();
}

// 显示登录区域
function showLoginSection() {
  document.getElementById("loginSection").classList.remove("hidden");
  document.getElementById("userSection").classList.add("hidden");
  document.getElementById("qrcodeSection").classList.add("hidden");
}

// 显示用户信息区域
function showUserSection(user) {
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("userSection").classList.remove("hidden");
  document.getElementById("qrcodeSection").classList.add("hidden");

  document.getElementById("userAvatar").src = user.avatar_url;
  document.getElementById("userName").textContent =
    user.user_metadata.full_name;
}

// 生成微信登录二维码
async function generateWeChatQRCode() {
  const state = Math.random().toString(36).substring(7);
  const qrUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${WECHAT_APP_ID}&redirect_uri=${encodeURIComponent(
    WECHAT_REDIRECT_URI
  )}&response_type=code&scope=snsapi_login&state=${state}`;

  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("qrcodeSection").classList.remove("hidden");

  // 生成二维码
  QRCode.toCanvas(document.getElementById("qrcode"), qrUrl);

  // 开始轮询检查登录状态
  startWxLoginCheck(state);
}

// 开始微信登录状态检查
function startWxLoginCheck(state) {
  if (wxLoginCheckTimer) {
    clearInterval(wxLoginCheckTimer);
  }

  wxLoginCheckTimer = setInterval(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (data.session) {
        clearInterval(wxLoginCheckTimer);
        const user = data.session.user;
        showUserSection(user);
        await syncUserConfig();
        showSyncStatus("登录成功");
      }
    } catch (error) {
      console.error("Error checking wx login status:", error);
    }
  }, 2000);

  // 5分钟后停止检查
  setTimeout(() => {
    if (wxLoginCheckTimer) {
      clearInterval(wxLoginCheckTimer);
      showLoginSection();
      alert("登录超时，请重试");
    }
  }, 300000);
}

// 显示同步状态
function showSyncStatus(message, type = "info") {
  const statusDiv = document.getElementById("syncStatus");
  if (!statusDiv) {
    const div = document.createElement("div");
    div.id = "syncStatus";
    div.className = `sync-status ${type}`;
    document.body.appendChild(div);
  }

  statusDiv.textContent = message;
  statusDiv.className = `sync-status ${type}`;

  setTimeout(() => {
    statusDiv.className = "sync-status hidden";
  }, 3000);
}

// 同步用户配置到本地
async function syncUserConfig(retryCount = 3) {
  try {
    showSyncStatus("正在同步配置...");

    const { data: userConfig, error } = await supabase
      .from("user_configs")
      .select("config")
      .single();

    if (error) throw error;

    if (userConfig) {
      // 合并本地配置和服务器配置
      const localConfig = await chrome.storage.sync.get(null);
      const mergedConfig = mergeConfigurations(localConfig, userConfig.config);

      // 更新本地存储
      await chrome.storage.sync.set(mergedConfig);

      // 重新初始化搜索引擎列表
      initializeSearchEngines();

      // 更新上下文菜单
      chrome.runtime.sendMessage({ type: "updateContextMenus" });

      showSyncStatus("配置同步成功", "success");
    }
  } catch (error) {
    console.error("Error syncing user config:", error);
    showSyncStatus("配置同步失败", "error");

    // 重试机制
    if (retryCount > 0) {
      setTimeout(() => syncUserConfig(retryCount - 1), 1000);
    }
  }
}

// 合并配置
function mergeConfigurations(local, remote) {
  const merged = {
    searchEngines: { ...DEFAULT_SEARCH_ENGINES },
    engineOrder: [...SEARCH_ENGINE_ORDER],
  };

  // 合并本地配置
  if (local.searchEngines) {
    merged.searchEngines = { ...merged.searchEngines, ...local.searchEngines };
    if (local.engineOrder) {
      merged.engineOrder = mergeOrder(merged.engineOrder, local.engineOrder);
    }
  }

  // 合并远程配置
  if (remote.searchEngines) {
    merged.searchEngines = { ...merged.searchEngines, ...remote.searchEngines };
    if (remote.engineOrder) {
      merged.engineOrder = mergeOrder(merged.engineOrder, remote.engineOrder);
    }
  }

  return merged;
}

// 合并搜索引擎顺序
function mergeOrder(baseOrder, newOrder) {
  // 保留所有基础顺序中的项
  const merged = [...baseOrder];

  // 添加新顺序中的独特项
  newOrder.forEach((url) => {
    if (!merged.includes(url)) {
      merged.push(url);
    }
  });

  return merged;
}

// 保存配置到 Supabase
async function saveConfigToSupabase(retryCount = 3) {
  try {
    showSyncStatus("正在保存配置...");

    const user = await getCurrentUser();
    if (user) {
      const config = await chrome.storage.sync.get(null);
      const { error } = await supabase.from("user_configs").upsert({
        user_id: user.id,
        config: config,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      showSyncStatus("配置保存成功", "success");
    }
  } catch (error) {
    console.error("Error saving config to Supabase:", error);
    showSyncStatus("配置保存失败", "error");

    // 重试机制
    if (retryCount > 0) {
      setTimeout(() => saveConfigToSupabase(retryCount - 1), 1000);
    }
  }
}

// 检查登录状态
async function checkLoginStatus() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error checking login status:", error);
    return false;
  }

  if (session) {
    showUserSection(session.user);
    await syncUserConfig();
    return true;
  }

  return false;
}

// 获取当前登录用户
async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// 设置登录标签页切换
function setupLoginTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 移除所有活动状态
      tabBtns.forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(".login-panel")
        .forEach((p) => p.classList.add("hidden"));

      // 设置当前活动标签
      btn.classList.add("active");
      const tabId = btn.dataset.tab;
      document.getElementById(`${tabId}Login`).classList.remove("hidden");
    });
  });
}

// 发送验证码
async function sendVerificationCode() {
  const email = document.getElementById("emailInput").value;
  if (!isValidEmail(email)) {
    alert("请输入有效的邮箱地址");
    return;
  }

  try {
    const btn = document.getElementById("sendCodeBtn");
    btn.disabled = true;

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) throw error;

    // 开始倒计时
    let countdown = 60;
    btn.textContent = `${countdown}秒后重试`;

    const timer = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(timer);
        btn.disabled = false;
        btn.textContent = "发送验证码";
      } else {
        btn.textContent = `${countdown}秒后重试`;
      }
    }, 1000);

    alert("验证码已发送到您的邮箱");
  } catch (error) {
    console.error("Error sending verification code:", error);
    alert("发送验证码失败，请稍后重试");
    document.getElementById("sendCodeBtn").disabled = false;
  }
}

// 验证邮箱格式
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 邮箱验证码登录
async function handleEmailLogin() {
  const email = document.getElementById("emailInput").value;
  const code = document.getElementById("codeInput").value;

  if (!email || !code) {
    alert("请输入邮箱和验证码");
    return;
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error) throw error;

    // 登录成功
    showUserSection(data.user);
    await syncUserConfig();
  } catch (error) {
    console.error("Error logging in:", error);
    alert("登录失败，请检查验证码是否正确");
  }
}

// 事件监听
document.addEventListener("DOMContentLoaded", async () => {
  // 检查登录状态
  const isLoggedIn = await checkLoginStatus();

  if (!isLoggedIn) {
    showLoginSection();
  }

  initializeUI();

  // 添加事件监听
  document
    .getElementById("loginBtn")
    .addEventListener("click", generateWeChatQRCode);
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    clearInterval(wxLoginCheckTimer);
    showLoginSection();
    showSyncStatus("已退出登录");
  });

  document
    .getElementById("sendCodeBtn")
    .addEventListener("click", sendVerificationCode);
  document
    .getElementById("emailLoginBtn")
    .addEventListener("click", handleEmailLogin);

  // 添加配置变更监听
  chrome.storage.onChanged.addListener(async (changes, namespace) => {
    if (namespace === "sync") {
      const user = await getCurrentUser();
      if (user) {
        await saveConfigToSupabase();
      }
    }
  });
});
