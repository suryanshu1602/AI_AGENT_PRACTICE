import sys
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
os.chdir(PROJECT_ROOT)

import streamlit as st
from src.llm.rag_chain import RAGChain


st.set_page_config(page_title="QA Copilot", page_icon="🤖", layout="wide")


# CSS Styles
st.markdown("""
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons@2.47.0/font/tabler-icons.min.css">
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
    --bg: #07080F;
    --panel: #0D0F1C;
    --card: #121525;
    --border: #1E2240;
    --accent: #00E5FF;
    --accent2: #7B5EA7;
    --text: #E8EAFF;
    --muted: #6B7090;
    --green: #00FFB3;
}
.stApp { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; }
[data-testid="stSidebar"] { background: var(--panel) !important; border-right: 1px solid var(--border); width: 280px !important; }
[data-testid="stRadio"] { display: none !important; }
[data-testid="stFileUploader"] { margin: 0 20px 12px !important; }
[data-testid="stFileUploader"] button { 
    background: linear-gradient(135deg, #00E5FF, #7B5EA7) !important; 
    border: none !important; 
    border-radius: 8px !important; 
    color: #07080F !important;
    font-weight: 600 !important;
    padding: 8px 16px !important;
}
</style>
""", unsafe_allow_html=True)

# Session State
if "messages" not in st.session_state:
    st.session_state.messages = []
if "mode" not in st.session_state:
    st.session_state.mode = "Chat"
if "source_filter" not in st.session_state:
    st.session_state.source_filter = "All"
if "n_results" not in st.session_state:
    st.session_state.n_results = 5


