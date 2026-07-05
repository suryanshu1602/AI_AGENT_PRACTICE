import sys, os
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if PROJECT_ROOT not in sys.path: sys.path.insert(0, PROJECT_ROOT)
os.chdir(PROJECT_ROOT)

import streamlit as st
from src.llm.rag_chain import RAGChain

st.set_page_config(page_title="QA Copilot", page_icon=":robot_face:", layout="wide")

css = """<style>
:root { --bg: #F5F7FA; --panel: #FFFFFF; --border: #D1D5DB; --accent: #2563EB; --text: #1F2937; --muted: #6B7280; --green: #059669; --red: #DC2626; }
.stApp { background: var(--bg); color: var(--text); }
[data-testid="stSidebar"] { background: var(--panel) !important; border-right: 1px solid var(--border); }
.page-title { font-size: 22px; font-weight: 700; padding: 16px 0 4px 0; }
.page-title span { color: var(--accent); }
.subtitle { font-size: 13px; color: var(--muted); margin-bottom: 16px; }
.section-header { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin: 16px 0 8px 0; }
.stat-box { background: var(--panel); border: 1px solid var(--border); border-radius: 8px; padding: 12px; }
.stat-val { font-size: 22px; font-weight: 700; }
.stat-lbl { font-size: 11px; color: var(--muted); }
.stat-ok { color: var(--green); }
.stat-err { color: var(--red); }
.stat-neu { color: var(--accent); }
.msg-bubble { border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; font-size: 14px; line-height: 1.6; }
.msg-user { background: #EFF6FF; border-color: #BFDBFE; }
.msg-assistant { background: var(--panel); }
.msg-label { font-size: 11px; color: var(--muted); margin-bottom: 4px; font-weight: 600; }
</style>"""
st.markdown(css, unsafe_allow_html=True)

for key, default in [("messages", []), ("mode", "Chat"), ("source_filter", "All"), ("n_results", 5), ("vector_counts", {})]:
    if key not in st.session_state: st.session_state[key] = default

def get_vector_store_counts():
    from src.retriever.vector_store import VectorStore
    try:
        store = VectorStore()
        return {key: store.get_count(key) for key in store.collections}
    except: return {}

def get_api_status():
    from config import OPENAI_API_KEY, GROQ_API_KEY
    return {"openai": bool(OPENAI_API_KEY), "groq": bool(GROQ_API_KEY)}

api_status = get_api_status()
vector_counts = get_vector_store_counts()

