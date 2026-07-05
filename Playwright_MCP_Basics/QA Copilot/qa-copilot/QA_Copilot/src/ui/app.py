import sys
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
os.chdir(PROJECT_ROOT)

import streamlit as st
from src.llm.rag_chain import RAGChain


st.set_page_config(page_title="QA Copilot", page_icon="🤖", layout="wide")


st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

:root {
    --bg: #07080F;
    --panel: #0D0F1C;
    --card: #121525;
    --border: #1E2240;
    --accent: #00E5FF;
    --accent2: #7B5EA7;
    --accent3: #FF4D6D;
    --text: #E8EAFF;
    --muted: #6B7090;
    --green: #00FFB3;
}

.stApp {
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
}

[data-testid="stSidebar"] {
    background: var(--panel) !important;
    border-right: 1px solid var(--border);
    width: 280px !important;
}

.logo-bar {
    padding: 24px 20px 16px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.logo-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-text {
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.3px;
}

.logo-badge {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    color: var(--accent);
    background: rgba(0,229,255,0.08);
    border: 1px solid rgba(0,229,255,0.2);
    padding: 2px 7px;
    border-radius: 4px;
    margin-left: auto;
}

.status-bar {
    padding: 12px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
}

.pulse {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 6px var(--green);
    animation: blink 2s infinite;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}

.status-txt {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.5px;
}

.section-label {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 12px;
}

.mode-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 20px;
}

.mode-btn {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 8px;
    text-align: center;
    color: var(--muted);
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.mode-btn:hover {
    border-color: var(--accent);
    color: var(--text);
}

[data-testid="stRadio"] > div {
    gap: 8px;
}

[data-testid="stRadio"] > div > label {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 8px;
    text-align: center;
    color: var(--muted);
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

[data-testid="stRadio"] > div > label:has(input:checked) {
    border-color: var(--accent);
    background: rgba(0,229,255,0.06);
    color: var(--accent);
}

[data-testid="stRadio"] > div > label:hover {
    border-color: var(--accent);
    color: var(--text);
}

.source-select {
    width: 100%;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    padding: 10px 12px;
    cursor: pointer;
    margin-bottom: 20px;
}

.slider-wrap {
    margin-top: 4px;
    margin-bottom: 20px;
}

.slider-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.slider-val {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    color: var(--accent);
    font-weight: 700;
}

[data-testid="stSlider"] [data-testid="stMarkdownContainer"] p {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 2px;
    text-transform: uppercase;
}

.metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 20px;
}

.metric {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
}

.metric-val {
    font-size: 20px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 2px;
}

.metric-val.cyan { color: var(--accent); }
.metric-val.green { color: var(--green); }
.metric-val.purple { color: var(--accent2); }
.metric-val.red { color: var(--accent3); }

.metric-lbl {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 0.5px;
}

.ingest-zone {
    margin: 0 20px 16px;
    border: 1px dashed var(--border);
    border-radius: 10px;
    padding: 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 20px;
}

.ingest-zone:hover {
    border-color: var(--accent);
    background: rgba(0,229,255,0.03);
}

.ingest-zone p {
    font-size: 11px;
    color: var(--muted);
    margin: 6px 0;
}

.ingest-zone span {
    color: var(--accent);
    font-size: 10px;
    font-family: 'Space Mono', monospace;
}

.run-btn {
    width: calc(100% - 40px);
    margin: 0 20px 20px;
    padding: 12px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border: none;
    border-radius: 10px;
    color: #07080F;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    letter-spacing: 0.3px;
    transition: opacity 0.2s;
}

.run-btn:hover {
    opacity: 0.88;
}

.topbar {
    padding: 16px 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--panel);
    margin: -1rem -1rem 0 -1rem;
    padding: 16px 28px;
}

.page-title {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.5px;
}

.page-title span {
    color: var(--accent);
}

.breadcrumb {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.5px;
    margin-top: 4px;
}

[data-testid="stChatInput"] {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 8px;
}

[data-testid="stChatInput"]:focus-within {
    border-color: var(--accent);
}

[data-testid="stChatInput"] textarea {
    background: transparent;
    border: none;
    outline: none;
    color: var(--text);
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    padding: 14px 16px;
}

[data-testid="stChatInput"] textarea::placeholder {
    color: var(--muted);
}

[data-testid="stChatInput"] button {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border: none;
    border-radius: 9px;
    width: 36px;
    height: 36px;
}

.chat-message {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
}

.msg-avatar {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 800;
}

.msg-avatar.user {
    background: var(--card);
    border: 1px solid var(--border);
    color: var(--muted);
}

.msg-avatar.ai {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #07080F;
}

.msg-body {
    flex: 1;
}