# SIDEBAR
with st.sidebar:
    # Logo
    st.markdown("""
    <div style="padding: 20px; border-bottom: 1px solid #1E2240;">
        <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #00E5FF, #7B5EA7); display: flex; align-items: center; justify-content: center; font-size: 20px;">🧪</div>
            <span style="font-size: 20px; font-weight: 800;">QA Copilot</span>
            <span style="font-family: 'Space Mono'; font-size: 8px; color: #00E5FF; background: rgba(0,229,255,0.1); border: 1px solid rgba(0,229,255,0.2); padding: 3px 8px; border-radius: 4px; margin-left: auto;">v2.7</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-top: 16px; padding: 8px 12px; background: rgba(0,255,179,0.05); border-radius: 8px; border: 1px solid rgba(0,255,179,0.1);">
            <div style="width: 6px; height: 6px; border-radius: 50%; background: #00FFB3; box-shadow: 0 0 8px #00FFB3; animation: pulse 2s infinite;"></div>
            <span style="font-family: 'Space Mono'; font-size: 9px; color: #00FFB3; letter-spacing: 1px;">SYSTEM ONLINE</span>
        </div>
    </div>
    <style>@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }</style>
    """, unsafe_allow_html=True)

    # Mode
    st.markdown('<div style="padding: 16px 20px 8px;"><span style="font-family: Space Mono; font-size: 9px; color: #6B7090; letter-spacing: 2px; text-transform: uppercase;">Mode</span></div>', unsafe_allow_html=True)
    modes = ["Chat", "Debug", "Generate", "JIRA"]
    mode = st.radio("Mode", modes, index=modes.index(st.session_state.mode), label_visibility="collapsed", key="mode_radio")
    st.session_state.mode = mode

    # Source
    st.markdown('<div style="padding: 8px 20px;"><span style="font-family: Space Mono; font-size: 9px; color: #6B7090; letter-spacing: 2px; text-transform: uppercase;">Data Source</span></div>', unsafe_allow_html=True)
    source_filter = st.selectbox("Search Source", ["All", "selenium", "playwright", "test_cases", "pdf_docs", "jira_summaries"], index=0, label_visibility="collapsed", key="source_select")
    st.session_state.source_filter = source_filter

    # Results
    st.markdown('<div style="padding: 8px 20px;"><span style="font-family: Space Mono; font-size: 9px; color: #6B7090; letter-spacing: 2px; text-transform: uppercase;">Results Count</span></div>', unsafe_allow_html=True)
    n_results = st.slider("Depth", 1, 20, st.session_state.n_results, key="depth_slider", label_visibility="collapsed")
    st.session_state.n_results = n_results

    # Metrics
    st.markdown('<div style="padding: 16px 20px 8px;"><span style="font-family: Space Mono; font-size: 9px; color: #6B7090; letter-spacing: 2px; text-transform: uppercase;">Statistics</span></div>', unsafe_allow_html=True)
    cols = st.columns(2)
    with cols[0]:
        st.markdown('<div style="background: #121525; border: 1px solid #1E2240; border-radius: 10px; padding: 14px; text-align: center;"><div style="font-size: 24px; font-weight: 800; color: #00E5FF;">1,240</div><div style="font-family: Space Mono; font-size: 8px; color: #6B7090; letter-spacing: 1px;">TEST CASES</div></div>', unsafe_allow_html=True)
    with cols[1]:
        st.markdown('<div style="background: #121525; border: 1px solid #1E2240; border-radius: 10px; padding: 14px; text-align: center;"><div style="font-size: 24px; font-weight: 800; color: #00FFB3;">94%</div><div style="font-family: Space Mono; font-size: 8px; color: #6B7090; letter-spacing: 1px;">PASS RATE</div></div>', unsafe_allow_html=True)
    cols2 = st.columns(2)
    with cols2[0]:
        st.markdown('<div style="background: #121525; border: 1px solid #1E2240; border-radius: 10px; padding: 14px; text-align: center;"><div style="font-size: 24px; font-weight: 800; color: #7B5EA7;">38</div><div style="font-family: Space Mono; font-size: 8px; color: #6B7090; letter-spacing: 1px;">JIRA</div></div>', unsafe_allow_html=True)
    with cols2[1]:
        st.markdown('<div style="background: #121525; border: 1px solid #1E2240; border-radius: 10px; padding: 14px; text-align: center;"><div style="font-size: 24px; font-weight: 800; color: #FF4D6D;">6</div><div style="font-family: Space Mono; font-size: 8px; color: #6B7090; letter-spacing: 1px;">FAILED</div></div>', unsafe_allow_html=True)

    # Upload PDF
    st.markdown('<div style="padding: 16px 20px 8px;"><span style="font-family: Space Mono; font-size: 9px; color: #6B7090; letter-spacing: 2px; text-transform: uppercase;">Documents (PDF)</span></div>', unsafe_allow_html=True)
    
    st.markdown("""
    <div style="margin: 0 20px 12px; background: #121525; border: 2px dashed #1E2240; border-radius: 12px; padding: 20px; text-align: center; cursor: pointer;">
        <div style="font-size: 24px; margin-bottom: 8px;">📄</div>
        <div style="font-size: 12px; color: #6B7090;">Drop PDF file here</div>
        <div style="font-family: Space Mono; font-size: 9px; color: #00E5FF; margin-top: 4px;">or click Upload button below</div>
    </div>
    """, unsafe_allow_html=True)
    
    uploaded_pdf = st.file_uploader("Upload PDF File", type=["pdf"], key="pdf_upload", label_visibility="visible")
    if uploaded_pdf is not None:
        st.markdown(f'<div style="background: linear-gradient(135deg, rgba(0,255,179,0.08), rgba(0,229,255,0.08)); border: 1px solid #00FFB3; border-radius: 10px; padding: 12px 16px; display: flex; align-items: center; gap: 12px; margin-bottom: 12px;"><span style="font-size: 24px;">✓</span><div><div style="font-size: 12px; font-weight: 600; color: #00FFB3;">{uploaded_pdf.name}</div><div style="font-family: Space Mono; font-size: 9px; color: #6B7090;">PDF Document</div></div></div>', unsafe_allow_html=True)
        if st.button("Ingest PDF"):
            try:
                from src.ingestion.pdf_loader import load_pdf
                from src.ingestion.chunkers import chunk_pdf
                from src.retriever.vector_store import VectorStore
                docs = load_pdf(uploaded_pdf)
                store = VectorStore()
                ids, documents, metadatas = [], [], []
                for i, doc in enumerate(docs):
                    chunks = chunk_pdf(doc["source"], doc["content"])
                    for j, chunk in enumerate(chunks):
                        ids.append(f"pdf_{i}_{j}")
                        documents.append(chunk["content"])
                        metadatas.append({"source": chunk["source"], "type": "pdf", "page": chunk.get("page", "")})
                if ids:
                    store.add_documents("pdf_docs", ids, documents, metadatas)
                    st.success(f"✓ Added {len(ids)} PDF chunks!")
            except Exception as e:
                st.error(f"Error: {e}")

    # Upload CSV
    st.markdown('<div style="padding: 8px 20px;"><span style="font-family: Space Mono; font-size: 9px; color: #6B7090; letter-spacing: 2px; text-transform: uppercase;">Test Data (CSV)</span></div>', unsafe_allow_html=True)
    
    st.markdown("""
    <div style="margin: 0 20px 12px; background: #121525; border: 2px dashed #1E2240; border-radius: 12px; padding: 20px; text-align: center; cursor: pointer;">
        <div style="font-size: 24px; margin-bottom: 8px;">📁</div>
        <div style="font-size: 12px; color: #6B7090;">Drop CSV file here</div>
        <div style="font-family: Space Mono; font-size: 9px; color: #00E5FF; margin-top: 4px;">or click Upload button below</div>
    </div>
    """, unsafe_allow_html=True)
    
    uploaded_file = st.file_uploader("Upload CSV File", type=["csv"], key="csv_upload", label_visibility="visible")
    if uploaded_file is not None:
        st.markdown(f'<div style="background: linear-gradient(135deg, rgba(0,255,179,0.08), rgba(0,229,255,0.08)); border: 1px solid #00FFB3; border-radius: 10px; padding: 12px 16px; display: flex; align-items: center; gap: 12px; margin-bottom: 12px;"><span style="font-size: 24px;">✓</span><div><div style="font-size: 12px; font-weight: 600; color: #00FFB3;">{uploaded_file.name}</div><div style="font-family: Space Mono; font-size: 9px; color: #6B7090;">CSV File</div></div></div>', unsafe_allow_html=True)
        if st.button("Ingest CSV"):
            import pandas as pd
            from src.ingestion.csv_loader import load_test_cases
            from src.ingestion.chunkers import chunk_test_case
            from src.retriever.vector_store import VectorStore
            df = pd.read_csv(uploaded_file)
            docs = []
            for idx, row in df.iterrows():
                content = " | ".join([f"{col}: {row[col]}" for col in df.columns])
                docs.append({"id": str(idx), "row_index": idx, "source": uploaded_file.name, "content": content})
            store = VectorStore()
            ids, documents, metadatas = [], [], []
            for doc in docs:
                chunks = chunk_test_case(doc["source"], doc["content"])
                for i, chunk in enumerate(chunks):
                    ids.append(f"tc_{doc['row_index']}_{i}")
                    documents.append(chunk["content"])
                    metadatas.append({"source": chunk["source"], "type": chunk.get("type", "test_case"), "row_index": doc.get("row_index", "")})
            if ids:
                store.add_documents("test_cases", ids, documents, metadatas)
                st.success(f"✓ Added {len(ids)} CSV chunks!")

    # Actions
    if st.button("Run Data Ingestion", type="primary"):
        with st.spinner("Ingesting data..."):
            try:
                from src.ingestion.pipeline import ingest_all
                ingest_all()
                st.success("✓ Data ingestion complete!")
            except Exception as e:
                st.error(f"Error: {e}")
    
    if st.button("Clear Chat History"):
        st.session_state.messages = []