with st.sidebar:
    st.markdown('<div class="page-title">QA <span>Copilot</span></div>', unsafe_allow_html=True)
    st.markdown('<div class="subtitle">RAG-powered QA assistant</div>', unsafe_allow_html=True)

    st.markdown('<div class="section-header">System Status</div>', unsafe_allow_html=True)
    for key, ok in api_status.items():
        icon = "✅" if ok else "❌"
        st.markdown(f"{icon} **{key.title()} API**: {'Configured' if ok else 'Missing'}")

    st.markdown('<div class="section-header">Vector Store</div>', unsafe_allow_html=True)
    if vector_counts:
        total = sum(v for v in vector_counts.values())
        has_data = total > 0
        c1, c2 = st.columns(2)
        with c1: st.markdown(f'<div class="stat-box"><div class="stat-val stat-neu">{total}</div><div class="stat-lbl">Total chunks</div></div>', unsafe_allow_html=True)
        with c2:
            sc = "stat-ok" if has_data else "stat-err" 
            si = "✅" if has_data else "⚠️"
            stx = "Ready" if has_data else "Empty" 
            st.markdown(f'<div class="stat-box"><div class="stat-val {sc}">{si}</div><div class="stat-lbl">{stx}</div></div>', unsafe_allow_html=True)
        for key, count in vector_counts.items():
            st.markdown(f"&nbsp;&nbsp;{key}: {count} chunks")
    else:
        st.markdown("&nbsp;&nbsp;Could not connect")

    st.markdown('<hr style="margin: 16px 0; border: none; border-top: 1px solid var(--border);">', unsafe_allow_html=True)

    st.markdown('<div class="section-header">Mode</div>', unsafe_allow_html=True)
    mode_names = {"Chat": "Ask questions", "Debug": "Search only", "Generate": "Generate code", "JIRA": "JIRA mapping"}
    mode = st.radio("Mode", list(mode_names.keys()), index=list(mode_names.keys()).index(st.session_state.mode),
                    format_func=lambda x: f"{x} — {mode_names[x]}", label_visibility="collapsed")
    st.session_state.mode = mode

    st.markdown('<div class="section-header">Search Source</div>', unsafe_allow_html=True)
    src_opts = ["All", "selenium", "playwright", "test_cases", "pdf_docs", "jira_summaries"]
    idx = src_opts.index(st.session_state.source_filter) if st.session_state.source_filter in src_opts else 0
    source_filter = st.selectbox("Source", src_opts, index=idx, label_visibility="collapsed")
    st.session_state.source_filter = source_filter

    st.markdown('<div class="section-header">Result Depth</div>', unsafe_allow_html=True)
    n_results = st.slider("Results", 1, 20, st.session_state.n_results, label_visibility="collapsed")
    st.session_state.n_results = n_results

    st.markdown('<hr style="margin: 16px 0; border: none; border-top: 1px solid var(--border);">', unsafe_allow_html=True)

    if st.button("Run Data Ingestion", use_container_width=True):
        with st.spinner("Ingesting data..."):
            try:
                from src.ingestion.pipeline import ingest_all
                ingest_all()
                st.success("Ingestion complete!")
                st.session_state.vector_counts = get_vector_store_counts()
                st.rerun()
            except Exception as e: st.error(f"Error: {e}")

    st.markdown('<div class="section-header">Upload CSV</div>', unsafe_allow_html=True)
    uploaded = st.file_uploader("Upload test cases CSV", type=["csv"], label_visibility="collapsed", key="csv_uploader")
    if uploaded:
        file_id = uploaded.name + str(uploaded.size)
        if st.session_state.get("_processed_file") != file_id:
            import pandas as pd
            from src.retriever.vector_store import VectorStore
            try:
                df = pd.read_csv(uploaded)
                ids, documents, metadatas = [], [], []
                for idx, row in df.iterrows():
                    content = " | ".join([f"{col}: {val}" for col, val in row.items() if pd.notna(val)])
                    ids.append(f"tc_{idx}")
                    documents.append(content)
                    metadatas.append({"source": uploaded.name, "type": "test_case", "row_index": str(idx)})
                VectorStore().add_documents("test_cases", ids, documents, metadatas)
                st.session_state._processed_file = file_id
                st.session_state._upload_msg = f"Uploaded {len(documents)} rows" 
                st.session_state.vector_counts = get_vector_store_counts()
                st.rerun()
            except Exception as e:
                st.session_state._upload_msg = f"Error: {e}" 
                st.rerun()



    if st.button("Clear Chat", use_container_width=True):
        st.session_state.messages = []

st.markdown('<div class="page-title">QA <span>Copilot</span></div>', unsafe_allow_html=True)

if "_upload_msg" in st.session_state:
    msg = st.session_state._upload_msg
    if msg.startswith("Error"): st.error(msg)
    else: st.success(msg)
    del st.session_state._upload_msg
st.markdown(f'<div class="subtitle">Mode: {st.session_state.mode} · Source: {st.session_state.source_filter} · Depth: {st.session_state.n_results}</div>', unsafe_allow_html=True)

for msg in st.session_state.messages:
    rc = "msg-assistant" if msg["role"] == "assistant" else "msg-user" 
    lbl = "Copilot" if msg["role"] == "assistant" else "You" 
    st.markdown(f'<div class="msg-label">{lbl}</div><div class="msg-bubble {rc}">{msg["content"]}</div><br>', unsafe_allow_html=True)

if prompt := st.chat_input("Ask about test cases, code, or JIRA tickets..."):
    if not prompt.strip(): st.error("Please enter a question.")
    else:
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.spinner("Searching knowledge base..."):
            try:
                @st.cache_resource
                def load_rag(): return RAGChain()
                rag = load_rag()
                source = None if st.session_state.source_filter == "All" else st.session_state.source_filter
                if st.session_state.mode == "Chat":
                    h = [{"role": m["role"], "content": m["content"]} for m in st.session_state.messages[-6:]]
                    ans, _ = rag.ask(prompt, conversation_history=h, n_results=st.session_state.n_results, source=source)
                elif st.session_state.mode == "Generate":
                    fw = "selenium" if st.session_state.source_filter in ["All", "selenium"] else "playwright" 
                    code = rag.generate_test_code(prompt, framework=fw, n_results=st.session_state.n_results)
                    lg = "java" if fw == "selenium" else "typescript" 
                    ans = f"Generated {fw.title()} test code:\n\n```{lg}\n{code}\n```" 
                else:
                    ctx, _ = rag.search(prompt, n_results=st.session_state.n_results, source=source)
                    ans = ctx if ctx.strip() else "No results found. Run data ingestion first." 
                st.session_state.messages.append({"role": "assistant", "content": ans})
                st.rerun()
            except Exception as e:
                st.session_state.messages.append({"role": "assistant", "content": f"Error: {str(e)}"})
                st.rerun()