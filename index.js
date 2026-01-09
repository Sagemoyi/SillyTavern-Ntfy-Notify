// 注意这里层级修好了：script.js用三个点，extensions.js用两个点
import { eventSource, event_types, saveSettingsDebounced } from '../../../script.js';
import { getContext, extension_settings } from '../../extensions.js';

const PLUGIN_NAME = 'ntfy';

const DEFAULT_SETTINGS = {
    ntfy_topic: "",
    ntfy_server: "https://ntfy.sh",
    ntfy_background_only: false,
    ntfy_show_name: false,
    ntfy_length: 0
};

if (!extension_settings[PLUGIN_NAME]) {
    extension_settings[PLUGIN_NAME] = DEFAULT_SETTINGS;
}

const SETTINGS_HTML = `
<div class="ntfy_settings">
    <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>Ntfy 手机通知</b>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <label class="checkbox_label">
                <span class="text_label">Ntfy 主题名 (Topic):</span>
            </label>
            <input type="text" id="ntfy_topic" class="text_pole" placeholder="例如: my_secret_888 (必填)" />

            <label class="checkbox_label">
                <span class="text_label">服务器地址:</span>
            </label>
            <input type="text" id="ntfy_server" class="text_pole" placeholder="https://ntfy.sh" />

            <label class="checkbox_label">
                <input type="checkbox" id="ntfy_background_only" />
                <span class="text_label">仅当浏览器在后台/最小化时通知</span>
            </label>

            <label class="checkbox_label">
                <input type="checkbox" id="ntfy_show_name" />
                <span class="text_label">标题显示角色名字</span>
            </label>

            <label class="checkbox_label">
                <span class="text_label">消息预览长度 (当前: <span id="ntfy_length_val">0</span>字):</span>
            </label>
            <input type="range" id="ntfy_length" min="0" max="100" step="1" />
            
            <div style="margin-top:5px; font-size: 0.8em; opacity: 0.7;">
                <i>* 拉到 0 = 仅通知“收到新消息” (保护隐私)<br>
                * 拉到 >0 = 显示具体回复内容</i>
            </div>
        </div>
    </div>
</div>
`;

// 4. 核心功能：发送通知 (已修复中文乱码问题)
async function sendNotification() {
    const settings = extension_settings[PLUGIN_NAME];

    // 基础检查
    if (!settings.ntfy_topic) return;
    if (settings.ntfy_background_only && !document.hidden) return;

    const context = getContext();
    const chat = context.chat;
    if (!chat || chat.length === 0) return;

    const lastMsg = chat[chat.length - 1];
    if (!lastMsg || lastMsg.is_user) return;

    // --- 构建内容 ---
    let title = "酒馆通知";
    let body = "酒馆收到一条新消息";
    const charName = lastMsg.name || "AI";

    if (settings.ntfy_show_name) {
        title = `${charName} 的消息`;
    }

    const previewLen = parseInt(settings.ntfy_length);
    if (previewLen > 0 && lastMsg.mes) {
        let cleanText = lastMsg.mes.replace(/<[^>]*>?/gm, '');
        body = cleanText.length > previewLen ? cleanText.substring(0, previewLen) + "..." : cleanText;
    }

    // --- 发送请求 (修复版) ---
    // 原理：将 Title 等包含中文的字段，从 headers 移到 URL 查询参数里，并进行编码
    const serverUrl = settings.ntfy_server.replace(/\/$/, "");

    // 构建带有参数的 URL
    // 例如: https://ntfy.sh/mytopic?title=EncodedTitle&priority=default
    const targetUrl = new URL(`${serverUrl}/${settings.ntfy_topic}`);
    targetUrl.searchParams.append("title", title);
    targetUrl.searchParams.append("priority", "default");
    targetUrl.searchParams.append("click", window.location.href);

    try {
        await fetch(targetUrl.toString(), {
            method: 'POST',
            body: body,
            // headers 里不再放中文，留空即可，或者只放标准头
        });
        console.log('[Ntfy] 通知已推送');
    } catch (err) {
        console.error('[Ntfy] 发送失败', err);
    }
}

function bindSettings() {
    const settings = extension_settings[PLUGIN_NAME];

    $('#ntfy_topic').val(settings.ntfy_topic).on('input', function () {
        settings.ntfy_topic = $(this).val().trim();
        saveSettingsDebounced();
    });

    $('#ntfy_server').val(settings.ntfy_server).on('input', function () {
        settings.ntfy_server = $(this).val().trim();
        saveSettingsDebounced();
    });

    $('#ntfy_background_only').prop('checked', settings.ntfy_background_only).on('change', function () {
        settings.ntfy_background_only = $(this).prop('checked');
        saveSettingsDebounced();
    });

    $('#ntfy_show_name').prop('checked', settings.ntfy_show_name).on('change', function () {
        settings.ntfy_show_name = $(this).prop('checked');
        saveSettingsDebounced();
    });

    $('#ntfy_length').val(settings.ntfy_length).on('input', function () {
        const val = $(this).val();
        $('#ntfy_length_val').text(val);
        settings.ntfy_length = val;
        saveSettingsDebounced();
    });
    $('#ntfy_length_val').text(settings.ntfy_length);
}

jQuery(async () => {
    console.log('[Ntfy] 插件开始加载...');
    const container = $('#extensions_settings');
    if (container.length > 0) {
        container.append(SETTINGS_HTML);
        bindSettings();
    }
    eventSource.on(event_types.GENERATION_ENDED, () => {
        sendNotification();
    });
});