# MAIN HEADER
st.markdown(f"""
<div style="padding: 20px 28px; border-bottom: 1px solid #1E2240; background: #0D0F1C; display: flex; align-items: center; justify-content: space-between;">
    <div>
        <h1 style="font-size: 24px; font-weight: 800;">QA <span style="color: #00E5FF;">Copilot</span></h1>
        <div style="font-family: Space Mono; font-size: 10px; color: #6B7090; letter-spacing: 1px; margin-top: 4px;">WORKSPACE · {st.session_state.mode.upper()} MODE</div>
    </div>
    <div style="display: flex; gap: 10px;">
        <button style="background: #121525; border: 1px solid #1E2240; border-radius: 8px; padding: 10px 14px; color: #6B7090; cursor: pointer;">🔍</button>
        <button style="background: #121525; border: 1px solid #1E2240; border-radius: 8px; padding: 10px 14px; color: #6B7090; cursor: pointer;">⚙️</button>
    </div>
</div>
""", unsafe_allow_html=True)


# WELCOME
if not st.session_state.messages:
    st.markdown("""
    <div style="text-align: center; padding: 50px 20px 30px;">
        <div style="width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, rgba(0,229,255,0.15), rgba(123,94,167,0.15)); border: 1px solid rgba(0,229,255,0.2); margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px;">🛡️</div>
        <h2 style="font-size: 28px; font-weight: 800; margin-bottom: 8px;">Hello, QA <em style="font-style: normal; color: #00E5FF;">Engineer</em></h2>
        <p style="color: #6B7090; font-size: 14px; max-width: 400px; margin: 0 auto 24px; line-height: 1.6;">Search test cases, generate automation code, map JIRA tickets, and debug failures.</p>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
            <button onclick="document.querySelector('textarea').value='Generate test cases for login';document.querySelector('textarea').focus()" style="background: #121525; border: 1px solid #1E2240; border-radius: 24px; padding: 10px 18px; font-size: 12px; font-weight: 600; color: #6B7090; cursor: pointer;">🧪 Generate Test Cases</button>
            <button onclick="document.querySelector('textarea').value='Debug test failure';document.querySelector('textarea').focus()" style="background: #121525; border: 1px solid #1E2240; border-radius: 24px; padding: 10px 18px; font-size: 12px; font-weight: 600; color: #6B7090; cursor: pointer;">🐛 Debug Failure</button>
            <button onclick="document.querySelector('textarea').value='Map to JIRA';document.querySelector('textarea').focus()" style="background: #121525; border: 1px solid #1E2240; border-radius: 24px; padding: 10px 18px; font-size: 12px; font-weight: 600; color: #6B7090; cursor: pointer;">🎫 Map to JIRA</button>
            <button onclick="document.querySelector('textarea').value='Write automation';document.querySelector('textarea').focus()" style="background: #121525; border: 1px solid #1E2240; border-radius: 24px; padding: 10px 18px; font-size: 12px; font-weight: 600; color: #6B7090; cursor: pointer;">💻 Write Automation</button>
        </div>
    </div>
    """, unsafe_allow_html=True)