.msg-role {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    letter-spacing: 1px;
    margin-bottom: 6px;
    color: var(--muted);
    text-transform: uppercase;
}

.msg-text {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    font-size: 13px;
    line-height: 1.7;
    color: var(--text);
}

.user-message .msg-text {
    background: rgba(0,229,255,0.04);
    border-color: rgba(0,229,255,0.15);
}

.tag-row {
    display: flex;
    gap: 6px;
    margin-top: 8px;
    flex-wrap: wrap;
}

.tag {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    padding: 3px 8px;
    border-radius: 4px;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.tag.pass {
    background: rgba(0,255,179,0.1);
    color: var(--green);
    border: 1px solid rgba(0,255,179,0.2);
}

.tag.fail {
    background: rgba(255,77,109,0.1);
    color: var(--accent3);
    border: 1px solid rgba(255,77,109,0.2);
}

.tag.info {
    background: rgba(0,229,255,0.1);
    color: var(--accent);
    border: 1px solid rgba(0,229,255,0.2);
}

.welcome {
    text-align: center;
    padding: 40px 20px;
}

.welcome-icon {
    width: 64px;
    height: 64px;
    border-radius: 18px;
    background: linear-gradient(135deg,rgba(0,229,255,0.15),rgba(123,94,167,0.15));
    border: 1px solid rgba(0,229,255,0.2);
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: var(--accent);
}

.welcome h2 {
    font-size: 26px;
    font-weight: 800;
    margin-bottom: 8px;
}

.welcome h2 em {
    font-style: normal;
    color: var(--accent);
}

.welcome p {
    color: var(--muted);
    font-size: 13px;
    max-width: 360px;
    margin: 0 auto 24px;
    line-height: 1.6;
}

.chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 8px;
}

.chip {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 7px 14px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    color: var(--muted);
    transition: all 0.2s;
}

.chip:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(0,229,255,0.05);
}

.input-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 0.5px;
}

.input-tools {
    display: flex;
    gap: 6px;
}

.itool {
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 4px 8px;
    cursor: pointer;
    color: var(--muted);
    font-size: 12px;
    transition: all 0.2s;
    font-family: 'Space Mono', monospace;
    font-size: 9px;
}

.itool:hover {
    border-color: var(--accent);
    color: var(--accent);
}

[data-testid="stButton"] > button {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--muted);
}

[data-testid="stButton"] > button:hover {
    border-color: var(--accent);
    color: var(--accent);
}

