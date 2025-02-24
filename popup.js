import { createClient } from '@supabase/supabase-js'
import { DEFAULT_SEARCH_ENGINES, SEARCH_ENGINE_ORDER, SUPABASE_URL, SUPABASE_ANON_KEY, WECHAT_APP_ID, WECHAT_REDIRECT_URI } from './config.js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 初始化界面
async function initializeUI() {
    const user = await getCurrentUser()
    if (user) {
        showUserSection(user)
        await syncUserConfig()
    } else {
        showLoginSection()
    }
    initializeSearchEngines()
    setupAddEngineForm()
    setupLoginTabs()
}

// 显示登录区域
function showLoginSection() {
    document.getElementById('loginSection').classList.remove('hidden')
    document.getElementById('userSection').classList.add('hidden')
    document.getElementById('qrcodeSection').classList.add('hidden')
}

// 显示用户信息区域
function showUserSection(user) {
    document.getElementById('loginSection').classList.add('hidden')
    document.getElementById('userSection').classList.remove('hidden')
    document.getElementById('qrcodeSection').classList.add('hidden')
    
    document.getElementById('userAvatar').src = user.avatar_url
    document.getElementById('userName').textContent = user.user_metadata.full_name
}

// 生成微信登录二维码
async function generateWeChatQRCode() {
    const state = Math.random().toString(36).substring(7)
    const qrUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${WECHAT_APP_ID}&redirect_uri=${encodeURIComponent(WECHAT_REDIRECT_URI)}&response_type=code&scope=snsapi_login&state=${state}`
    
    document.getElementById('loginSection').classList.add('hidden')
    document.getElementById('qrcodeSection').classList.remove('hidden')
    
    QRCode.toCanvas(document.getElementById('qrcode'), qrUrl)
}

// 同步用户配置到本地
async function syncUserConfig() {
    try {
        const { data: userConfig } = await supabase
            .from('user_configs')
            .select('config')
            .single()
        
        if (userConfig) {
            // 合并本地配置和服务器配置
            const localConfig = await chrome.storage.sync.get(null)
            const mergedConfig = mergeConfigurations(localConfig, userConfig.config)
            
            // 更新本地存储
            await chrome.storage.sync.set(mergedConfig)
            
            // 重新初始化搜索引擎列表
            initializeSearchEngines()
            
            // 更新上下文菜单
            chrome.runtime.sendMessage({ type: 'updateContextMenus' })
        }
    } catch (error) {
        console.error('Error syncing user config:', error)
    }
}

// 合并配置
function mergeConfigurations(local, remote) {
    const merged = {
        searchEngines: { ...DEFAULT_SEARCH_ENGINES },
        engineOrder: [...SEARCH_ENGINE_ORDER]
    }

    // 合并本地配置
    if (local.searchEngines) {
        merged.searchEngines = { ...merged.searchEngines, ...local.searchEngines }
        if (local.engineOrder) {
            merged.engineOrder = mergeOrder(merged.engineOrder, local.engineOrder)
        }
    }

    // 合并远程配置
    if (remote.searchEngines) {
        merged.searchEngines = { ...merged.searchEngines, ...remote.searchEngines }
        if (remote.engineOrder) {
            merged.engineOrder = mergeOrder(merged.engineOrder, remote.engineOrder)
        }
    }

    return merged
}

// 合并搜索引擎顺序
function mergeOrder(baseOrder, newOrder) {
    // 保留所有基础顺序中的项
    const merged = [...baseOrder]
    
    // 添加新顺序中的独特项
    newOrder.forEach(url => {
        if (!merged.includes(url)) {
            merged.push(url)
        }
    })
    
    return merged
}

// 保存配置到 Supabase
async function saveConfigToSupabase() {
    try {
        const user = await getCurrentUser()
        if (user) {
            const config = await chrome.storage.sync.get(null)
            await supabase
                .from('user_configs')
                .upsert({ 
                    user_id: user.id,
                    config: config,
                    updated_at: new Date().toISOString()
                })
        }
    } catch (error) {
        console.error('Error saving config to Supabase:', error)
    }
}

// 处理搜索引擎更改
async function handleSearchEngineChange(changes) {
    // 更新本地UI
    initializeSearchEngines()
    
    // 同步到服务器
    await saveConfigToSupabase()
    
    // 更新上下文菜单
    chrome.runtime.sendMessage({ type: 'updateContextMenus' })
}

// 获取当前登录用户
async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// 设置登录标签页切换
function setupLoginTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn')
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有活动状态
            tabBtns.forEach(b => b.classList.remove('active'))
            document.querySelectorAll('.login-panel').forEach(p => p.classList.add('hidden'))
            
            // 设置当前活动标签
            btn.classList.add('active')
            const tabId = btn.dataset.tab
            document.getElementById(`${tabId}Login`).classList.remove('hidden')
        })
    })
}

// 发送验证码
async function sendVerificationCode() {
    const email = document.getElementById('emailInput').value
    if (!isValidEmail(email)) {
        alert('请输入有效的邮箱地址')
        return
    }

    try {
        const btn = document.getElementById('sendCodeBtn')
        btn.disabled = true
        
        const { error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                emailRedirectTo: window.location.origin
            }
        })

        if (error) throw error

        // 开始倒计时
        let countdown = 60
        btn.textContent = `${countdown}秒后重试`
        
        const timer = setInterval(() => {
            countdown--
            if (countdown <= 0) {
                clearInterval(timer)
                btn.disabled = false
                btn.textContent = '发送验证码'
            } else {
                btn.textContent = `${countdown}秒后重试`
            }
        }, 1000)

        alert('验证码已发送到您的邮箱')
    } catch (error) {
        console.error('Error sending verification code:', error)
        alert('发送验证码失败，请稍后重试')
        document.getElementById('sendCodeBtn').disabled = false
    }
}

// 验证邮箱格式
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// 邮箱验证码登录
async function handleEmailLogin() {
    const email = document.getElementById('emailInput').value
    const code = document.getElementById('codeInput').value

    if (!email || !code) {
        alert('请输入邮箱和验证码')
        return
    }

    try {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: code,
            type: 'email'
        })

        if (error) throw error

        // 登录成功
        showUserSection(data.user)
        await syncUserConfig()
    } catch (error) {
        console.error('Error logging in:', error)
        alert('登录失败，请检查验证码是否正确')
    }
}

// 事件监听
document.addEventListener('DOMContentLoaded', () => {
    initializeUI()
    
    document.getElementById('loginBtn').addEventListener('click', generateWeChatQRCode)
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await supabase.auth.signOut()
        showLoginSection()
    })
    
    // 添加邮箱登录相关的事件监听
    document.getElementById('sendCodeBtn').addEventListener('click', sendVerificationCode)
    document.getElementById('emailLoginBtn').addEventListener('click', handleEmailLogin)
})

// 监听存储变化
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        handleSearchEngineChange(changes)
    }
})