# CHAT MESSAGES
for msg in st.session_state.messages:
    role_class = "ai" if msg["role"] == "assistant" else "user"
    role_label = "Copilot" if msg["role"] == "assistant" else "You"
    avatar = "🤖" if msg["role"] == "assistant" else "👤"
    bg_color = "rgba(0,229,255,0.05)" if msg["role"] == "user" else "#121525"
    border_color = "rgba(0,229,255,0.15)" if msg["role"] == "user" else "#1E2240"
    st.markdown(f"""
    <div style="display: flex; gap: 14px; margin: 0 28px 20px;">
        <div style="width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; {'background: linear-gradient(135deg, #00E5FF, #7B5EA7); color: #07080F;' if msg['role'] == 'assistant' else 'background: #121525; border: 1px solid #1E2240;'}">{avatar}</div>
        <div style="flex: 1;">
            <div style="font-family: Space Mono; font-size: 9px; color: #6B7090; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;">{role_label}</div>
            <div style="background: {bg_color}; border: 1px solid {border_color}; border-radius: 12px; padding: 14px 18px; font-size: 13px; line-height: 1.7;">{msg['content']}</div>
        </div>
    </div>
    """, unsafe_allow_html=True)


# INPUT
if prompt := st.chat_input("Ask about test cases, code, or JIRA tickets..."):
    if not isinstance(prompt, str) or not prompt.strip():
        st.error("Please enter text input.")
    else:
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        with st.spinner("Analyzing..."):
            try:
                @st.cache_resource
                def load_rag():
                    return RAGChain()
                
                rag = load_rag()
                source = None if st.session_state.source_filter == "All" else st.session_state.source_filter
                
                if st.session_state.mode == "Chat":
                    history = [{"role": m["role"], "content": m["content"]} for m in st.session_state.messages[-6:]]
                    answer, _ = rag.ask(prompt, conversation_history=history, n_results=st.session_state.n_results, source=source)
                    st.session_state.messages.append({"role": "assistant", "content": answer})
                    
                elif st.session_state.mode == "Generate":
                    framework = "selenium" if st.session_state.source_filter in ["All", "selenium"] else "playwright"
                    code = rag.generate_test_code(prompt, framework=framework, n_results=st.session_state.n_results)
                    response = f"**Generated {framework.title()} Test Code:**\n\n```{('java' if framework == 'selenium' else 'typescript')}\n{code}\n```"
                    st.session_state.messages.append({"role": "assistant", "content": response})
                    
                else:
                    context, raw = rag.search(prompt, n_results=st.session_state.n_results, source=source)
                    st.session_state.messages.append({"role": "assistant", "content": context if context.strip() else "No results found. Try running data ingestion first."})
                    
                st.rerun()
            except Exception as e:
                st.session_state.messages.append({"role": "assistant", "content": f"Error: {str(e)}"})
                st.rerun()