.divider {
    border-bottom: 1px solid var(--border);
    margin: 20px 0;
}
</style>
""", unsafe_allow_html=True)


if "messages" not in st.session_state:
    st.session_state.messages = []

if "mode" not in st.session_state:
    st.session_state.mode = "Chat"

if "source_filter" not in st.session_state:
    st.session_state.source_filter = "All"

if "n_results" not in st.session_state:
    st.session_state.n_results = 5


with st.sidebar:
    st.markdown("""
    <div class="logo-bar">
        <div class="logo-icon">🤖</div>
        <span class="logo-text">QA Copilot</span>
        <span class="logo-badge">v2.7</span>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div class="status-bar">
        <div class="pulse"></div>
        <span class="status-txt">NEURAL ENGINE ONLINE</span>
    </div>
    """, unsafe_allow_html=True)

    st.markdown('<div class="section-label">Mode</div>', unsafe_allow_html=True)

    modes = ["Chat", "Debug", "Generate", "JIRA"]
    mode = st.radio("Mode", modes, index=modes.index(st.session_state.mode), label_visibility="collapsed")
    st.session_state.mode = mode

    st.markdown('<div class="section-label">Search source</div>', unsafe_allow_html=True)
    source_filter = st.selectbox(
        "Search Source",
        ["All", "selenium", "playwright", "test_cases", "pdf_docs", "jira_summaries"],
        index=["All", "selenium", "playwright", "test_cases", "pdf_docs", "jira_summaries"].index(st.session_state.source_filter),
        label_visibility="collapsed",
        key="source_select"
    )
    st.session_state.source_filter = source_filter

    st.markdown('<div class="section-label">Results count</div>', unsafe_allow_html=True)
    n_results = st.slider("Depth", 1, 20, st.session_state.n_results, key="depth_slider")
    st.session_state.n_results = n_results
    st.markdown(f'<div class="slider-val">{n_results}</div>', unsafe_allow_html=True)

    col1, col2 = st.columns(2)
    with col1:
        st.markdown(f'''
        <div class="metric">
            <div class="metric-val cyan">1,240</div>
            <div class="metric-lbl">TEST CASES</div>
        </div>
        ''', unsafe_allow_html=True)
    with col2:
        st.markdown(f'''
        <div class="metric">
            <div class="metric-val green">94%</div>
            <div class="metric-lbl">PASS RATE</div>
        </div>
        ''', unsafe_allow_html=True)
    col3, col4 = st.columns(2)
    with col3:
        st.markdown(f'''
        <div class="metric">
            <div class="metric-val purple">38</div>
            <div class="metric-lbl">JIRA LINKED</div>
        </div>
        ''', unsafe_allow_html=True)
    with col4:
        st.markdown(f'''
        <div class="metric">
            <div class="metric-val red">6</div>
            <div class="metric-lbl">FAILURES</div>
        </div>
        ''', unsafe_allow_html=True)

    st.markdown("""
    <div class="ingest-zone">
        <p>Drop CSV file here</p>
        <span>200MB max · CSV format</span>
    </div>
    """, unsafe_allow_html=True)

    if st.button("Run Data Ingestion", key="ingest_btn"):
        with st.spinner("Ingesting data..."):
            try:
                from src.ingestion.pipeline import ingest_all
                ingest_all()
                st.success("Ingestion complete!")
            except Exception as e:
                st.error(f"Error: {e}")

    if st.button("Clear chat", key="clear_btn"):
        st.session_state.messages = []


st.markdown(f'''
<div class="topbar">
    <div class="topbar-left">
        <div>
            <div class="page-title">QA <span>Copilot</span></div>
            <div class="breadcrumb">WORKSPACE · {st.session_state.mode.upper()} MODE · {st.session_state.source_filter.upper()} SOURCES</div>
        </div>
    </div>
</div>
''', unsafe_allow_html=True)


if not st.session_state.messages:
    st.markdown(f'''
    <div class="welcome">
        <div class="welcome-icon">🛡️</div>
        <h2>Hello, QA <em>Engineer</em></h2>
        <p>Search test cases, generate automation code, map JIRA tickets, and debug failures — all in one place.</p>
        <div class="chips">
            <div class="chip">Generate test cases</div>
            <div class="chip">Debug a failure</div>
            <div class="chip">Map to JIRA</div>
            <div class="chip">Write automation</div>
            <div class="chip">Coverage report</div>
        </div>
    </div>
    ''', unsafe_allow_html=True)

for i, msg in enumerate(st.session_state.messages):
    role_class = "ai" if msg["role"] == "assistant" else "user"
    role_label = "Copilot" if msg["role"] == "assistant" else "You"
    
    st.markdown(f'''
    <div class="chat-message {role_class}">
        <div class="msg-avatar {role_class}">{role_label[0] if role_label == 'Copilot' else '👤'}</div>
        <div class="msg-body">
            <div class="msg-role">{role_label}</div>
            <div class="msg-text">{msg["content"]}</div>
        </div>
    </div>
    ''', unsafe_allow_html=True)


if prompt := st.chat_input("Ask about test cases, code, or JIRA tickets..."):
    if not isinstance(prompt, str) or not prompt.strip():
        st.error("Please enter text input.")
    else:
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        with st.spinner("Thinking..."):
            try:
                @st.cache_resource
                def load_rag():
                    return RAGChain()
                
                rag = load_rag()
                source = None if st.session_state.source_filter == "All" else st.session_state.source_filter
                
                if st.session_state.mode == "Chat":
                    history = [
                        {"role": m["role"], "content": m["content"]}
                        for m in st.session_state.messages[-6:]
                    ]
                    answer, _ = rag.ask(prompt, conversation_history=history, n_results=st.session_state.n_results, source=source)
                    st.session_state.messages.append({"role": "assistant", "content": answer})
                    st.rerun()
                    
                elif st.session_state.mode == "Generate":
                    framework = "selenium" if st.session_state.source_filter in ["All", "selenium"] else "playwright"
                    code = rag.generate_test_code(prompt, framework=framework, n_results=st.session_state.n_results)
                    response = f"Generated {framework.title()} test code:\n\n```{(framework[:3] + ('java' if framework == 'selenium' else 'typescript'))}\n{code}\n```"
                    st.session_state.messages.append({"role": "assistant", "content": response})
                    st.rerun()
                    
                elif st.session_state.mode == "Search Only" or st.session_state.mode == "Debug":
                    context, raw = rag.search(prompt, n_results=st.session_state.n_results, source=source)
                    if context.strip():
                        st.session_state.messages.append({"role": "assistant", "content": context})
                        st.rerun()
                    else:
                        st.session_state.messages.append({"role": "assistant", "content": "No results found. Try running data ingestion first."})
                        st.rerun()
                        
            except Exception as e:
                st.session_state.messages.append({"role": "assistant", "content": f"Error: {str(e)}"})
                st.rerun()

st.markdown('<div class="input-footer"><span>SHIFT+ENTER FOR NEW LINE · ENTER TO SEND</span></div>', unsafe_allow_html=True)